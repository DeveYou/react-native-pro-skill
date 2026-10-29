# Engineering quality, tests, accessibility and release gates

## Development verification

```sh
npx tsc --noEmit
npx expo lint
npx expo install --check
npx expo-doctor
npm test -- --watch=false   # only if test script is configured
```

Use project-specific commands when scripts differ. Do not invent green checks; report failures and unsupported environments. Formatting should be enforced by Prettier if configured. Avoid `any` casts or disabling rules to silence actual contract issues.

## Test layers

1. **Unit**: pure domain functions, Zod schema parsing, locale resolver, mapping and error classification.
2. **Component/integration**: React Native Testing Library + `jest-expo` matching SDK; accessible controls, query loading/error/empty/success, localized form validation and theme states.
3. **E2E**: Maestro/Detox on actual installed iOS/Android builds for startup, navigation, auth, permission and core journeys; screenshot comparisons when user supplied designs.
4. **Release**: smoke-test production-like build; verify deep links, push notification behavior, update channel, offline experience, text scaling, system appearance and Arabic RTL.

Use fake transport/Mock Service Worker suitable for the platform rather than hitting live production APIs in tests. Test backend authorization separately on the server.

## Acceptance matrix

| Area | Required |
| --- | --- |
| App launch | Cold and warm start, permissions, safe-area, navigation and fallback states |
| Languages | EN, FR, AR, unsupported -> FR (LTR even if unsupported device language is RTL), missing key -> FR, user override persisted |
| Direction | Arabic RTL layout, icons, stack gestures, mixed Arabic/Latin labels |
| Appearance | Light, dark, system; transitions and persistence |
| UX | Screens reader roles, focus/touch target, dynamic type, keyboard, reduced motion |
| Networking | Error, timeout, cancel, unauthorized, malformed payload, offline and reconnect |
| Security | Transport, token lifecycle, logout cleanup, deep links, secrets, permission audit |
| Performance | Virtualized lists, measured startup/render, no avoidable costly re-renders |
| Release | Build profile, identifiers, credentials, update runtime and rollout gates |

## CI plan

On PR: install from lockfile, `tsc`, lint, unit/component tests, Expo dependency check, dependency scan; optionally Android preview build and E2E smoke for high-impact changes. On release: approved manual promotion; deterministic EAS build profile; versioning and release notes; staged release, telemetry and rollback plan. Do not add brittle CI config without testing it against the repository scripts and Expo SDK.

## Review priorities

Security and data loss > crashes > accessibility/user flow > correctness/performance > maintainability > visual polish. Follow platform-specific UX guidelines (iOS Human Interface Guidelines, Android Material guidance), while retaining the product's coherent design system.
