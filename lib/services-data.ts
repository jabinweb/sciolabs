export interface ServiceFeature {
  id: number;
  icon: string;
  title: string;
  description: string;
  featured: boolean;
  link?: string;
}

export interface ServiceData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: ServiceFeature[];
  primaryColor: string;
  borderColor: string;
  buttonColor: string;
  backgroundGradient: string;
  imageUrl: string;
  imageAlt: string;
  partnersTitle: string;
  partnersIcon: string;
  partnersIconColor: string;
  detailedFeatures: string[];
  benefits: string[];
  targetAudience: string[];
  serviceLink: string;
  getStartedLink: string;
  subserviceLinks: { name: string; link: string }[];
}

export const servicesData: ServiceData[] = [
  {
    id: "thrive",
    title: "ScioThrive",
    subtitle: "Skill-building programs to accelerate growth and unlock potential in academic and professional settings",
    description: "Designed to accelerate professional growth through modern teaching strategies, corporate training, and specialized programs for educators, professionals, and teenagers.",
    features: [
      {
        id: 1,
        icon: "fas fa-chalkboard-teacher",
        title: "Educator Training",
        description: "Equip teachers with modern pedagogy and practical ed-tech tools.",
        featured: false,
        link: "/services/thrive/educator-training"
      },
      {
        id: 2,
        icon: "fas fa-briefcase",
        title: "Corporate Training",
        description: "Boost team productivity and communication with targeted skill-building sessions.",
        featured: false,
        link: "/services/thrive/corporate-training"
      },
      {
        id: 3,
        icon: "fas fa-graduation-cap",
        title: "GenZ Training",
        description: "Empowering teens and young adults with essential life skills and effective communication.",
        featured: false,
        link: "/services/thrive/teens-training"
      }
    ],
    primaryColor: "scio-blue",
    borderColor: "scio-blue",
    buttonColor: "scio-blue",
    backgroundGradient: "from-blue-50 via-sky-50 to-slate-50",
    imageUrl: "/1.jpg",
    imageAlt: "Professional training and education",
    partnersTitle: "Our Past Clients",
    partnersIcon: "fas fa-handshake",
    partnersIconColor: "text-scio-blue",
    detailedFeatures: [
      "Educator Training",
      "Corporate Training",
      "Teens Training",
      "Leadership Development",
      "Digital Skills Training"
    ],
    benefits: [
      "Enhanced teaching methodologies",
      "Improved workplace productivity",
      "Better leadership skills",
      "Future-ready skill development"
    ],
    targetAudience: [
      "Educators and teachers",
      "Corporate professionals",
      "Teenagers and young adults",
      "Team leaders and managers"
    ],
    serviceLink: "/services/thrive",
    getStartedLink: "#",
    subserviceLinks: [
      { name: "Educator Training", link: "/services/thrive/educator-training" },
      { name: "Corporate Training", link: "/services/thrive/corporate-training" },
      { name: "Teens Training", link: "/services/thrive/teens-training" }
    ]
  },
  {
    id: "sprints",
    title: "ScioSprints",
    subtitle: "Gamified learning and digital revision tools to boost learner engagement and classroom outcomes",
    description: "Revolutionary gamified learning solutions and custom educational portals that enhance student engagement through interactive content and personalized learning experiences.",
    features: [
      {
        id: 1,
        icon: "fas fa-gamepad",
        title: "Standard CBSE Portal",
        description: "Curriculum-aligned gamified revision for middle school CBSE students — for schools and individual learners.",
        featured: false,
        link: "/services/sprints/cbse"
      },
      {
        id: 2,
        icon: "fas fa-school",
        title: "Custom School Portals",
        description: "Personalized revision platforms tailored to your school's curriculum and branding.",
        featured: false,
        link: "/services/sprints/custom-portals"
      }
    ],
    primaryColor: "scio-blue",
    borderColor: "scio-blue",
    buttonColor: "scio-blue",
    backgroundGradient: "from-blue-50 via-sky-50 to-slate-50",
    imageUrl: "/2.jpg",
    imageAlt: "Gamified learning and educational technology",
    partnersTitle: "Digital Platforms",
    partnersIcon: "fas fa-handshake",
    partnersIconColor: "text-scio-blue",
    detailedFeatures: [
      "CBSE Gamified Content",
      "Custom School Portals",
      "Interactive Learning",
      "Progress Tracking",
      "Branded Solutions"
    ],
    benefits: [
      "Increased student engagement",
      "Better learning outcomes",
      "Personalized learning paths",
      "Real-time progress tracking"
    ],
    targetAudience: [
      "CBSE schools",
      "Educational institutions",
      "Students (Grades 4-8)",
      "Educational technology teams"
    ],
    serviceLink: "https://sprints.sciolabs.in",
    getStartedLink: "https://sprints.sciolabs.in/",
    subserviceLinks: [
      { name: "CBSE (4–8)", link: "/services/sprints/cbse" },
      { name: "Custom School Portals", link: "/services/sprints/custom-portals" }
    ]
  },
  {
    id: "lingua",
    title: "ScioLingua",
    subtitle: "Custom English programs designed to build confidence and communication in diverse learning contexts",
    description: "Innovative language programs that integrate faith-based learning with foundational English education, designed for diverse educational needs and spiritual growth.",
    features: [
      {
        id: 1,
        icon: "fas fa-book",
        title: "TheoLingua",
        description: "A Bible-based ESL program to strengthen theological reading and communication skills.",
        featured: false,
        link: "https://theo.sciolabs.in/"
      },
      {
        id: 2,
        icon: "fas fa-seedling",
        title: "rootED",
        description: "A foundational English program to build literacy and communication skills for early learners and ESL students.",
        featured: false,
        link: "/services/lingua/rooted"
      }
    ],
    primaryColor: "scio-blue",
    borderColor: "scio-blue",
    buttonColor: "scio-blue",
    backgroundGradient: "from-blue-50 via-sky-50 to-slate-50",
    imageUrl: "/5.jpg",
    imageAlt: "Language learning and education",
    partnersTitle: "Educational Partners",
    partnersIcon: "fas fa-handshake",
    partnersIconColor: "text-scio-blue",
    detailedFeatures: [
      "TheoLingua - Level 1",
      "TheoLingua - Level 2", 
      "TheoLingua - Level 3",
      "rootED - Foundations (Class 3)",
      "rootED - Expressions (Class 7)"
    ],
    benefits: [
      "Integrated faith and language learning",
      "Age-appropriate curriculum",
      "Cultural and spiritual growth",
      "Strong foundation in English"
    ],
    targetAudience: [
      "Faith-based institutions",
      "Elementary school students",
      "Religious communities",
      "Educational institutions"
    ],
    serviceLink: "/services/lingua",
    getStartedLink: "#",
    subserviceLinks: [
      { name: "TheoLingua", link: "https://theo.sciolabs.in" },
      { name: "rootED", link: "/services/lingua/rooted" }
    ]
  },
  {
    id: "care",
    title: "ScioCare",
    subtitle: "Equipping healthcare and community workers with essential communication and professional skills",
    description: "Focused on empowering caregivers and frontline workers with essential communication skills and professional development opportunities in healthcare and community services.",
    features: [
      {
        id: 1,
        icon: "fas fa-heart",
        title: "CareBridge English",
        description: "Empowering caregivers with role-specific English and workplace communication skills.",
        featured: false,
        link: "/services/care/carebridge-english"
      },
      {
        id: 2,
        icon: "fas fa-rocket",
        title: "CareSteps",
        description: "Foundational soft skills training for freshers entering caregiving professions.",
        featured: false,
        link: "/services/care/carelaunch"
      },
      {
        id: 3,
        icon: "fas fa-compass",
        title: "Pathways360°",
        description: "Finishing school program for healthcare professionals for personal, social, and professional readiness.",
        featured: false,
        link: "/services/care/pathways360"
      }
    ],
    primaryColor: "scio-blue",
    borderColor: "scio-blue",
    buttonColor: "scio-blue",
    backgroundGradient: "from-blue-50 via-sky-50 to-slate-50",
    imageUrl: "/3.jpg",
    imageAlt: "Healthcare and caregiving training",
    partnersTitle: "Healthcare Partners",
    partnersIcon: "fas fa-handshake",
    partnersIconColor: "text-scio-blue",
    detailedFeatures: [
      "CareBridge English",
      "CareLaunch",
      "Pathways360°",
      "Healthcare Communication",
      "Professional Certification"
    ],
    benefits: [
      "Improved patient communication",
      "Career advancement opportunities",
      "Cultural sensitivity training",
      "Professional recognition"
    ],
    targetAudience: [
      "Healthcare workers",
      "Caregivers",
      "Frontline workers",
      "Community service providers"
    ],
    serviceLink: "https://care.sciolabs.in",
    getStartedLink: "#",
    subserviceLinks: [
      { name: "CareBridge English", link: "/services/care/carebridge-english" },
      { name: "CareLaunch", link: "/services/care/carelaunch" },
      { name: "Pathways360°", link: "/services/care/pathways360" }
    ]
  },
  {
    id: "guidance",
    title: "ScioGuidance",
    subtitle: "Personalized career guidance and strategic planning for students and professionals",
    description: "Our comprehensive career guidance program helps individuals discover their potential and chart clear paths to success through personalized counseling, interactive workshops, and digital platforms.",
    features: [
      {
        id: 1,
        icon: "fas fa-user-graduate",
        title: "One-on-One Counseling",
        description: "Personalized guidance and assessments to clarify career paths and choices.",
        featured: false,
        link: "/services/guidance/counseling"
      },
      {
        id: 2,
        icon: "fas fa-users",
        title: "Career Workshops",
        description: "Interactive sessions that introduce students to diverse career opportunities.",
        featured: false,
        link: "/services/guidance/workshops"
      },
      {
        id: 3,
        icon: "fas fa-globe",
        title: "Career Portal",
        description: "Explore careers digitally with tools for planning, discovery, and growth.",
        featured: false,
        link: "/services/guidance/portal"
      }
    ],
    primaryColor: "scio-blue",
    borderColor: "scio-blue",
    buttonColor: "scio-blue",
    backgroundGradient: "from-blue-50 via-sky-50 to-slate-50",
    imageUrl: "/4.jpg",
    imageAlt: "Students in career guidance session",
    partnersTitle: "Schools that we Enable",
    partnersIcon: "fas fa-handshake",
    partnersIconColor: "text-scio-blue",
    detailedFeatures: [
      "One-on-One Counseling",
      "Career Awareness Workshops", 
      "Career Awareness Portal",
      "Psychometric Assessments",
      "Industry Exposure Programs"
    ],
    benefits: [
      "Discover your true potential and strengths",
      "Make informed career decisions",
      "Access to industry insights and trends",
      "Personalized career roadmaps"
    ],
    targetAudience: [
      "High school students",
      "College students",
      "Working professionals",
      "Career changers"
    ],
    serviceLink: "https://guidance.sciolabs.in",
    getStartedLink: "https://guidance.sciolabs.in/",
    subserviceLinks: [
      { name: "One-on-One Counseling", link: "/services/guidance/counseling" },
      { name: "Career Workshops", link: "/services/guidance/workshops" },
      { name: "Career Portal", link: "/services/guidance/portal" }
    ]
  }
];
