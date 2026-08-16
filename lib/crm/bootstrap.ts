import { prisma } from "@/lib/prisma"

const SCIOLABS_ARTICLES = [
  {
    title: "Contact ScioLabs support",
    slug: "contact-support",
    category: "Getting started",
    body: "Open a ticket at /support/tickets/new or submit a form on the website. We reply by email and in this portal.",
  },
  {
    title: "Track an existing request",
    slug: "track-ticket",
    category: "Getting started",
    body: "Sign in to the support portal with the email you used on the form. Your tickets appear under My tickets.",
  },
] as const

const SCIOLABS_MACROS = [
  {
    title: "Thanks, looking into it",
    shortcut: "#thanks",
    body: "Thank you for writing in. We have your request and will follow up shortly.",
  },
  {
    title: "Need a bit more detail",
    shortcut: "#details",
    body: "Could you share a bit more context so we can help accurately? Screenshots or the page URL are useful if you have them.",
  },
  {
    title: "Resolved — closing out",
    shortcut: "#resolved",
    body: "Glad this is sorted. I am marking the ticket resolved. Reply on this thread if anything else comes up.",
  },
] as const

async function replaceLegacySeed() {
  await prisma.crmKbArticle.deleteMany({
    where: {
      OR: [
        { slug: "device-limits" },
        { title: { contains: "Discovery Bible", mode: "insensitive" } },
        { body: { contains: "Discovery Bible", mode: "insensitive" } },
        { body: { contains: "in-app feedback", mode: "insensitive" } },
      ],
    },
  })

  for (const article of SCIOLABS_ARTICLES) {
    await prisma.crmKbArticle.upsert({
      where: { slug: article.slug },
      create: { ...article, published: true },
      update: {
        title: article.title,
        category: article.category,
        body: article.body,
        published: true,
      },
    })
  }

  await prisma.crmCannedResponse.deleteMany({
    where: {
      OR: [
        { shortcut: "#devices" },
        { shortcut: "#billing" },
        { body: { contains: "Discovery Bible", mode: "insensitive" } },
        { body: { contains: "reader queue", mode: "insensitive" } },
      ],
    },
  })

  for (const macro of SCIOLABS_MACROS) {
    const existing = await prisma.crmCannedResponse.findFirst({
      where: { shortcut: macro.shortcut },
    })
    if (existing) {
      await prisma.crmCannedResponse.update({
        where: { id: existing.id },
        data: { title: macro.title, body: macro.body },
      })
    } else {
      await prisma.crmCannedResponse.create({ data: macro })
    }
  }
}

export async function bootstrapCrm() {
  if ((await prisma.crmCannedResponse.count()) === 0) {
    await prisma.crmCannedResponse.createMany({ data: [...SCIOLABS_MACROS] })
  }
  if ((await prisma.crmKbArticle.count()) === 0) {
    await prisma.crmKbArticle.createMany({
      data: SCIOLABS_ARTICLES.map((article) => ({ ...article, published: true })),
    })
  }
  await replaceLegacySeed()
}

/** @deprecated Use bootstrapCrm */
export const bootstrapDb = bootstrapCrm
export const bootstrapLocalDb = bootstrapCrm
