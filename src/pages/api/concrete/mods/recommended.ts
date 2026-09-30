import type { NextApiRequest, NextApiResponse } from 'next/types'
import mods from '@/server/recommended-mods.json' with { type: 'json' }

const HTTP_NO_CONTENT = 204
const HTTP_METHOD_NOT_ALLOWED = 405
const HTTP_OK = 200

export default function ConcreteModsRecommended(req: NextApiRequest, res: NextApiResponse): void {
  if (req.method === 'OPTIONS') {
    res.status(HTTP_NO_CONTENT).json({ status: 'ok' })
    return
  }

  if (req.method !== 'GET') {
    res.status(HTTP_METHOD_NOT_ALLOWED).json({ error: 'Method Not Allowed' })
    return
  }

  res.status(HTTP_OK).json(mods)
}
