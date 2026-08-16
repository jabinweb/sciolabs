export function resolveDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) throw new Error("DATABASE_URL is not set")
  return url
}

export function shouldUseLocalFileDb() {
  return false
}

export function postgresClientOptions() {
  return {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 15,
    ssl: "require" as const,
  }
}
