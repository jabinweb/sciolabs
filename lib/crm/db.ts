import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import * as schema from "@/db/schema"
import { postgresClientOptions, resolveDatabaseUrl } from "@/lib/crm/database-url"
import { CRM_DDL, bootstrapDb } from "@/lib/crm/bootstrap"

type AppDb = PostgresJsDatabase<typeof schema>

const globalForDb = globalThis as unknown as {
  sciolabsCrmSql?: ReturnType<typeof postgres>
  sciolabsCrmDb?: AppDb
  sciolabsCrmReady?: Promise<void>
}

function createPg() {
  return postgres(resolveDatabaseUrl(), postgresClientOptions())
}

function buildDb(): AppDb {
  const client = globalForDb.sciolabsCrmSql ?? createPg()
  globalForDb.sciolabsCrmSql = client
  return drizzle(client, { schema })
}

if (!globalForDb.sciolabsCrmDb) {
  globalForDb.sciolabsCrmDb = buildDb()
}

export const db = globalForDb.sciolabsCrmDb
export const sql = globalForDb.sciolabsCrmSql ?? createPg()
globalForDb.sciolabsCrmSql = sql

async function execSql(statement: string) {
  await sql.unsafe(statement)
}

export async function ensureDb() {
  if (process.env.NEXT_PHASE === "phase-production-build") return

  const run = async () => {
    await execSql(CRM_DDL)
    await bootstrapDb(db)
  }

  if (!globalForDb.sciolabsCrmReady) {
    globalForDb.sciolabsCrmReady = run().catch((error) => {
      globalForDb.sciolabsCrmReady = undefined
      throw error
    })
  }

  await globalForDb.sciolabsCrmReady
}
