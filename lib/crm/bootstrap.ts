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
  await seedFormRoutingRules()
}

const FORM_ROUTING_RULES = [
  {
    name: "ScioLabs: REC enquiries",
    trigger: "ticket_created",
    conditions: [{ field: "tag", op: "eq", value: "rec" }],
    actions: [
      { type: "set_type", value: "question" },
      { type: "add_tag", value: "events" },
    ],
  },
  {
    name: "ScioLabs: Job applications",
    trigger: "ticket_created",
    conditions: [{ field: "tag", op: "eq", value: "jobs" }],
    actions: [
      { type: "set_type", value: "general" },
      { type: "add_tag", value: "hiring" },
    ],
  },
  {
    name: "ScioLabs: Website support",
    trigger: "ticket_created",
    conditions: [{ field: "tag", op: "eq", value: "support" }],
    actions: [{ type: "set_type", value: "question" }],
  },
] as const

async function seedFormRoutingRules() {
  for (const rule of FORM_ROUTING_RULES) {
    const existing = await prisma.crmAutomationRule.findFirst({
      where: { name: rule.name },
    })
    if (existing) continue
    await prisma.crmAutomationRule.create({
      data: {
        name: rule.name,
        trigger: rule.trigger,
        conditions: JSON.stringify(rule.conditions),
        actions: JSON.stringify(rule.actions),
        enabled: true,
        sortOrder: Date.now() % 1_000_000,
      },
    })
  }
}

/** @deprecated Use bootstrapCrm */
export const bootstrapDb = bootstrapCrm
export const bootstrapLocalDb = bootstrapCrm
