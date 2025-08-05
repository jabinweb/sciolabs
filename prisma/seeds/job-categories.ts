import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedJobCategories() {
  console.log('🌱 Seeding job categories...')

  const categoriesData = [
    {
      name: 'Education & Training',
      description: 'Teaching, curriculum development, and educational consulting roles',
      icon: 'fas fa-graduation-cap',
      color: 'bg-blue-500'
    },
    {
      name: 'Technology & Development',
      description: 'Software development, product management, and technical roles',
      icon: 'fas fa-code',
      color: 'bg-green-500'
    },
    {
      name: 'Content & Communication',
      description: 'Content creation, writing, marketing, and communication roles',
      icon: 'fas fa-pen-fancy',
      color: 'bg-orange-500'
    },
    {
      name: 'Sales & Marketing',
      description: 'Sales, marketing, and business development positions',
      icon: 'fas fa-chart-line',
      color: 'bg-purple-500'
    },
    {
      name: 'Operations & Administration',
      description: 'Operations, administration, HR, and support roles',
      icon: 'fas fa-cogs',
      color: 'bg-gray-500'
    }
  ]

  for (const categoryData of categoriesData) {
    try {
      const existingCategory = await prisma.jobCategory.findUnique({
        where: { name: categoryData.name }
      })

      if (existingCategory) {
        console.log(`⏭️ Job category "${categoryData.name}" already exists, skipping...`)
        continue
      }

      await prisma.jobCategory.create({
        data: categoryData
      })
      console.log(`✅ Created job category: ${categoryData.name}`)
    } catch (error) {
      console.error(`❌ Error creating job category "${categoryData.name}":`, error)
    }
  }

  console.log('✅ Job categories seeding completed!')
}
