import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Find an admin user to assign as author
  const admin = await prisma.user.findFirst({
    where: { role: 'admin' }
  })

  if (!admin) {
    throw new Error('No admin user found. Please create an admin user first.')
  }

  // Create categories if not exist
  const categories = [
    { name: "Technology", description: "Tech and innovation" },
    { name: "Career", description: "Career guidance and tips" },
    { name: "Education", description: "Education trends and news" },
    { name: "Innovation", description: "Innovative learning" },
    { name: "Language", description: "Language learning" },
    { name: "Wellness", description: "Mental health and wellness" }
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    })
  }

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map(cat => [cat.name, cat.id])
  )

  // Seed posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: "The Future of Educational Technology",
        content: "Exploring how AI and digital platforms are transforming the way we learn and teach in the 21st century.",
        excerpt: "Exploring how AI and digital platforms are transforming the way we learn and teach in the 21st century.",
        slug: "the-future-of-educational-technology",
        isPublished: true,
        publishDate: new Date("2024-12-15"),
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: JSON.stringify(["technology", "ai", "education"]),
        authorId: admin.id,
        categoryId: categoryMap["Technology"]
      },
      {
        title: "Career Guidance in the Digital Age",
        content: "How modern career counseling is adapting to help students navigate an ever-changing job market.",
        excerpt: "How modern career counseling is adapting to help students navigate an ever-changing job market.",
        slug: "career-guidance-in-the-digital-age",
        isPublished: true,
        publishDate: new Date("2024-12-10"),
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: JSON.stringify(["career", "guidance", "students"]),
        authorId: admin.id,
        categoryId: categoryMap["Career"]
      },
      {
        title: "Building Effective Learning Communities",
        content: "The importance of collaborative learning environments and how to create them in educational institutions.",
        excerpt: "The importance of collaborative learning environments and how to create them in educational institutions.",
        slug: "building-effective-learning-communities",
        isPublished: true,
        publishDate: new Date("2024-12-05"),
        imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: JSON.stringify(["education", "community", "collaboration"]),
        authorId: admin.id,
        categoryId: categoryMap["Education"]
      },
      {
        title: "The Role of Gamification in Learning",
        content: "How game-based learning approaches are making education more engaging and effective for students.",
        excerpt: "How game-based learning approaches are making education more engaging and effective for students.",
        slug: "the-role-of-gamification-in-learning",
        isPublished: true,
        publishDate: new Date("2024-11-28"),
        imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: JSON.stringify(["gamification", "learning", "engagement"]),
        authorId: admin.id,
        categoryId: categoryMap["Innovation"]
      },
      {
        title: "Language Learning in Multicultural Societies",
        content: "Addressing the challenges and opportunities of teaching English in diverse cultural contexts.",
        excerpt: "Addressing the challenges and opportunities of teaching English in diverse cultural contexts.",
        slug: "language-learning-in-multicultural-societies",
        isPublished: true,
        publishDate: new Date("2024-11-20"),
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: JSON.stringify(["language", "english", "culture"]),
        authorId: admin.id,
        categoryId: categoryMap["Language"]
      },
      {
        title: "Mental Health Support in Educational Settings",
        content: "The growing importance of providing comprehensive mental health resources for students and educators.",
        excerpt: "The growing importance of providing comprehensive mental health resources for students and educators.",
        slug: "mental-health-support-in-educational-settings",
        isPublished: true,
        publishDate: new Date("2024-11-15"),
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: JSON.stringify(["wellness", "mental-health", "education"]),
        authorId: admin.id,
        categoryId: categoryMap["Wellness"]
      }
    ]
  })

  console.log('Seeded blog posts!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
