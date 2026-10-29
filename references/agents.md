# Multi-agent compatibility and instruction synchronization

## Single source of truth

- Place canonical skill at `.agents/skills/react-native-pro/SKILL.md`. This path is picked up by **Codex**, **Antigravity**, **Cursor**, **VS Code/GitHub Copilot** and several other supporting agents in current implementations.
- `scripts/install.mjs` copies a **second complete skill folder** to `.claude/skills/react-native-pro/` for Claude Code. Re-run installer to refresh both copies; avoid hand-editing the duplicated Claude copy.
- The same installation script generates / updates the managed blocks in `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and `.github/copilot-instructions.md`, without clobbering hand-written instructions outside those blocks. **Root AGENTS.md and CLAUDE.md must be regenerated on every skill use.**
- `templates/project-agent-rules.md` is the shared canonical rules block. To change default standards, update this file and run the synchronization script. Edit the skill's main docs first when changing engineering policy.

## Install into an existing project

From the downloaded skill folder:

```sh
node scripts/install.mjs /absolute/path/to/expo-project
```

Then from project root:

```sh
node .agents/skills/react-native-pro/scripts/sync-agent-instructions.mjs --root .
node .agents/skills/react-native-pro/scripts/verify-project.mjs --root .
```

Or run `node scripts/new-project.mjs <app-name>` to create a new Expo project (network and interactive `npm run reset-project` are required). **Do not run reset-project on an existing application.**

## Native agent locations (alternative manual installation)

| Agent | Skill location |
| --- | --- |
| Codex | `.agents/skills/react-native-pro/` |
| Antigravity (current) | `.agents/skills/react-native-pro/` (`.agent/skills/` legacy) |
| Cursor | `.agents/skills/react-native-pro/` or `.cursor/skills/react-native-pro/` |
| Claude Code | `.claude/skills/react-native-pro/` |
| GitHub Copilot / VS Code | `.agents/skills/react-native-pro/` or `.github/skills/react-native-pro/` |
| OpenCode, Windsurf, others | Check their current agent skill docs; shared `.agents/skills/` may be supported |

Agent availability/discovery varies by version. Reopen or restart agent session to discover a newly added skill if necessary. Regenerating instruction files keeps prompt-level rules aligned but does not guarantee every agent executes the skill automatically; users can explicitly invoke it.

## Official Expo skill integration

Install `expo/skills` **in addition to** this higher-level architecture skill:

```sh
npx skills@latest add expo/skills --skill '*'
```

On Claude Code and Codex, official Expo plugins may be preferred for update management:

```sh
claude plugin install expo@claude-plugins-official
codex plugin add expo@openai-curated
```

Don't duplicate conflicting instructions. Follow official Expo version-specific API guidance first while enforcing this skill's locale, architecture, UX and security constraints.

Docs: https://github.com/expo/skills ; https://antigravity.google/docs/skills ; https://cursor.com/help/customization/skills ; https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview ; https://code.visualstudio.com/docs/agent-customization/agent-skills
