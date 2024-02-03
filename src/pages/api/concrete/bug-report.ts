import { Octokit } from '@octokit/rest'
import { type NextApiRequest, type NextApiResponse } from 'next/types'
import rateLimit from 'server/rate-limit'

const limiter = rateLimit({
  interval:               60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

type EnvironmentData = {
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
export default void async function ConcreteBugReport(
  req: BugReportRequest,
  res: NextApiResponse
) {
  try {
    await limiter.check(res, 10, 'CACHE_TOKEN') // 10 requests per minute
  } catch {
    res.status(429).json({ error: 'Rate limit exceeded' })
    return
  }

  const {
    context,
    environment,
    resultExpected,
    resultActual,
  } = req.body

  let message = bugReportTemplate

  // Bind all environmentData to the message
  Object.keys(environment).forEach(key => {
    message = message.replace(`{{ ${key} }}`, environment[key])
  })

  message = message
    .replace('{{ context }}', context)
    .replace('{{ resultExpected }}', resultExpected)
    .replace('{{ resultActual }}', resultActual)

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  })

  const response = await octokit.issues.create({
    owner:  'LethalModding',
    repo:   'Concrete',
    title:  'Bug Report',
    body:   message,
    labels: ['triage'],
  })

  res.status(200).json(response.data)
}
