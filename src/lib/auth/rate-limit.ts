// lib/rate-limit.ts
import { RateLimiter } from 'limiter';

export const limiter = new RateLimiter({
  tokensPerInterval: 10,       // 5 attempts
  interval: 'hour' as const,  // TypeScript needs 'as const' for string literals
  fireImmediately: true
});

// export async function checkRateLimit(ip: string): Promise<boolean> {
//   const remainingTokens = await limiter.removeTokens(1);
//   return remainingTokens < 0;
// }
export async function checkRateLimit(): Promise<boolean> {
  const remainingTokens = await limiter.removeTokens(1);
  return remainingTokens < 0;
}

// // Usage in authorize():
// const isLimited = await checkRateLimit(ip);
// if (isLimited) {
//   throw new Error("Too many attempts. Try again later.");
// }