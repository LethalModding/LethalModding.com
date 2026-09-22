import { LRUCache } from 'lru-cache'
import type { NextApiResponse } from 'next'

interface Options {
  uniqueTokenPerInterval?: number
  interval?: number
}

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60_000,
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
