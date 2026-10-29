import { z } from 'zod';

/** EXPO_PUBLIC_* values are public client config, NEVER secrets. */
const publicConfigSchema = z.object({
  apiUrl: z.url().refine((url) => url.startsWith('https://'), {
    message: 'Public API URL must use HTTPS in release builds',
  }),
});

export const publicConfig = publicConfigSchema.parse({
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
});
