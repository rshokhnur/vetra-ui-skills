#!/usr/bin/env node
// Vetra UI skills installer. Run it from your project folder:
//
//   npx github:rshokhnur/vetra-ui-skills install     install, or update to the latest skills
//   npx github:rshokhnur/vetra-ui-skills status      the version installed here
//
// Options:
//   --agent claude    .claude/skills/ in this project (Claude Code)            default when .claude/ exists
//   --agent other     ./vetra-ui/ plus a line in ./AGENTS.md (Cursor, Codex…)  default otherwise
//   --agent both      both of the above
//   --global          Claude Code only: ~/.claude/skills/ for every project
//   --dir <path>      project folder (default: the current folder)
//
// Running install again updates the skills: it replaces the vetra-* folders and never touches your
// "Changes to Vetra UI" section.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SKILLS = join(here, '..', 'skills');
const VERSION = JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8')).version;
const MANIFEST = '.vetra-ui.json';
const AGENTS_LINE = 'Before any UI work, read vetra-ui/AGENTS.md and follow it.';

const args = process.argv.slice(2);
const cmd = args[0] && !args[0].startsWith('--') ? args[0] : 'install';
const opt = (name) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
const flag = (name) => args.includes('--' + name);
const say = (s) => process.stdout.write(s + '\n');
const die = (s) => { process.stderr.write('vetra-ui: ' + s + '\n'); process.exit(1); };

if (flag('help') || flag('h') || !['install', 'update', 'status'].includes(cmd)) { say(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 15).map((l) => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(['install', 'update', 'status', 'help'].includes(cmd) || flag('help') ? 0 : 1); }
if (!existsSync(SKILLS)) die(`the skills are missing from this package (${SKILLS}). Run it again with npx.`);

const project = resolve(opt('dir') || process.cwd());
const manifest = (() => { try { return JSON.parse(readFileSync(join(project, MANIFEST), 'utf8')); } catch { return {}; } })();
if (cmd === 'status') { say(`Installed here: ${manifest.version ? manifest.version + ' (' + manifest.agent + ')' : 'none'}. Latest: ${VERSION}.`); process.exit(0); }
const agent = opt('agent') || manifest.agent || (existsSync(join(project, '.claude')) ? 'claude' : 'other');
if (!['claude', 'other', 'both'].includes(agent)) die('--agent is claude, other or both');
const global = flag('global') || !!manifest.global;

const skillDirs = readdirSync(SKILLS).filter((d) => d.startsWith('vetra-'));
const done = [];

if (agent === 'claude' || agent === 'both') {
  const root = global ? join(homedir(), '.claude', 'skills') : join(project, '.claude', 'skills');
  mkdirSync(root, { recursive: true });
  // replace each vetra-* folder whole, so files removed upstream disappear here too
  for (const d of skillDirs) { rmSync(join(root, d), { recursive: true, force: true }); cpSync(join(SKILLS, d), join(root, d), { recursive: true }); }
  done.push(`${skillDirs.length} skills in ${root}`);
}
if (agent === 'other' || agent === 'both') {
  const root = join(project, 'vetra-ui');
  rmSync(root, { recursive: true, force: true });
  cpSync(SKILLS, root, { recursive: true });
  const p = join(project, 'AGENTS.md'); const text = existsSync(p) ? readFileSync(p, 'utf8') : '';
  if (!text.includes(AGENTS_LINE)) { writeFileSync(p, (text ? text.replace(/\n*$/, '\n\n') : '') + AGENTS_LINE + '\n'); done.push(`the skills in ${root}, and a line in AGENTS.md`); }
  else done.push(`the skills in ${root}`);
}

// The team's own changes to the kit live in the project's AGENTS.md, where an update never writes.
const CHANGES = `## Changes to Vetra UI

<!-- Your team's changes to the Vetra UI kit, one line each: renamed or removed tokens and
components, your own components and when to use them, and rules where you chose differently from
the kit's skills. Agents read this before the skills; updating the skills never changes it. -->
`;
{
  const p = join(project, 'AGENTS.md'); const text = existsSync(p) ? readFileSync(p, 'utf8') : '';
  if (!text.includes('## Changes to Vetra UI')) { writeFileSync(p, (text ? text.replace(/\n*$/, '\n\n') : '') + CHANGES); done.push('a "Changes to Vetra UI" section in AGENTS.md'); }
  // Claude Code reads CLAUDE.md, not AGENTS.md: import it once.
  if (agent === 'claude' || agent === 'both') {
    const c = join(project, 'CLAUDE.md'); const ct = existsSync(c) ? readFileSync(c, 'utf8') : '';
    if (!ct.includes('AGENTS.md')) { writeFileSync(c, (ct ? ct.replace(/\n*$/, '\n\n') : '') + '@AGENTS.md\n'); done.push('an @AGENTS.md import in CLAUDE.md'); }
  }
}

writeFileSync(join(project, MANIFEST), JSON.stringify({ version: VERSION, agent, global }, null, 2) + '\n');
const was = manifest.version;
say(was && was !== VERSION ? `Vetra UI skills updated ${was} → ${VERSION}.` : `Vetra UI skills ${VERSION} installed.`);
for (const d of done) say('  - ' + d);
