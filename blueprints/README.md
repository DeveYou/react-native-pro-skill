# Example blueprints, not a complete application

Use these files as starting points after creating/resetting an Expo app and installing compatible dependencies. **Do not copy the entire directory blindly.** The actual app must add providers, language-preference persistence and an RTL direction-change/restart flow; `i18n.ts` alone does not implement those behaviors. `env.ts` intentionally fails fast until `EXPO_PUBLIC_API_URL` is configured as a non-secret HTTPS endpoint. Adapt Zod syntax to the actual installed major version.

For a working production UI, also implement the NativeWind-compatible theme strategy, query focus/online integration, error boundaries, secure token lifecycle, screen components, tests, and navigation.
