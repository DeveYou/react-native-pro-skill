#!/usr/bin/env node
/** Interactive Expo scaffolding; requires Node, npm, npx and internet. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--'));
if (!name || args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/new-project.mjs <app-name> [--skip-deps]');
  console.log('Creates a NEW Expo Router app, runs npm run reset-project, installs the skill and compatible base dependencies.');
  process.exit(args.includes('--help') || args.includes('-h') ? 0 : 2);
}
if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name) || name === '.' || name === '..') {
  console.error('Use a safe app folder name with letters, numbers, hyphens or underscores.');
  process.exit(2);
}
const dir = path.resolve(process.cwd(), name);
if (fs.existsSync(dir)) {
  console.error(`Refusing to overwrite existing folder: ${dir}`);
  process.exit(2);
}
const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cmd = (command, commandArgs, cwd) => {
  console.log(`\n> ${command} ${commandArgs.join(' ')}`);
  const result = spawnSync(command, commandArgs, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    console.error(`Command failed with exit code ${result.status ?? 'unknown'}`);
    process.exit(result.status ?? 1);
  }
};

cmd('npx', ['create-expo-app@latest', name], process.cwd());
cmd('npm', ['run', 'reset-project'], dir); // interactive and only after creating a new app
if (!fs.existsSync(path.join(dir, 'src', 'app', '_layout.tsx'))) {
  console.error('The new Expo project has no src/app/_layout.tsx. Inspect scaffold/template before proceeding.');
  process.exit(1);
}
cmd(process.execPath, [path.join(skillRoot, 'scripts', 'install.mjs'), dir], process.cwd());
if (!args.includes('--skip-deps')) {
  cmd('npx', ['expo', 'install', 'react-native-safe-area-context', 'react-native-svg', 'expo-localization', 'expo-secure-store', 'expo-system-ui', '@react-native-async-storage/async-storage'], dir);
  cmd('npm', ['install', '@tanstack/react-query', 'axios', 'zod', 'zustand', 'i18next', 'react-i18next', 'react-hook-form', '@hookform/resolvers', 'lucide-react-native'], dir);
  cmd('npx', ['expo', 'install', '--check'], dir);
  cmd('npx', ['expo-doctor'], dir);
}
console.log(`\nCreated ${dir}`);
console.log('Next: install official expo/skills and integrate NativeWind only after verifying stable compatibility with this Expo SDK.');
console.log('Then implement tokens, providers, locale+RTL, theme, routes, tests; see SKILL.md and references/recipes.md.');
