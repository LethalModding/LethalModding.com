import { LRUCache } from 'lru-cache'
import type { NextApiResponse } from 'next'

interface Options {
  uniqueTokenPerInterval?: number
  interval?: number
}

const DEFAULT_MAX_TOKENS = 500
const DEFAULT_INTERVAL_MS = 60_000

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || DEFAULT_MAX_TOKENS,
    ttl: options?.interval || DEFAULT_INTERVAL_MS,
  })

  return {
    check: (res: NextApiResponse, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        const [seen = 0] = tokenCount
        if (seen === 0) {
          tokenCache.set(token, tokenCount)
        }
        const currentUsage = seen + 1
        tokenCount[0] = currentUsage
        const isRateLimited = currentUsage >= limit
        res.setHeader('X-RateLimit-Limit', limit)
        res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : limit - currentUsage)

        return isRateLimited ? reject() : resolve()
      }),
  }
}
