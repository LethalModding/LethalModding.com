import type { NextApiRequest, NextApiResponse } from 'next/types'
import { ofetch } from 'ofetch'

const HTTP_NO_CONTENT = 204
const HTTP_METHOD_NOT_ALLOWED = 405
const HTTP_BAD_REQUEST = 400
const HTTP_INTERNAL_ERROR = 500
const HTTP_OK = 200
const THUNDERSTORE_PACKAGE_ID_PARTS = 2

// https://thunderstore.io/api/experimental/package/
export default async function TSExperimentalPackage(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { id } = req.query

  if (req.method === 'OPTIONS') {
    return res.status(HTTP_NO_CONTENT).json({ status: 'ok' })
  }

  if (req.method !== 'GET') {
    return res.status(HTTP_METHOD_NOT_ALLOWED).json({ error: 'Method Not Allowed' })
  }

  if (!Array.isArray(id) || id.length !== THUNDERSTORE_PACKAGE_ID_PARTS) {
    return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid ID' })
  }

  const response = await ofetch(
    `https://thunderstore.io/api/experimental/package/${id.join('/')}/`,
    {
      cache: 'no-store',
      credentials: 'omit',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'LethalModding/lethal-modding',
      },
      method: 'GET',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
    },
  )

  if (!response) {
    return res.status(HTTP_INTERNAL_ERROR).json({ error: 'Failed to fetch data from Thunderstore' })
  }

  res.status(HTTP_OK).json(response)
}
