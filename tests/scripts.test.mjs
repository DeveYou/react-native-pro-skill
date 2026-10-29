import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (script, ...args) => spawnSync(process.execPath, [path.join(skillRoot, 'scripts', script), ...args], { encoding: 'utf8' });

const project = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-pro-test-'));
  fs.mkdirSync(path.join(dir, 'src/app'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'fixture', dependencies: { expo: '~58.0.0', 'expo-router': '^7' } }));
  fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { paths: { '@/*': ['./src/*'] } } }));
  fs.writeFileSync(path.join(dir, 'src/app/index.tsx'), 'export default function Screen() { return null; }');
  fs.writeFileSync(path.join(dir, 'src/app/_layout.tsx'), 'export default function Layout() { return null; }');
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), 'Custom instructions must stay.\n');
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), 'Claude custom notes must stay.\n');
  return dir;
};

test('installation, managed instruction updates, preservation and drift detection', () => {
  const dir = project();
  try {
    assert.equal(run('install.mjs', dir).status, 0);
    const agentPath = path.join(dir, 'AGENTS.md');
    const claudePath = path.join(dir, 'CLAUDE.md');
    assert.ok(fs.existsSync(path.join(dir, '.agents/skills/react-native-pro/SKILL.md')));
    assert.ok(fs.existsSync(path.join(dir, '.claude/skills/react-native-pro/SKILL.md')));
    assert.match(fs.readFileSync(agentPath, 'utf8'), /Custom instructions must stay/);
    assert.match(fs.readFileSync(claudePath, 'utf8'), /Claude custom notes must stay/);
    assert.match(fs.readFileSync(agentPath, 'utf8'), /Expo: ~58\.0\.0/);
    assert.equal(run('sync-agent-instructions.mjs', '--root', dir, '--check').status, 0);
    const before = fs.readFileSync(agentPath, 'utf8');
    assert.equal(run('sync-agent-instructions.mjs', '--root', dir).status, 0);
    assert.equal(fs.readFileSync(agentPath, 'utf8'), before, 'Regeneration should be idempotent');
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    pkg.dependencies.nativewind = '^4.2.7';
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg));
    assert.equal(run('sync-agent-instructions.mjs', '--root', dir, '--check').status, 1);
    assert.equal(run('sync-agent-instructions.mjs', '--root', dir).status, 0);
    assert.match(fs.readFileSync(agentPath, 'utf8'), /NativeWind: \^4\.2\.7/);
    assert.equal(run('sync-agent-instructions.mjs', '--root', dir, '--check').status, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('malformed managed markers are refused and manual content preserved', () => {
  const dir = project();
  try {
    fs.appendFileSync(path.join(dir, 'AGENTS.md'), '<!-- BEGIN react-native-pro managed rules -->\n');
    const original = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
    const result = run('sync-agent-instructions.mjs', '--root', dir, '--check');
    assert.equal(result.status, 1);
    assert.equal(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), original);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
