import { type NextApiRequest, type NextApiResponse } from 'next/types'
import { ofetch } from 'ofetch'

// https://thunderstore.io/api/experimental/package/
export default async function TSExperimentalPackage(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { id } = req.query

  if (req.method === 'OPTIONS') {
    return res.status(204).json({ status: 'ok' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!Array.isArray(id) || id.length != 2) {
    return res.status(400).json({ error: 'Invalid ID' })
  }

  const response = await ofetch(
    `https://thunderstore.io/api/experimental/package/${id.join('/')}/`,
    {
      cache:       'no-store',
      credentials: 'omit',
      headers:     {
        'Accept':     'application/json',
        'User-Agent': 'LethalModding/lethal-modding',
      },
      method:         'GET',
      referrerPolicy: 'no-referrer',
      redirect:       'follow',
    }
  )

  if (!response) {
    return res.status(500).json({ error: 'Failed to fetch data from Thunderstore' })
  }

  res.status(200).json(response)
}
