import { prisma } from "@/lib/prisma"
import { bootstrapCrm } from "@/lib/crm/bootstrap"

export { prisma as db }

const globalForCrm = globalThis as unknown as {
  sciolabsCrmReady?: Promise<void>
}

export async function ensureDb() {
  if (process.env.NEXT_PHASE === "phase-production-build") return

  if (!globalForCrm.sciolabsCrmReady) {
    globalForCrm.sciolabsCrmReady = bootstrapCrm().catch((error) => {
      globalForCrm.sciolabsCrmReady = undefined
      throw error
    })
  }

  await globalForCrm.sciolabsCrmReady
}
