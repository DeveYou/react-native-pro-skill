# React Native Pro Skill

Reusable, cross-agent senior-level engineering instructions for **React Native + Expo** projects. Includes reference guidance, starter blueprints, security/UX/RTL quality gates, and installer/verification scripts. This is an **agent skill, not a finished Expo app or a fully automated app generator**.

## Key defaults

- Expo Router, TypeScript strict, **`src/app`**, feature-driven clean architecture
- Zustand + TanStack Query + Axios + Zod + React Hook Form
- NativeWind **stable when compatible with chosen Expo SDK**, semantic tokens, Lucide, react-native-svg, safe-area-context
- EN, FR, AR; device **primary language** detection, unsupported -> **French**, missing keys -> French; Arabic native RTL
- Minimalist design unless screenshots or design specification override it
- System/light/dark appearance; high accessibility, threat modeling, app security and test/release checks
- Source of truth for `AGENTS.md`/`CLAUDE.md` regeneration and additional agent instructions

## Option 1: use with an existing Expo project

Extract this package anywhere, then run:

```sh
node /path/to/react-native-pro/scripts/install.mjs /path/to/your-expo-app
cd /path/to/your-expo-app
node .agents/skills/react-native-pro/scripts/verify-project.mjs --root .
```

This installs the skill in `.agents/skills/react-native-pro/` for Codex/Antigravity/Cursor/Copilot and `.claude/skills/react-native-pro/` for Claude Code. **The installer also generates root `AGENTS.md` and `CLAUDE.md`**, plus `GEMINI.md` and `.github/copilot-instructions.md`. It preserves content outside clearly marked managed sections. To update installed copies from a newer extracted package, use `node /path/to/.../scripts/install.mjs /path/to/app --force` (review local changes first).

## Option 2: create a brand-new Expo project

Run in the directory where you want your app folder:

```sh
node /path/to/react-native-pro/scripts/new-project.mjs my-app
```

The guided helper runs the required steps **in order**:

```sh
npx create-expo-app@latest my-app
cd my-app
npm run reset-project
```

It then installs this skill and the baseline native/JS dependencies, and checks Expo package alignment. **The reset script is only for a brand-new project; never run it on an app with user code.** The scaffold does *not* pretend NativeWind is compatible with every future Expo SDK: consult its stable install guide and complete integration after checking the actual SDK. Use `--skip-deps` if you want to install dependencies manually.

## Regenerate project agent instructions on every skill use

```sh
node .agents/skills/react-native-pro/scripts/sync-agent-instructions.mjs --root .
node .agents/skills/react-native-pro/scripts/sync-agent-instructions.mjs --root . --check
```

One canonical template `templates/project-agent-rules.md` updates `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` and `.github/copilot-instructions.md`. Run `--check` in CI to prevent drift. Existing custom sections remain intact. A mismatched marker is treated as an error rather than risking overwrites. Each regenerated file includes an actual dependency snapshot from `package.json` so project-specific stack changes remain visible.

## Install official Expo Skills too

**This skill is additive. Expo's official skills remain important**, particularly when SDK versions change:

```sh
npx skills@latest add expo/skills --skill '*'
```

For Codex and Claude Code, use their official Expo plugin integrations where available:

```sh
codex plugin add expo@openai-curated
claude plugin install expo@claude-plugins-official
```

See https://docs.expo.dev/skills/ and https://github.com/expo/skills .

## Example agent prompt

> Use `react-native-pro` to build a professional inventory app with Expo Router and feature-driven clean architecture. Create the project using `npx create-expo-app@latest`, run `npm run reset-project`, keep `src/`, implement EN/FR/AR with French fallback and Arabic RTL, system/light/dark color mode and a minimalist UI. Install official Expo skills, regenerate `AGENTS.md` and `CLAUDE.md`, enforce security guidelines, and verify tests plus on-device UX. If I attach screenshots, follow their design instead.

## Package map

```text
react-native-pro/
  SKILL.md                           Agent skill entrypoint
  README.md                          Installation and workflow
  references/                        Deep guides: stack, architecture, UI, i18n, security, quality, agents, recipes
  templates/project-agent-rules.md   Shared agent instruction source
  scripts/install.mjs                Install into an existing app and sync instructions
  scripts/new-project.mjs            New Expo app, reset starter, install skill/deps
  scripts/sync-agent-instructions.mjs Regenerate managed AGENTS/CLAUDE/GEMINI/Copilot sections
  scripts/verify-project.mjs         Non-destructive structure + instruction check
  blueprints/                        Small example i18n/theme/env modules (not an app)
  tests/                             Offline Node integration tests for scripts
```

## Honest scope

The installation and instruction-generation scripts can be locally syntax/integration tested. An actual app's UI, RTL switching, NativeWind setup, signing and security depend on its Expo SDK, backend, configuration, target devices and deployment constraints. No skill can guarantee production readiness by itself.

## Sources of truth

- Expo: https://docs.expo.dev/ and https://docs.expo.dev/skills/
- Expo Router src structure: https://docs.expo.dev/router/reference/src-directory/
- Localization and native RTL: https://docs.expo.dev/guides/localization/
- SecureStore: https://docs.expo.dev/versions/latest/sdk/securestore/
- NativeWind stable and RC docs: https://www.nativewind.dev/docs/getting-started/installation and https://www.nativewind.dev/v5/getting-started/installation
- Agent skills: https://antigravity.google/docs/skills and https://cursor.com/help/customization/skills

## Self-test (does not access Expo or the network)

```sh
node --test tests/scripts.test.mjs
```
