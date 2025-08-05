import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedJobs() {
  console.log('🌱 Seeding jobs...')

  // First, get an admin user to be the creator
  const adminUser = await prisma.user.findFirst({
    where: { role: 'admin' }
  })

  if (!adminUser) {
    console.log('⚠️ No admin user found. Please create an admin user first.')
    return
  }

  // Get job categories
  const educationCategory = await prisma.jobCategory.findUnique({
    where: { name: 'Education & Training' }
  })
  
  const technologyCategory = await prisma.jobCategory.findUnique({
    where: { name: 'Technology & Development' }
  })
  
  const contentCategory = await prisma.jobCategory.findUnique({
    where: { name: 'Content & Communication' }
  })

  const jobsData = [
    {
      title: 'Curriculum Developer',
      slug: 'curriculum-developer',
      description: 'We are looking for a creative and experienced Curriculum Developer to join our education team. You will be responsible for designing and developing innovative educational content and curricula for our various programs. The ideal candidate should have a strong background in educational design, understand modern pedagogy, and be passionate about creating engaging learning experiences.',
      qualifications: [
        'Bachelor\'s degree in Education, Instructional Design, or related field',
        'Master\'s degree preferred',
        '2-4 years of experience in curriculum development',
        'Strong understanding of learning theories and educational best practices',
        'Experience with digital learning platforms and ed-tech tools',
        'Excellent written and verbal communication skills',
        'Proficiency in design software (Adobe Creative Suite, Canva, etc.)',
        'Experience with Learning Management Systems (LMS)',
        'Knowledge of CBSE curriculum is a plus'
      ],
      location: 'Lucknow / Remote',
      workHours: 'Full-time, Monday to Friday, 9:00 AM - 6:00 PM',
      payOut: '₹4,50,000 - ₹7,00,000 per annum (negotiable based on experience)',
      department: 'Education & Training',
      type: 'Full-time',
      experience: '2-4 years',
      isActive: true,
      applicationDeadline: new Date('2024-12-31'),
      createdBy: adminUser.id,
      categoryId: educationCategory?.id
    },
    {
      title: 'Full Stack Developer',
      slug: 'full-stack-developer',
      description: 'Join our technology team as a Full Stack Developer to build and maintain our educational platforms and web applications. You will work on cutting-edge educational technology solutions, collaborating with designers and product managers to create seamless user experiences for learners and educators.',
      qualifications: [
        'Bachelor\'s degree in Computer Science, Software Engineering, or related field',
        '2-5 years of full-stack development experience',
        'Proficiency in React.js, Next.js, Node.js, and TypeScript',
        'Experience with databases (PostgreSQL, MongoDB)',
        'Knowledge of cloud platforms (AWS, Vercel, etc.)',
        'Understanding of RESTful APIs and GraphQL',
        'Experience with version control (Git)',
        'Familiarity with educational technology is a plus',
        'Strong problem-solving and debugging skills'
      ],
      location: 'Lucknow / Remote',
      workHours: 'Full-time, Monday to Friday, 10:00 AM - 7:00 PM',
      payOut: '₹6,00,000 - ₹12,00,000 per annum (based on experience)',
      department: 'Technology & Development',
      type: 'Full-time',
      experience: '2-5 years',
      isActive: true,
      applicationDeadline: new Date('2024-12-15'),
      createdBy: adminUser.id,
      categoryId: technologyCategory?.id
    },
    {
      title: 'Content Writer',
      slug: 'content-writer',
      description: 'We are seeking a talented Content Writer to create compelling educational content for our programs and marketing materials. You will be responsible for writing engaging blog posts, educational materials, course content, and marketing copy that resonates with our diverse audience of learners and educators.',
      qualifications: [
        'Bachelor\'s degree in English, Journalism, Communications, or related field',
        '1-3 years of content writing experience',
        'Excellent writing, editing, and proofreading skills',
        'Experience with SEO content writing',
        'Familiarity with content management systems',
        'Understanding of educational content and learning objectives',
        'Ability to write for different audiences and platforms',
        'Research skills and attention to detail',
        'Experience with social media content creation is a plus'
      ],
      location: 'Remote',
      workHours: 'Part-time, Flexible hours (20-25 hours per week)',
      payOut: '₹25,000 - ₹40,000 per month (based on hours and experience)',
      department: 'Content & Communication',
      type: 'Part-time',
      experience: '1-3 years',
      isActive: true,
      applicationDeadline: new Date('2025-01-31'),
      createdBy: adminUser.id,
      categoryId: contentCategory?.id
    },
    {
      title: 'Educational Consultant',
      slug: 'educational-consultant',
      description: 'We are looking for an experienced Educational Consultant to provide expert guidance on educational best practices and program implementation. You will work with schools and educational institutions to help them improve their teaching methodologies and implement effective learning solutions.',
      qualifications: [
        'Master\'s degree in Education or related field',
        '5+ years of experience in educational consulting or leadership',
        'Strong knowledge of educational frameworks and methodologies',
        'Experience working with K-12 institutions',
        'Excellent presentation and communication skills',
        'Ability to travel for client meetings',
        'Knowledge of educational technology trends',
        'Experience with teacher training programs'
      ],
      location: 'Lucknow / Travel Required',
      workHours: 'Full-time, Flexible schedule based on client needs',
      payOut: '₹8,00,000 - ₹15,00,000 per annum (plus travel allowances)',
      department: 'Education & Training',
      type: 'Full-time',
      experience: '5+ years',
      isActive: true,
      createdBy: adminUser.id,
      categoryId: educationCategory?.id
    },
    {
      title: 'UI/UX Designer',
      slug: 'ui-ux-designer',
      description: 'Join our design team to create intuitive and engaging user experiences for our educational platforms. You will be responsible for designing user interfaces that make learning accessible and enjoyable for students of all ages.',
      qualifications: [
        'Bachelor\'s degree in Design, HCI, or related field',
        '2-4 years of UI/UX design experience',
        'Proficiency in design tools (Figma, Adobe XD, Sketch)',
        'Strong portfolio showcasing educational or web applications',
        'Understanding of user-centered design principles',
        'Experience with prototyping and user testing',
        'Knowledge of accessibility standards',
        'Ability to collaborate with development teams',
        'Experience with design systems is a plus'
      ],
      location: 'Remote',
      workHours: 'Contract, 30-40 hours per week',
      payOut: '₹50,000 - ₹80,000 per month (contract basis)',
      department: 'Technology & Development',
      type: 'Contract',
      experience: '2-4 years',
      isActive: true,
      applicationDeadline: new Date('2024-11-30'),
      createdBy: adminUser.id,
      categoryId: technologyCategory?.id
    },
    {
      title: 'EdTech Product Manager',
      slug: 'edtech-product-manager',
      description: 'Lead product development for our gamified learning platforms and educational tools. You will work closely with engineering, design, and education teams to build products that transform how students learn and teachers teach.',
      qualifications: [
        'Bachelor\'s degree in Business, Engineering, or related field',
        'MBA preferred',
        '3-6 years of product management experience',
        'Experience in EdTech or educational products',
        'Strong analytical and data-driven decision making skills',
        'Understanding of agile development methodologies',
        'Excellent stakeholder management skills',
        'Knowledge of learning management systems',
        'Experience with user research and product analytics'
      ],
      location: 'Lucknow',
      workHours: 'Full-time, Monday to Friday, 9:30 AM - 6:30 PM',
      payOut: '₹12,00,000 - ₹20,00,000 per annum (plus equity)',
      department: 'Technology & Development',
      type: 'Full-time',
      experience: '3-6 years',
      isActive: true,
      createdBy: adminUser.id,
      categoryId: technologyCategory?.id
    },
    {
      title: 'Training Specialist',
      slug: 'training-specialist',
      description: 'Deliver high-quality training sessions and workshops to diverse audiences including educators, corporate professionals, and students. You will design and conduct training programs that help participants develop essential skills for their professional growth.',
      qualifications: [
        'Bachelor\'s degree in Education, Training, or related field',
        '1-3 years of training or teaching experience',
        'Excellent presentation and facilitation skills',
        'Experience with adult learning principles',
        'Ability to adapt training style to different audiences',
        'Strong organizational and time management skills',
        'Experience with online training platforms',
        'Multilingual capabilities (Hindi, English) preferred',
        'Certification in training methodologies is a plus'
      ],
      location: 'Lucknow',
      workHours: 'Full-time, Schedule varies based on training programs',
      payOut: '₹3,50,000 - ₹6,00,000 per annum',
      department: 'Education & Training',
      type: 'Full-time',
      experience: '1-3 years',
      isActive: true,
      createdBy: adminUser.id,
      categoryId: educationCategory?.id
    },
    {
      title: 'Instructional Designer',
      slug: 'instructional-designer',
      description: 'Design effective learning experiences and instructional materials for our various educational programs. You will create engaging content that helps learners achieve their educational goals through well-structured and pedagogically sound instruction.',
      qualifications: [
        'Master\'s degree in Instructional Design, Education Technology, or related field',
        '2-4 years of instructional design experience',
        'Experience with ADDIE or similar instructional design models',
        'Proficiency in eLearning authoring tools (Articulate, Captivate)',
        'Knowledge of learning theories and adult learning principles',
        'Experience creating multimedia learning content',
        'Understanding of assessment and evaluation methods',
        'Strong project management skills',
        'Experience with LMS platforms'
      ],
      location: 'Lucknow / Remote',
      workHours: 'Full-time, Monday to Friday, 9:00 AM - 6:00 PM',
      payOut: '₹5,00,000 - ₹9,00,000 per annum',
      department: 'Content & Communication',
      type: 'Full-time',
      experience: '2-4 years',
      isActive: true,
      applicationDeadline: new Date('2025-02-15'),
      createdBy: adminUser.id,
      categoryId: contentCategory?.id
    }
  ]

  // Create jobs
  for (const jobData of jobsData) {
    try {
      const existingJob = await prisma.job.findUnique({
        where: { slug: jobData.slug }
      })

      if (existingJob) {
        console.log(`⏭️ Job "${jobData.title}" already exists, skipping...`)
        continue
      }

      await prisma.job.create({
        data: {
          ...jobData,
          qualifications: jobData.qualifications // Prisma handles JSON conversion
        }
      })
      console.log(`✅ Created job: ${jobData.title}`)
    } catch (error) {
      console.error(`❌ Error creating job "${jobData.title}":`, error)
    }
  }

  console.log('✅ Jobs seeding completed!')
}
