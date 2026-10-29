# Implementation recipes

## A. New product bootstrap

1. Capture product purpose, target platforms, backend/auth and screenshot preferences. Missing details do not block creating a secure, minimalist shell.
2. Run `npx create-expo-app@latest <name>`, enter project, then `npm run reset-project` **once only on fresh project**. Confirm `src/app` and `@/* -> src/*`.
3. Install compatible base packages per `stack.md`; integrate the current stable NativeWind only after Expo compatibility validation.
4. Install the skill at `.agents/skills/react-native-pro` and regenerate AGENTS/CLAUDE using `scripts/sync-agent-instructions.mjs`.
5. Create `core` providers, tokens, i18n and one vertical slice. Use `blueprints` selectively after matching versions and directory paths.
6. Add app config localization plugin supportedLocales EN/FR/AR, `userInterfaceStyle: automatic`, appropriate permission strings, actual platform IDs.
7. Add light/dark/system preference, safe areas and Arabic RTL change strategy; verify on dev builds.
8. Implement HTTP transport, Zod response parsing, query cache, typed errors, request cancellation and auth lifecycle as required.
9. Test, lint, TypeScript, SDK doctor, iOS/Android checks; document release scope.

## B. Source-of-truth provider assembly

At `src/app/_layout.tsx` or `src/core/providers/app-providers.tsx` compose:

```tsx
<SafeAreaProvider>
  <QueryClientProvider client={queryClient}>
    <AppThemeProvider>
      <I18nReadyGate>
        <RootStack />
      </I18nReadyGate>
    </AppThemeProvider>
  </QueryClientProvider>
</SafeAreaProvider>
```

This is **illustrative**; the named theme/translation components are not part of Expo or this skill's copy-ready blueprints until implemented. Use whichever providers the project actually has. Avoid storing QueryClient in render function. Error boundaries and fallback UI belong near root.

## C. Transport pattern

- `core/api/client.ts`: create Axios instance with validated public base URL, timeout and HTTPS policy; inject short-lived token using an explicit auth-session abstraction; centralized `ApiError` mapping; never log headers/body containing credentials.
- `features/items/api/items.schema.ts`: `z.object({...})` for DTO and pure DTO->model mapper.
- `features/items/api/items.api.ts`: `const data = (await http.get('/items', { signal })).data; return itemListSchema.parse(data);`
- `features/items/hooks/use-items.ts`: TanStack Query with stable `['items', filter]` key, `queryFn({signal})`, loading/error states and invalidation on mutation. Include AppState/NetInfo integrations when relevant.
- Avoid Axios interceptors blindly retrying requests after refresh failure; handle offline, 401, 429 and 5xx distinctly.

## D. Internationalization start

- Copy/adapt `blueprints/src/core/i18n/locale.ts`, `i18n.ts`, `locales/*.json` to `src/core/i18n/`.
- Use `i18n.changeLanguage()` with persisted user preference; on supported native runtimes reconcile `I18nManager.isRTL` with desired Arabic direction and reload only when needed, never in a loop.
- Add preference screen with English, Français, العربية, and "System"; show French fallback for unsupported OS language. Keep preferences outside SecureStore.

## E. NativeWind setup and color modes

- Check currently selected Expo SDK and official NativeWind documentation. Apply **one** documented stable compatible setup and test it on iOS/Android/web targets. Do not mix v4 Babel/Tailwind config and v5 PostCSS/react-native-css config.
- Design tokens must resolve to both light/dark semantic roles. Persist `themeMode: 'system' | 'light' | 'dark'` in AsyncStorage; derive effective mode from `useColorScheme` when system. Synchronize NativeWind color scheme with effective mode, plus StatusBar and appropriate native surface colors.
- If NativeWind isn't verified for the newest Expo SDK, implement core UI with `StyleSheet.create` + tokens rather than compromising the app's build.

## F. Every UI feature must ship with

- Valid navigation and deep-link handling; safe areas and keyboard; accessible interactive controls and labels.
- Semantic tokens, light/dark/system, EN/FR/AR, Arabic RTL, scalable text and responsive layouts.
- Loading skeleton/spinner, empty state, failure state, retry, offline status, success feedback.
- Zod-validated inputs/responses, tested state transitions, privacy-safe logging.
- Screenshots on intended devices when visually matching a provided prototype.
