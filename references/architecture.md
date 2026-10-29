# Feature-driven clean architecture

Keep modularity enforceable without creating needless interfaces for a three-line function.

## Directed dependency graph

```text
src/app (routing/composition) ---> src/features/<feature> public API
              |                           |
              v                           v
         src/core/providers        core API / shared UI / shared lib
                                          |
                                          v
                                 feature domain (pure functions)
```

`core` and `shared` must never import features. Cross-feature workflows coordinate at an application orchestration boundary or a deliberately named public API (`features/<name>/index.ts`), not by importing sibling private files. Use an ESLint import-boundary rule if the repo grows.

## Feature skeleton

```text
src/features/tasks/
  api/tasks.api.ts             # Axios fetch; Zod parsed DTO
  api/tasks.schema.ts          # Wire schema + mapper
  domain/task.ts               # Pure business types / rules
  hooks/use-tasks.ts           # Query key, useQuery, mutations
  components/task-row.tsx      # Accessible UI
  screens/tasks-screen.tsx     # Screen composition / user states
  __tests__/task-rules.test.ts
  __tests__/tasks-screen.test.tsx
  index.ts                    # Export screen and cross-feature safe surface
src/app/(tabs)/tasks.tsx       # `export { TasksScreen as default } from '@/features/tasks';`
```

## Data flow

`Screen -> feature hook -> feature API -> core Axios client -> server`. On return: `untrusted JSON -> Zod parse -> DTO mapper -> domain model -> Query cache -> Screen`. Never parse user input only on the happy path; validate malformed and missing data as errors with user-safe messages.

## Functional boundaries

- Pure domain functions accept data and return results; no imports from React, navigation, Expo, Axios or AsyncStorage.
- Domain types do not expose accidental transport fields (`created_at`) unless part of actual business vocabulary.
- Feature hooks encapsulate orchestration and query keys; UI components do not call Axios directly.
- Reusable UI primitives own accessibility and tokens, not networking or navigation policies.
- Providers are assembled once in `src/app/_layout.tsx` or a dedicated `core/providers/app-providers.tsx`.
- Prefer named exported modules, no barrel exports for internal files; a concise feature `index.ts` is allowed as its public contract.
- Avoid hardcoding a shared "use-case" interface when the domain logic is trivial; introduce application/service contracts where testing and feature complexity warrant them.

## Naming and discipline

- Kebab-case files, PascalCase components, camelCase hooks starting with `use`, meaningful domain names.
- Strict TypeScript, no unchecked `any`, no blanket `as unknown as` casts, use `unknown` + parse at boundaries.
- Explicit loading/empty/error/refetch, pagination, auth expiry and offline strategy per feature.
- Colocate feature tests; write an ADR for major architecture exceptions.
- Prefer imports `@/features/...`, `@/shared/...`, `@/core/...`; tsconfig `"@/*": ["./src/*"]`.

## Adding a feature

1. Define user journey and acceptance criteria; map screenshots and accessibility requirements.
2. Define domain input/output and Zod schemas; write mapping and error handling.
3. Build feature API and query/mutation hook; test loading/error and invalid responses.
4. Implement screen with shared primitives and localized strings.
5. Add thin Expo Router route; update navigation and guards.
6. Verify permissions, security, translations, RTL, system theme and analytics consent where applicable.
7. Run tests, lint, types and on-device smoke checks.
