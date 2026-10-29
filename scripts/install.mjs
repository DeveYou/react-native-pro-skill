#!/usr/bin/env node
/** Copy this skill to a project and synchronize agent instructions. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h') || !args.some((arg) => !arg.startsWith('--'))) {
  console.log('Usage: node scripts/install.mjs <expo-project-dir> [--force]');
  process.exit(args.includes('--help') || args.includes('-h') ? 0 : 2);
}
const projectArg = args.find((arg) => !arg.startsWith('--'));
const project = path.resolve(projectArg);
const force = args.includes('--force');
if (!fs.existsSync(path.join(project, 'package.json'))) {
  console.error(`Not an initialized Expo project: ${project} (package.json missing)`);
  process.exit(2);
}

const destinations = ['.agents/skills/react-native-pro', '.claude/skills/react-native-pro'];
// Preflight all destinations first so a collision cannot cause a partial install.
for (const relative of destinations) {
  const dest = path.join(project, relative);
  if (fs.existsSync(dest) && fs.realpathSync(dest) !== fs.realpathSync(skillRoot) && !force) {
    console.error(`Existing skill at ${relative}. Re-run with --force to update its contents.`);
    process.exit(2);
  }
}
for (const relative of destinations) {
  const dest = path.join(project, relative);
  if (fs.existsSync(dest)) {
    if (fs.realpathSync(dest) === fs.realpathSync(skillRoot)) {
      console.log(`Already canonical: ${relative}`);
      continue;
    }
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(skillRoot, dest, { recursive: true });
  console.log(`Installed ${relative}`);
}

const cmd = process.execPath;
const result = spawnSync(cmd, [path.join(project, '.agents/skills/react-native-pro/scripts/sync-agent-instructions.mjs'), '--root', project], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);
console.log('Skill installed. Restart agent session if needed and install official expo/skills separately.');
