import { Octokit } from '@octokit/rest'
import type { NextApiRequest, NextApiResponse } from 'next/types'
import { serverEnv } from '@/env.ts'
import { rateLimit } from '@/server/rate-limit.ts'

const MS_PER_SECOND = 1000
const RATE_LIMIT_WINDOW_MS = 60 * MS_PER_SECOND
const HTTP_TOO_MANY_REQUESTS = 429
const HTTP_OK = 200

const RATE_LIMIT_MAX_REQUESTS = 10

const limiter = rateLimit({
  interval: RATE_LIMIT_WINDOW_MS, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

interface EnvironmentData {
  version: string
  buildDate: string
  branch: string
  commit: string
  commitDate: string
  language: string
  locale: string
  timezone: string
  os: string
  osVersion: string
  osArch: string
  osBuild: string
  wine: string
  wineHost: string
  wineHostVersion: string
  wineHostArch: string
  wineHostBuild: string
}

type BugReportRequest = NextApiRequest & {
  body: {
    context: string
    environment: EnvironmentData
    resultExpected: string
    resultActual: string
  }
}

const bugReportTemplate = `
#Context
{{ context }}

## Expected Result
{{ resultExpected }}

## Actual Result
{{ resultActual }}

<details>
  <Summary>Additional Information</Summary>

  ## Application
  Concrete {{ version }} {{ buildDate }} {{branch}}#{{ commit }}@{{ commitDate }}

  ## Environment
  - Language: {{ language }}
  - Locale: {{ locale }} ({{ timezone }})
  - OS: {{ os }} {{ osVersion }} {{ osArch }} ({{ osBuild }})
  - WINE?: {{ wine }}
  - WINE_HOST: {{ wineHost }} ({{ wineHostVersion }}) {{ wineHostArch }} ({{ wineHostBuild }})
</details>
`

// NextJS API Route for submitting bug reports
export default async function ConcreteBugReport(
  req: BugReportRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    await limiter.check(res, RATE_LIMIT_MAX_REQUESTS, 'CACHE_TOKEN') // 10 requests per minute
  } catch {
    res.status(HTTP_TOO_MANY_REQUESTS).json({ error: 'Rate limit exceeded' })
    return
  }

  const { context, environment, resultExpected, resultActual } = req.body

  let message = bugReportTemplate

  // Bind all environmentData to the message
  for (const key of Object.keys(environment)) {
    message = message.replace(`{{ ${key} }}`, environment[key])
  }

  message = message
    .replace('{{ context }}', context)
    .replace('{{ resultExpected }}', resultExpected)
    .replace('{{ resultActual }}', resultActual)

  const octokit = new Octokit({
    auth: serverEnv.githubToken,
  })

  const response = await octokit.issues.create({
    owner: 'LethalModding',
    repo: 'Concrete',
    title: 'Bug Report',
    body: message,
    labels: ['triage'],
  })

  res.status(HTTP_OK).json(response.data)
}
