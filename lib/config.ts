export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue

  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }

  return value
}

export const OPENAI_API_KEY = getEnvVar('OPENAI_API_KEY')
export const SITE_URL = getEnvVar('NEXT_PUBLIC_SITE_URL', 'http://localhost:8080')
// Add other environment variables as needed
