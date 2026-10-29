# Standard stack and version-selection rules

> **Version policy:** Choose the latest **stable** Expo SDK that suits the user's deployment constraints. Do not pin historical SDK, React Native, React or navigation versions in a reusable skill. Verify official docs and `npx expo install --check` against the actual project. Install native packages using `npx expo install` so Expo selects supported versions. When a library has not documented support for the SDK, pause that integration and document a compatible alternative rather than forcing peer dependencies.

| Layer | Standard | Guidance |
| --- | --- | --- |
| App base | Expo, RN, strict TypeScript | Managed/prebuild as appropriate; development builds for unsupported Expo Go APIs |
| Navigation | Expo Router | File routes in `src/app`, deep linking, route groups, typed routes when supported |
| Safe areas | `react-native-safe-area-context` | `SafeAreaProvider`, scoped safe-area usage; no hardcoded status bar heights |
| Icons/Vectors | `lucide-react-native`, `react-native-svg` | Named icon wrapper, role-driven stroke color/size |
| Styling | NativeWind **stable compatible release** + semantic tokens | Do not use v5 RC in a production app without conscious opt-in and testing; when compatibility is unverified use RN `StyleSheet` + tokens until validated |
| Appearance | React Native `useColorScheme`, `expo-system-ui` as needed | System default, explicit light/dark preference, persist only non-secret preference |
| Server state | `@tanstack/react-query` | Request caching, key factories, mutations/invalidation, Android connectivity and AppState focus wiring |
| HTTP | `axios` | Single instance, HTTPS base URL, timeout, bearer header injection, typed errors, cancellation, restricted retry logic |
| Runtime types | `zod` | DTO, app config and user input validation; sanitize strings where rendered externally |
| Client state | `zustand` | Small stores for UI, workflow and non-sensitive user preferences, never server cache copies |
| Forms | `react-hook-form` + `@hookform/resolvers` | Zod schema, per-field labels, keyboard aware, localized errors |
| Localization | `expo-localization`, `i18next`, `react-i18next` | en/fr/ar, French fallback, Arabic RTL, localized formats, persisted optional override |
| Sensitive storage | `expo-secure-store` | Small credentials only, guarded retrieval, never assume backups survive reinstall |
| Non-secret storage | `@react-native-async-storage/async-storage` | Locale, appearance, onboarding, no tokens or PII |
| Images | `expo-image` | Caching, placeholders, responsive rendering where useful |
| Animation | Reanimated/worklets when needed | Follow SDK version matrix; reduced-motion support |
| Tests | `jest-expo`, React Native Testing Library, flow E2E (Maestro/Detox) | Use compatible versions; smoke-test on real builds |
| Quality | ESLint + Prettier + TS strict | CI gates, audit, reviews, architecture check |

## Base installation (inside freshly reset Expo project)

```sh
npx expo install react-native-safe-area-context react-native-svg expo-localization \
  expo-secure-store expo-system-ui @react-native-async-storage/async-storage
npm install @tanstack/react-query axios zod zustand \
  i18next react-i18next react-hook-form @hookform/resolvers lucide-react-native
npx expo install --check
npx expo-doctor
```

Install extra native dependencies **as a feature needs them**, not speculatively. For styling, follow the matching NativeWind stable-version install guide **for the detected Expo SDK**, configuring Metro, Babel, Tailwind/CSS and type declarations per that guide. For v4 use Tailwind CSS 3 configuration; **do not paste v5's Tailwind 4/React Native CSS configuration into v4**. Revalidate after SDK upgrades. `NativeWind v5` is a pre-release as of October 2026. If stable NativeWind support for the chosen SDK is unverified, do not claim the styling setup works.

## Stack ownership rules

- **React Query** owns remote collections, pagination, invalidation, refetch and server loading/errors. Use staleTime deliberately, cancel requests on unmount when supported, avoid retries on authorization or destructive operations.
- **Zustand** owns only local UI/session *metadata* where necessary. Never persist raw token material in a Zustand persistence adapter backed by AsyncStorage.
- **Axios** implements a transport, not domain policy. Feature APIs validate response DTOs with Zod and expose mapped domain data; interceptors must not cause infinite 401 refresh loops.
- **Zod** validates at runtime. TypeScript types alone do not protect network responses or env values.
- **Expo Router** handles navigational composition; route files should be thin, re-export screens with navigation wrappers.
- **Theme tokens** define semantic colors, spacings, radii, type scales and motion. Never scatter hex literals or dark-mode class conditionals through product screens.

## Official references to check on every significant upgrade

- https://docs.expo.dev/skills/
- https://github.com/expo/skills
- https://docs.expo.dev/get-started/create-a-project/
- https://docs.expo.dev/router/reference/src-directory/
- https://docs.expo.dev/versions/latest/
- https://www.nativewind.dev/docs/getting-started/installation
- https://www.nativewind.dev/v5/getting-started/installation
- https://tanstack.com/query/latest/docs/framework/react/guides/network-mode
