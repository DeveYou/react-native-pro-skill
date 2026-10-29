/** Pure locale policy, independent of Expo so it can be unit tested. */
export const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const FALLBACK_LANGUAGE: AppLanguage = 'fr';

export function normalizeLanguage(value: string | null | undefined): AppLanguage | null {
  if (!value) return null;
  const code = value.trim().toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.find((language) => language === code) ?? null;
}

/** Explicit override takes precedence. Unsupported device PRIMARY locale -> French. */
export function resolveLanguage(
  primaryDeviceLanguage: string | null | undefined,
  preference: string | null | undefined = 'system',
): AppLanguage {
  if (preference !== 'system' && preference != null) {
    return normalizeLanguage(preference) ?? FALLBACK_LANGUAGE;
  }
  return normalizeLanguage(primaryDeviceLanguage) ?? FALLBACK_LANGUAGE;
}

export const isRtlLanguage = (language: AppLanguage): boolean => language === 'ar';
