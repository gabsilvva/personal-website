/**
 * Whether a Postgres connection string points to this machine (as opposed to the shared Neon database).
 */
export const isLocalDatabase = (connectionString: string | undefined): boolean => {
  if (!connectionString) return true

  try {
    const { hostname } = new URL(connectionString)
    return ['localhost', '127.0.0.1', '::1', '[::1]', ''].includes(hostname)
  } catch {
    return false
  }
}
