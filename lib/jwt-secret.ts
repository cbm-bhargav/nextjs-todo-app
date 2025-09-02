import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function getJwtSecret(): Promise<string> {
  const secret = await redis.get<string>('JWT_SECRET')
  if (!secret) throw new Error('JWT_SECRET not found in Redis')
  return secret
}
