#!/usr/bin/env node
/** Non-destructive structural check. Doesn't replace compilation or native testing. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node verify-project.mjs --root <project-dir> [--strict]');
  process.exit(0);
}
const idx = args.indexOf('--root');
const root = path.resolve(idx >= 0 && args[idx + 1] ? args[idx + 1] : process.cwd());
const strict = args.includes('--strict');
const requiredFiles = ['package.json', 'src/app/_layout.tsx', 'src/app/index.tsx', 'AGENTS.md', 'CLAUDE.md', '.agents/skills/react-native-pro/SKILL.md'];
let bad = 0;
for (const file of requiredFiles) {
  const exists = fs.existsSync(path.join(root, file));
  console.log(`${exists ? 'PASS' : 'FAIL'} ${file}`);
  if (!exists) bad++;
}
const pkgFile = path.join(root, 'package.json');
if (!fs.existsSync(pkgFile)) process.exit(2);
const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
for (const dependency of ['expo', 'expo-router', 'react-native-safe-area-context', 'react-native-svg', 'expo-localization', 'expo-secure-store', 'axios', 'zod', 'zustand', '@tanstack/react-query', 'i18next', 'react-i18next', 'lucide-react-native']) {
  const exists = !!deps[dependency];
  console.log(`${exists ? 'PASS' : strict ? 'FAIL' : 'WARN'} dependency: ${dependency}`);
  if (!exists && strict) bad++;
}
const tsconfig = path.join(root, 'tsconfig.json');
if (fs.existsSync(tsconfig)) {
  const text = fs.readFileSync(tsconfig, 'utf8');
  const hasAlias = text.includes('"@/*"') && /\.\/src\/\*/.test(text);
  console.log(`${hasAlias ? 'PASS' : 'WARN'} TypeScript alias @/* points to src/*`);
  if (!hasAlias && strict) bad++;
}
const script = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'sync-agent-instructions.mjs');
const check = spawnSync(process.execPath, [script, '--root', root, '--check'], { stdio: 'inherit' });
if (check.status !== 0) {
  console.error('FAIL managed agent instructions are stale or invalid');
  bad++;
}
console.log(`\n${bad ? `Verification reported ${bad} failure(s)` : 'Structural checks passed'} (not a replacement for tests/builds).`);
process.exit(bad ? 1 : 0);
