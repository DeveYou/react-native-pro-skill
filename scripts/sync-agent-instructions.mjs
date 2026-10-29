#!/usr/bin/env node
/**
 * Regenerate skill-managed rule sections without overwriting user content.
 * Usage: node scripts/sync-agent-instructions.mjs --root /path/to/project [--check]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  if (!args[index + 1] || args[index + 1].startsWith('--')) {
    throw new Error(`${name} requires a value`);
  }
  return args[index + 1];
};

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node sync-agent-instructions.mjs --root <project-dir> [--check]');
  process.exit(0);
}

const root = path.resolve(getArg('--root') ?? process.cwd());
const check = args.includes('--check');
if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error(`Not a project (missing package.json): ${root}`);
  process.exit(2);
}

const rules = fs.readFileSync(path.join(skillRoot, 'templates', 'project-agent-rules.md'), 'utf8').trim();
const projectPackage = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const declared = { ...projectPackage.dependencies, ...projectPackage.devDependencies };
const snapshotItems = [
  ['Expo', 'expo'], ['React Native', 'react-native'], ['Expo Router', 'expo-router'],
  ['NativeWind', 'nativewind'], ['React Query', '@tanstack/react-query'],
  ['Axios', 'axios'], ['Zod', 'zod'], ['Zustand', 'zustand'],
  ['Localization', 'expo-localization'], ['SVG', 'react-native-svg'],
  ['Safe Areas', 'react-native-safe-area-context'], ['Lucide', 'lucide-react-native'],
];
const stackSnapshot = `## Dependency snapshot (from package.json; not runtime verified)\n\n${snapshotItems
  .map(([label, packageName]) => `- ${label}: ${declared[packageName] ?? 'not declared (add after SDK compatibility review)'}`)
  .join('\n')}\n\nKeep this snapshot aligned with the real project; it reports declarations, not installed or verified package versions.`;
const begin = '<!-- BEGIN react-native-pro managed rules -->';
const end = '<!-- END react-native-pro managed rules -->';
const blockFor = (file) => `${begin}\n# ${file} | React Native Pro managed rules\n\n${rules}\n\n${stackSnapshot}\n${end}`;
const targets = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', path.join('.github', 'copilot-instructions.md')];
const normalize = (value) => value.replace(/\r\n/g, '\n');
let stale = false;

for (const relative of targets) {
  const file = path.join(root, relative);
  const existing = fs.existsSync(file) ? normalize(fs.readFileSync(file, 'utf8')) : '';
  const haveBegin = existing.includes(begin);
  const haveEnd = existing.includes(end);
  if (haveBegin !== haveEnd) {
    console.error(`Refusing to change ${relative}: only one managed marker found`);
    stale = true;
    continue;
  }
  if (haveBegin && (existing.split(begin).length !== 2 || existing.split(end).length !== 2)) {
    console.error(`Refusing to change ${relative}: ambiguous or duplicate managed markers`);
    stale = true;
    continue;
  }

  let next;
  if (haveBegin) {
    const first = existing.indexOf(begin);
    const last = existing.indexOf(end) + end.length;
    next = existing.slice(0, first) + blockFor(path.basename(relative)) + existing.slice(last);
  } else {
    next = existing.trimEnd() ? `${existing.trimEnd()}\n\n${blockFor(path.basename(relative))}\n` : `${blockFor(path.basename(relative))}\n`;
  }
  if (next !== existing) {
    stale = true;
    if (!check) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, next, 'utf8');
      console.log(`Updated ${relative}`);
    } else {
      console.error(`Out of date: ${relative}`);
    }
  } else {
    console.log(`Current: ${relative}`);
  }
}

if (check && stale) process.exit(1);
if (stale && !check) console.log('Managed instructions regenerated; custom sections preserved.');
