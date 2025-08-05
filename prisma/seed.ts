import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { seedJobCategories } from './seeds/job-categories'
import { seedJobs } from './seeds/jobs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user if it doesn't exist
  const adminEmail = 'admin@sciolabs.in'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123456', 12)
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        emailVerified: new Date()
      }
    })
    console.log('✅ Created admin user:', adminEmail)
  } else {
    console.log('⏭️ Admin user already exists')
  }

  // Seed job categories first
  await seedJobCategories()

  // Seed jobs (now with categories)
  await seedJobs()

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
