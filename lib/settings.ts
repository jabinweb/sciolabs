import { prisma } from "@/lib/prisma"

export interface SiteSettings {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    contactEmail: string
    contactPhone: string
    address: string
    socialMedia: {
      facebook?: string
      twitter?: string
      linkedin?: string
      instagram?: string
    }
  }
  email: {
    smtpHost: string
    smtpPort: string
    smtpUser: string
    smtpPassword: string
    smtpFromName: string
    smtpFromEmail: string
    adminEmails: string[]
  }
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    ogImage?: string
    googleAnalyticsId?: string
    googleSiteVerification?: string
  }
  maintenance: {
    enabled: boolean
    message: string
    allowedIps: string[]
  }
  features: {
    blogEnabled: boolean
    newsletterEnabled: boolean
    contactFormEnabled: boolean
    jobApplicationsEnabled: boolean
  }
  security: {
    maxLoginAttempts: number
    sessionTimeout: number
    passwordMinLength: number
    requireEmailVerification: boolean
  }
}

// Default settings - fallback values
const defaultSettings: SiteSettings = {
  general: {
    siteName: 'ScioLabs',
    siteDescription: 'Transforming careers and lives through personalized guidance and innovative training programs.',
    siteUrl: 'https://sciolabs.in',
    contactEmail: 'info@sciolabs.in',
    contactPhone: '+91 9495212484',
    address: 'N-304, Ashiyana Sector – N, Lucknow – 226012, India',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  },
  email: {
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpFromName: 'ScioLabs',
    smtpFromEmail: 'info@sciolabs.in',
    adminEmails: ['info@sciolabs.in']
  },
  seo: {
    metaTitle: 'ScioLabs - Upward Equipping',
    metaDescription: 'Transforming careers and lives through personalized guidance and innovative training programs.',
    metaKeywords: 'education,training,career guidance,professional development',
    googleAnalyticsId: 'G-2SFQVP82SD',
    googleSiteVerification: ''
  },
  maintenance: {
    enabled: false,
    message: 'We\'re currently performing scheduled maintenance. Please check back soon.',
    allowedIps: ['127.0.0.1']
  },
  features: {
    blogEnabled: true,
    newsletterEnabled: true,
    contactFormEnabled: true,
    jobApplicationsEnabled: true
  },
  security: {
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireEmailVerification: false
  }
}

// Get all settings from database
export async function getSettings(): Promise<SiteSettings> {
  try {
    // Check if prisma.setting exists before using it
    if (!prisma.setting) {
      console.warn('Setting model not found in Prisma client, using defaults')
      return defaultSettings
    }

    const dbSettings = await prisma.setting.findMany()
    
    // Start with default settings
    const settings: SiteSettings = JSON.parse(JSON.stringify(defaultSettings))
    
    // Override with database values
    for (const setting of dbSettings) {
      const [category, key] = setting.key.split('.')
      const value = JSON.parse(setting.value)
      
      if (category in settings) {
        const categorySettings = settings[category as keyof SiteSettings] as Record<string, unknown>
        if (key && typeof categorySettings === 'object' && categorySettings !== null) {
          categorySettings[key] = value
        } else {
          // Handle nested objects like socialMedia
          Object.assign(categorySettings, value)
        }
      }
    }
    
    return settings
  } catch (error) {
    console.error('Error fetching settings from database:', error)
    return defaultSettings
  }
}

// Update multiple settings categories at once
export async function updateMultipleSettings(updates: Partial<SiteSettings>): Promise<void> {
  try {
    console.log('Checking prisma.setting availability...')
    
    // More robust check for prisma.setting
    if (!prisma || !prisma.setting || typeof prisma.setting.findUnique !== 'function') {
      console.error('Setting model not properly initialized in Prisma client')
      console.log('Available prisma models:', Object.keys(prisma || {}))
      throw new Error('Setting model not available in Prisma client. Please run: npx prisma generate && npx prisma db push')
    }

    console.log('Prisma setting model is available, proceeding with updates...')

    // Process updates in smaller batches to avoid overwhelming the database
    const batchSize = 5
    const allOperations = []
    
    for (const [category, data] of Object.entries(updates)) {
      console.log(`Processing category: ${category}`)
      
      if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
        for (const [key, value] of Object.entries(data)) {
          const settingKey = `${category}.${key}`
          console.log(`Processing setting: ${settingKey}`)
          
          try {
            // Check if setting exists first
            const existingSetting = await prisma.setting.findUnique({
              where: { key: settingKey }
            }).catch(error => {
              console.error(`Error checking existing setting for ${settingKey}:`, error)
              return null
            })
            
            if (existingSetting) {
              // Update existing setting
              allOperations.push(
                prisma.setting.update({
                  where: { key: settingKey },
                  data: {
                    value: JSON.stringify(value),
                    category: category,
                    updatedAt: new Date()
                  }
                })
              )
            } else {
              // Create new setting
              allOperations.push(
                prisma.setting.create({
                  data: {
                    key: settingKey,
                    value: JSON.stringify(value),
                    category: category
                  }
                })
              )
            }
          } catch (settingError) {
            console.error(`Error processing setting ${settingKey}:`, settingError)
            // Continue with other settings instead of failing completely
          }
        }
      } else {
        // Handle entire category as single setting
        try {
          const existingSetting = await prisma.setting.findUnique({
            where: { key: category }
          }).catch(error => {
            console.error(`Error checking existing category ${category}:`, error)
            return null
          })
          
          if (existingSetting) {
            allOperations.push(
              prisma.setting.update({
                where: { key: category },
                data: {
                  value: JSON.stringify(data),
                  category: category,
                  updatedAt: new Date()
                }
              })
            )
          } else {
            allOperations.push(
              prisma.setting.create({
                data: {
                  key: category,
                  value: JSON.stringify(data),
                  category: category
                }
              })
            )
          }
        } catch (categoryError) {
          console.error(`Error processing category ${category}:`, categoryError)
        }
      }
    }
    
    console.log(`Prepared ${allOperations.length} operations for execution`)
    
    if (allOperations.length > 0) {
      // Execute operations in batches
      for (let i = 0; i < allOperations.length; i += batchSize) {
        const batch = allOperations.slice(i, i + batchSize)
        console.log(`Executing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(allOperations.length / batchSize)}`)
        
        try {
          await prisma.$transaction(batch)
          console.log(`Batch ${Math.floor(i / batchSize) + 1} completed successfully`)
        } catch (batchError) {
          console.error(`Error executing batch ${Math.floor(i / batchSize) + 1}:`, batchError)
          // Try executing individual operations in this batch
          for (const operation of batch) {
            try {
              await operation
            } catch (opError) {
              console.error('Error executing individual operation:', opError)
            }
          }
        }
      }
      console.log('All settings operations completed')
    } else {
      console.log('No operations to execute')
    }
  } catch (error) {
    console.error('Error updating multiple settings:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Setting model not available')) {
        throw new Error('Database configuration error. Please run: npx prisma generate && npx prisma db push')
      } else if (error.message.includes('findUnique')) {
        throw new Error('Database connection error. Please check your database configuration.')
      } else {
        throw new Error(`Settings update failed: ${error.message}`)
      }
    } else {
      throw new Error('Failed to update settings due to unknown error')
    }
  }
}

// Update specific settings category
export async function updateSettings(category: keyof SiteSettings, data: SiteSettings[keyof SiteSettings]): Promise<void> {
  try {
    // Check if prisma.setting exists
    if (!prisma.setting) {
      throw new Error('Setting model not available in Prisma client')
    }

    if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
      const operations = []
      
      for (const [key, value] of Object.entries(data)) {
        const settingKey = `${category}.${key}`
        
        const existingSetting = await prisma.setting.findUnique({
          where: { key: settingKey }
        })
        
        if (existingSetting) {
          operations.push(
            prisma.setting.update({
              where: { key: settingKey },
              data: {
                value: JSON.stringify(value),
                category: category,
                updatedAt: new Date()
              }
            })
          )
        } else {
          operations.push(
            prisma.setting.create({
              data: {
                key: settingKey,
                value: JSON.stringify(value),
                category: category
              }
            })
          )
        }
      }
      
      if (operations.length > 0) {
        await prisma.$transaction(operations)
      }
    } else {
      // Store entire category as single setting
      const existingSetting = await prisma.setting.findUnique({
        where: { key: category }
      })
      
      if (existingSetting) {
        await prisma.setting.update({
          where: { key: category },
          data: {
            value: JSON.stringify(data),
            category: category,
            updatedAt: new Date()
          }
        })
      } else {
        await prisma.setting.create({
          data: {
            key: category,
            value: JSON.stringify(data),
            category: category
          }
        })
      }
    }
  } catch (error) {
    console.error('Error updating settings in database:', error)
    throw new Error('Failed to update settings')
  }
}

// Get specific setting value with better error handling
export async function getSetting(key: string): Promise<unknown> {
  try {
    // More robust check for prisma.setting
    if (!prisma || !prisma.setting || typeof prisma.setting.findUnique !== 'function') {
      console.warn('Setting model not found, using defaults for key:', key)
      const [category, settingKey] = key.split('.')
      const defaults = defaultSettings[category as keyof SiteSettings] as Record<string, unknown>
      
      if (settingKey && defaults && typeof defaults === 'object') {
        return defaults[settingKey]
      }
      
      return defaults
    }

    const setting = await prisma.setting.findUnique({
      where: { key }
    }).catch(error => {
      console.error(`Error fetching setting ${key}:`, error)
      return null
    })
    
    if (setting) {
      try {
        return JSON.parse(setting.value)
      } catch (parseError) {
        console.error(`Error parsing setting value for ${key}:`, parseError)
        return setting.value // Return raw value if JSON parsing fails
      }
    }
    
    // Return default value if not found
    const [category, settingKey] = key.split('.')
    const defaults = defaultSettings[category as keyof SiteSettings] as Record<string, unknown>
    
    if (settingKey && defaults && typeof defaults === 'object') {
      return defaults[settingKey]
    }
    
    return defaults
  } catch (error) {
    console.error('Error fetching setting:', error)
    // Always return something useful
    const [category, settingKey] = key.split('.')
    const defaults = defaultSettings[category as keyof SiteSettings] as Record<string, unknown>
    
    if (settingKey && defaults && typeof defaults === 'object') {
      return defaults[settingKey]
    }
    
    return defaults || null
  }
}

// Initialize settings with defaults (run on first setup)
export async function initializeSettings(): Promise<void> {
  try {
    // Check if Setting model exists in Prisma client
    if (!prisma.setting) {
      console.warn('Setting model not found in Prisma client. Please run: npx prisma generate && npx prisma db push')
      return
    }

    // Check if Setting table exists and is accessible
    const tableExists = await prisma.setting.findFirst().catch(() => null)
    console.log('Setting table accessible:', tableExists !== undefined)
    
    const existingSettings = await prisma.setting.count()
    
    if (existingSettings === 0) {
      console.log('Initializing default settings...')
      
      // Initialize settings one by one to avoid transaction issues
      for (const [category, categoryData] of Object.entries(defaultSettings)) {
        try {
          await updateSettings(category as keyof SiteSettings, categoryData)
        } catch (error) {
          console.error(`Error initializing category ${category}:`, error)
        }
      }
      
      console.log('Default settings initialized successfully')
    } else {
      console.log(`Found ${existingSettings} existing settings`)
    }
  } catch (error) {
    console.error('Error initializing settings:', error)
    console.log('This might indicate that the Setting model is not properly generated or the database table does not exist.')
    console.log('Please run the following commands to fix this:')
    console.log('1. npx prisma generate')
    console.log('2. npx prisma db push')
  }
}
