import type { NextApiRequest, NextApiResponse } from 'next/types'
import mods from '@/server/recommended-mods.json' with { type: 'json' }

export default function ConcreteModsRecommended(req: NextApiRequest, res: NextApiResponse): void {
  if (req.method === 'OPTIONS') {
    res.status(204).json({ status: 'ok' })
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  res.status(200).json(mods)
}
