import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { Footer } from './globals/Footer'
import { Header } from './globals/Header'
import { Settings } from './globals/Settings'
import { AboutPage } from './globals/pages/AboutPage'
import { HomePage } from './globals/pages/HomePage'
import { ProjectsPage } from './globals/pages/ProjectsPage'
import { UsesPage } from './globals/pages/UsesPage'
import { plugins } from './plugins'
import { pt } from '@payloadcms/translations/languages/pt'
import { en } from '@payloadcms/translations/languages/en'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { isLocalDatabase } from './utilities/isLocalDatabase'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// `vercel env pull --environment=production` writes "[SENSITIVE]" instead of secret values
for (const key of ['DATABASE_URL', 'BLOB_READ_WRITE_TOKEN'] as const) {
  if (process.env[key]?.includes('[SENSITIVE]')) {
    throw new Error(
      `${key} is the "[SENSITIVE]" placeholder from \`vercel env pull\`. Copy the real value into .env.local.`,
    )
  }
}

// Without the Blob token, uploads land on this machine's disk while their rows go to the shared
// database, so production would show broken images. `vercel env pull` brings both together.
if (!isLocalDatabase(process.env.DATABASE_URL) && !process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error(
    'BLOB_READ_WRITE_TOKEN is required when DATABASE_URL points to the shared database. Run `vercel env pull .env.local`.',
  )
}

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Schema changes only go through migrations (src/migrations), never through dev-mode push.
    // This keeps `pnpm dev` from silently altering the shared production database.
    // Set DATABASE_PUSH=true to opt back in when pointing at a throwaway local database.
    push: process.env.DATABASE_PUSH === 'true',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  collections: [Pages, Projects, Media, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [HomePage, AboutPage, ProjectsPage, UsesPage, Settings, Header, Footer],
  // Admin interface language
  i18n: {
    supportedLanguages: { pt, en },
    fallbackLanguage: 'pt',
  },
  // Content languages. Empty English fields fall back to Portuguese.
  localization: {
    locales: [
      { label: 'Português', code: 'pt' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'pt',
    fallback: true,
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
