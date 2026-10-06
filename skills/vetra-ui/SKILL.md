---
name: vetra-ui
description: Start here for any work with the Vetra UI kit, in Figma or in code. Routes the task to the other Vetra skills and holds the rules that override them, including the team's recorded changes to the kit, what to do when their file differs from the skills, and how to review existing work. Use whenever a task builds, edits or reviews a screen, component or copy for a product built on Vetra UI.
---

# Vetra UI: start here

This project builds its interface with the Vetra UI kit. Six more skills hold the kit's rules,
written for **Vetra UI 1.0**: vetra-tokens, vetra-components, vetra-ai-ui, vetra-copy, vetra-figma
and vetra-code. They are installed next to this one. Read the ones the task needs before you write
anything; paths below are relative to this skill's folder.

If a skill the tree below names isn't installed (its `SKILL.md` is missing), say which one once
and tell the person to run `npx skills add rshokhnur/vetra-ui-skills --skill '*'`. Then continue
with the skills you have; never guess the missing skill's rules. Why: buyers can tick a subset
in the installer, and an agent that guesses at a missing skill builds with confidence and no rules.

## Rules that override everything below

1. **Read first, then build.** Open every skill the tree below names for your task, and the
   references each one points to for the parts you use. Why: the kit's rules are not guessable from
   the tokens or the components alone. Without the skills, agents in testing hand-built controls,
   copied a hover color as the resting one and sized a dialog off the spec, and every build passed.
2. **The kit decides, the project follows, the person decides last.** A token, a component or a
   recipe from the skills beats a value, a library default or a pattern from memory. When the
   project's code disagrees with a skill, follow the skill for new work and name the disagreement.
   When the person asks for something the skills advise against (two blue buttons, Title Case),
   build exactly what they asked. The skills show the kit's way: offer it once, in one sentence in
   total however many rules the request breaks, and never refuse or argue. Never reword text the
   person wrote (a title, a name, a label): it is theirs, even where a copy rule disagrees. Why: the
   designer or developer owns the product; the skills are guidance, not gates.
3. **Finish with the checklists.** Every skill ends with "Before you finish". Walk the list of each
   skill you read, fix every miss, then report.
4. **The project's recorded changes come before the skills.** Before applying any skill, read the
   `## Changes to Vetra UI` section of the project's `AGENTS.md` (or `CLAUDE.md`). A line there
   overrides the kit's default, and a screen that follows it is a decision, not a defect: never
   "fix" it back. When the team renames, adds or removes a token or component, or decides against a
   skill on purpose (a solid selected row, Medium controls on sign-in), add one line there, in the
   team's words. Why: the skills describe the stock kit and are replaced on every update; that
   section is the only place a team's choices survive and reach the next agent. If the project has
   no such section yet, create it at the end of its `AGENTS.md` (or `CLAUDE.md` for Claude Code) the
   first time the team records a change.
5. **Read again after a compaction, and name the skills in every brief.** A context summary keeps
   helper names and loses the rules, and an agent whose brief only says "built on Vetra" loads
   nothing. Re-read the skills before the next write; a brief for another agent names each skill it
   must load (`vetra-figma` has a template).

## When the file differs from the skills

The skills describe Vetra UI 1.0 as shipped. The team's file may have moved on: a rebranded accent, a
renamed variable, a deleted or an added component, a newer kit version. **The file is the truth for
names and values; the skills are the truth for decisions.**

```
A token, style, component or property a skill names
├── exists in the file ───────── use it, with the file's value, never a value from the skill's tables
└── is missing
    ├── the file has one for the same role (search names and descriptions)
    │                         ─── use it, and name the substitution in your reply
    └── nothing fits ─────────── stop and report the missing name; never invent a name, never
                                 fall back to a raw value, never redraw a component from shapes
Something the skills don't list: a component, a property, a variable, a mode
└── read its description in the file and follow it; the team's own components are used
    wherever the kit has none, under the same token rules
The file names a Vetra UI version other than 1.0 (its Changelog page)
└── say so once in your reply, then follow the file
```

Why: the names and hex values in these skills are a snapshot. A name that isn't in the file throws
in Figma and resolves to nothing in CSS, with no error, and a copied hex undoes the team's rebrand.
In code, `../vetra-tokens/assets/tokens.css` is the stock kit: if the team changed variables, export
theirs with `../vetra-figma/references/export-tokens.js` (see `vetra-code`).

## Pick the skills

Take every branch that matches; most tasks match more than one.

```
Styling anything: a color, a surface, a border, spacing, type, a shadow, a focus ring
└── ../vetra-tokens/SKILL.md

Choosing or composing controls: buttons, fields, menus, dialogs, tables, cards, forms
└── ../vetra-components/SKILL.md

A chat, an assistant, an agent run, tool calls, approvals, citations, streaming output
└── ../vetra-ai-ui/SKILL.md, with ../vetra-components/SKILL.md

Any words on screen: labels, buttons, errors, empty states, dates, sample data
└── ../vetra-copy/SKILL.md; for chat and agent parts, the Copy section of ../vetra-ai-ui/SKILL.md

Writing to a Figma file through the Figma MCP (use_figma), even for one small change
└── ../vetra-figma/SKILL.md, with vetra-tokens and vetra-components

Writing front-end code: setting up the tokens, implementing a Figma frame, building a component
└── ../vetra-code/SKILL.md, with vetra-tokens and vetra-components

Reviewing or auditing existing work: a Figma screen, a page of code, a pull request
└── "Reviewing existing work" below, with the skills its subject needs
```

A whole screen touches almost every branch. For example, implementing an assistant panel from a
Figma frame in a React app means `vetra-code`, `vetra-tokens`, `vetra-components`, `vetra-ai-ui` and
`vetra-copy`.

## Reviewing existing work

A review judges work someone already made, so it needs what a build doesn't: which choices were the
team's, and how bad each miss is. Walk these steps in order.

1. **Read the team's changes** (rule 4). List them; nothing on that list is a finding.
2. **Inventory the screen.** For each region: kit instances, the team's own components, and parts
   drawn by hand. In Figma, `inventory(frame)` in `vetra-figma`'s helpers lists them.
3. **Walk the trees per region.** `vetra-components` Pick the component: is there a kit component
   for each hand-drawn part? `vetra-tokens` Color, Icon and Type trees for each paint and text.
   `vetra-copy` for every string.
4. **Run the tools.** Figma: the `audit` helper and the dark check (`vetra-figma`, Before you finish;
   read-only files take the resolve-only variant there). Code: the `vetra-code` greps, an axe run and
   a keyboard pass. In testing, most real code findings came from axe and the keyboard, not the greps.
5. **Sort every finding.** High: unreadable text, a broken keyboard path or focus trap, dark mode
   that loses content, wrong data. Medium: a kit component exists but the part is hand-drawn, a wrong
   token or size. Low: polish. A miss the team's changes explain is not listed; a choice that looks
   deliberate but isn't recorded is a question for the person, not a finding.
6. **Report** each finding as: severity, where (node id or file:line), what, the rule it breaks, the
   fix. Highest first. Then two short lists: questions for the person (choices that look deliberate
   but aren't recorded), and kit gaps (the kit has no component or token for the job).
7. **Fix only what you were asked to fix,** and only in a file you may write. Swapping a part for a
   kit component that changes what the team designed (their icons, their copy) is a question first.

## Where the facts live

| You need | Open |
| --- | --- |
| A token's value, contrast or mode | `../vetra-tokens/references/colors.md`, `scales.md`, `typography.md`, `effects.md` |
| The tokens as CSS | `../vetra-tokens/assets/tokens.css` |
| A component's properties and defaults | `../vetra-components/references/inventory.md` |
| An AI component's properties and defaults | `../vetra-ai-ui/references/inventory.md` |
| Tailwind v4 and shadcn/ui wiring | `../vetra-code/assets/`, `../vetra-code/references/shadcn.md` |
| A Button to copy, and the `cn()` for shadcn | `../vetra-code/references/button.tsx`, `utils.ts` |
| Figma helpers and known traps | `../vetra-figma/references/helpers.js`, `traps.md` |

Never guess a token name, a property name or a default. Look it up here; if it isn't listed, it
doesn't exist in the kit.
