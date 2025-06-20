// lib/auth-utils.ts
import { NextApiRequest } from 'next';
import { getClientIp } from 'request-ip';

export function getSafeIp(req: NextApiRequest): string {
    try {
        const ip = getClientIp(req) || req.socket?.remoteAddress;
        if (!ip || typeof ip !== 'string') {
            return 'unknown';
        }
        return ip.split(',')[0].trim(); // Handle potential proxy chains
    } catch (error) {
        return 'unknown';
    }
}