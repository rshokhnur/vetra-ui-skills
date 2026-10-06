# Vetra UI skills for AI agents

Seven skills that teach an AI agent to build with Vetra UI 1.0 the way the kit is designed: the right
token, the right component and its properties, the kit's layouts and its copy, in Figma and in code.
They work with Claude Code, Codex, Cursor and the other agents the `skills` installer supports.

## What's inside

| Skill | What it does |
| --- | --- |
| `vetra-ui` | Start here: routes a task to the skills it needs, and holds the rules that override them, including your team's changes to the kit |
| `vetra-tokens` | Picks the token for every color, surface, border, text style, spacing, radius, shadow and focus ring. Ships the tokens as `tokens.css`, light and dark, Neutral, Cool and Warm |
| `vetra-components` | Picks the component for each need, sets its style, tone, size and state, and composes menus, dialogs, forms, tables and cards |
| `vetra-ai-ui` | Builds chat, assistant and agent screens with the kit's 19 AI components: messages, reasoning, tool calls, approvals, citations, streaming |
| `vetra-copy` | Writes the words: buttons, dialogs, labels, errors, empty states, dates and sample data |
| `vetra-figma` | Builds and edits screens in your Figma file through the Figma MCP server, bound to the kit's variables and styles |
| `vetra-code` | Sets up the tokens in plain CSS, Tailwind CSS v4 or v3, or shadcn/ui, and turns a Vetra Figma frame into your own components |

## Install

In your project folder:

```bash
npx skills add rshokhnur/vetra-ui-skills
```

Pick your agent when it asks (Claude Code, Codex, Cursor and others), or pass `--agent` and `--skill '*'`
to skip the questions. Add `-g` to install for every project. Node 18 or later; no account and no key.

## Your changes to the kit

Most teams change their copy of Vetra UI: a rebrand, a renamed color, their own components, a rule
they chose differently. Write each change as one line under `## Changes to Vetra UI` in your
project's `AGENTS.md` (or `CLAUDE.md` for Claude Code). Agents read it before the skills and treat
it as your decision, and an update never touches it. The agent adds the section itself the first
time you record a change.

```md
## Changes to Vetra UI
- Violet is renamed Blue.
- The selected sidebar row is solid accent/default, on purpose.
- "New dot" is ours: use it for unread marks in the sidebar.
```

## Requirements

- **Vetra UI 1.0** in your Figma workspace, as a library or in the file you work in.
- **For `vetra-figma`:** the Figma MCP server connected to your agent, signed in to an account with
  **edit access to the file and a Full or Dev seat on the file's team**. A View seat, or a file in
  another team's drafts, fails with "User does not have permission to access this file using MCP".
- **Your own brand color:** `vetra-tokens` has a rebrand procedure that derives the accent from it.
- **For code:** the Geist and Geist Mono fonts and `lucide-react` (or Lucide for your framework).
  `vetra-code` covers the setup.

## Use

Ask for the work as you normally would. The skills apply on their own:

- "Implement this frame as a React component" and paste the Figma link.
- "Build a settings page for API keys in our Figma file, light and dark."
- "Add an assistant panel to the editor, with sources and a stop button."
- "Review this screen against Vetra UI."

Each skill ends with a checklist the agent walks before it reports back, so ask it to "check against
the Vetra skills" whenever you want a second pass.

## Updating

When a new version of Vetra UI ships, or these skills get a fix, run `npx skills update`. If a release
adds a new skill, run `npx skills add rshokhnur/vetra-ui-skills` again to get it. The skills
name tokens and components, never node IDs, so they work in any file built on the kit.
A git worktree keeps the copy that was committed when it was made: commit the new folders before you
cut one, or update each worktree's copy too.

When your team changes variables in Figma, export `tokens.css` again (`vetra-code`, Set up once).
A variable added after the export is missing from your CSS.
