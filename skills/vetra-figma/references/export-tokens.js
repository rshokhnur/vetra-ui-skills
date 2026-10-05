// export-tokens.js: rebuild Vetra UI's tokens.css from YOUR copy of the Figma file.
//
// Run it with use_figma on the team's Vetra UI file (it reads local variables and styles, and never
// writes anything). It returns the full text of tokens.css, in the same layout as the tokens.css the
// kit ships, but with the team's current values: a rebranded accent, a retuned neutral ramp, a changed
// radius. Use the result in place of the shipped vetra-tokens/assets/tokens.css.
//
// A use_figma result is cut at about 20 KB and tokens.css is just under that, so the text comes back
// in parts. Run it with PART = 0, then PART = 1 (the result says how many parts there are), and join
// the `text` of every part in order, with nothing between them. Write the result with LF line endings.
//
// Names the stock file has and this file lacks are skipped and listed in a MISSING comment at the top
// of the output; variables and styles this file adds are written after the stock ones and listed in an
// EXTRA comment. Nothing throws on a missing name: read the comments, then fix the names in the file
// or in the CSS that uses them.

const PART = 0;
const LINES_PER_PART = 260;

// ---------------------------------------------------------------- read the file
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();
const effectStyles = await figma.getLocalEffectStylesAsync();
const textStyles = await figma.getLocalTextStylesAsync();

const missing = [];
const extra = [];
const byId = new Map(variables.map((v) => [v.id, v]));
const colOf = (v) => collections.find((c) => c.id === v.variableCollectionId);
const findCol = (name, probe) =>
  collections.find((c) => c.name.toLowerCase() === name) ||
  collections.find((c) => variables.some((v) => v.variableCollectionId === c.id && v.name === probe));
const colorsCol = findCol('colors', 'text/primary');
const themeCol = findCol('theme', 'neutral/n-500');
const numbersCol = findCol('numbers', 'spacing/spacing-16');
if (!colorsCol) missing.push('collection "colors"');
if (!themeCol) missing.push('collection "theme"');
if (!numbersCol) missing.push('collection "numbers"');

const modeId = (col, name, index) => {
  if (!col) return null;
  const m = col.modes.find((x) => x.name.trim().toLowerCase() === name) || col.modes[index];
  if (!m) missing.push(`mode "${name}" in ${col.name}`);
  return m ? m.modeId : null;
};
const LIGHT = modeId(colorsCol, 'light', 0);
const DARK = modeId(colorsCol, 'dark', 1);
const inCol = (col) => (col ? variables.filter((v) => v.variableCollectionId === col.id) : []);
const colorVars = new Map(inCol(colorsCol).map((v) => [v.name, v]));
const used = new Set();

// ---------------------------------------------------------------- formatting helpers
const cssName = (name) => '--' + name.split('/').join('-');
const hex2 = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
const toHex = (c) => '#' + hex2(c.r) + hex2(c.g) + hex2(c.b) + (c.a !== undefined && c.a < 1 ? hex2(c.a) : '');
const num = (n) => String(+(+n).toFixed(4));
const pyRound = (x) => {
  const f = Math.floor(x);
  return Math.abs(x - f - 0.5) < 1e-9 ? (f % 2 === 0 ? f : f + 1) : Math.round(x);
};
const g6 = (x) => String(Number(x.toPrecision(6)));
const nameOfId = async (id) => {
  const v = byId.get(id) || (await figma.variables.getVariableByIdAsync(id));
  return v ? v.name : null;
};
const numberValue = async (raw) => {
  if (raw && raw.type === 'VARIABLE_ALIAS') {
    const v = byId.get(raw.id) || (await figma.variables.getVariableByIdAsync(raw.id));
    if (!v) return null;
    return numberValue(v.valuesByMode[Object.keys(v.valuesByMode)[0]]);
  }
  return typeof raw === 'number' ? raw : null;
};

// A color value as CSS: an alias is var(), a color expression (color x opacity) is color-mix().
async function cssValue(raw, where) {
  if (raw === undefined || raw === null) return null;
  if (raw.type === 'VARIABLE_ALIAS') {
    const n = await nameOfId(raw.id);
    if (!n) { missing.push(`alias target of ${where}`); return null; }
    return `var(${cssName(n)})`;
  }
  if (typeof raw === 'object' && raw.color !== undefined && raw.opacity !== undefined) {
    let color;
    if (raw.color.type === 'VARIABLE_ALIAS') {
      const n = await nameOfId(raw.color.id);
      if (!n) { missing.push(`color alias of ${where}`); return null; }
      color = `var(${cssName(n)})`;
    } else color = toHex(raw.color);
    const op = await numberValue(raw.opacity);
    if (op === null) { missing.push(`opacity of ${where}`); return null; }
    const pct = op <= 1 && !(raw.opacity && raw.opacity.type === 'VARIABLE_ALIAS') ? op * 100 : op;
    return `color-mix(in srgb, ${color} ${num(pct)}%, transparent)`;
  }
  if (typeof raw === 'object' && 'r' in raw) return toHex(raw);
  return String(raw);
}

// ---------------------------------------------------------------- the stock layout
const FAMILIES = ['accent', 'red', 'orange', 'brown', 'yellow', 'lime', 'green', 'sky', 'violet', 'pink'];
const ROLES = ['default', 'hover', 'active', 'text', 'fill', 'fill-hover', 'fill-active', 'stroke', 'glow'];
const HAS_FILL_HOVER = ['accent', 'red'];
const GROUPS = [
  ['Labels on solid fills', ['on-color', 'gray/on-fill']],
  ['Text: text only, never an icon', ['primary', 'secondary', 'tertiary', 'quaternary'].map((s) => 'text/' + s)],
  ['Gray: icons and neutral marks, never text', ['primary', 'secondary', 'tertiary', 'quaternary'].map((s) => 'gray/' + s)],
  ['Surfaces: b0 page, b1 card, b2 floating, b3 floating over floating', [0, 1, 2, 3].map((i) => 'background/b' + i)],
  ['Washes: the theme neutral at an alpha step', ['primary', 'secondary', 'tertiary', 'quaternary'].map((s) => 'fill/' + s)],
  ['Borders', ['stroke/primary', 'stroke/secondary']],
  ['Modal backdrop', ['overlay/scrim']],
  ['Glass: white at an alpha, on a colored or brand surface', ['fill', 'fill-subtle', 'stroke', 'line'].map((s) => 'glass/' + s)],
];
const CONSTANTS = ['constant-colors/white', 'constant-colors/black'];
const stockColorNames = [];
for (const fam of FAMILIES)
  for (const role of ROLES) if (role !== 'fill-hover' || HAS_FILL_HOVER.includes(fam)) stockColorNames.push(`${fam}/${role}`);
for (const [, names] of GROUPS) stockColorNames.push(...names);
stockColorNames.push(...CONSTANTS);
for (const n of stockColorNames) if (!colorVars.has(n)) missing.push(n);
const extraColors = [...colorVars.keys()].filter((n) => !stockColorNames.includes(n));
extra.push(...extraColors);
// Design context prints a variable by its WEB code syntax; without one it prints the Figma name with
// an escaped slash (var(--brand\/glow)), which matches nothing in this file.
for (const n of extraColors) if (!colorVars.get(n).codeSyntax?.WEB) missing.push(`${n}: no WEB code syntax; set it to var(${cssName(n)})`);

const rings = effectStyles.filter((s) => s.name.startsWith('ring/'));
const STOCK_EFFECTS = ['box-shadow/sm', 'box-shadow/md', 'box-shadow/lg', 'box-shadow/xl', 'box-shadow/2xl',
  'ring/accent', 'ring/accent-on-color', 'ring/accent-text', 'ring/gray', 'ring/green', 'ring/yellow', 'ring/orange',
  'ring/red', 'ring/red-on-color', 'ring/violet', 'ring/sky', 'ring/pink', 'ring/lime', 'ring/brown',
  'actions/primary', 'actions/primary-hover', 'actions/secondary'];
for (const n of STOCK_EFFECTS) if (!effectStyles.some((s) => s.name === n)) missing.push('effect style ' + n);
for (const s of effectStyles) if (!/^(box-shadow|ring|actions)\//.test(s.name)) extra.push('effect style ' + s.name + ' (not exported)');
for (const s of effectStyles) if (/^(box-shadow|ring|actions)\//.test(s.name) && !STOCK_EFFECTS.includes(s.name)) extra.push('effect style ' + s.name);

async function modeBlock(mode) {
  const out = [];
  const put = async (name) => {
    const v = colorVars.get(name);
    if (!v) return;
    used.add(name);
    const val = await cssValue(v.valuesByMode[mode], name);
    if (val !== null) out.push(`  ${cssName(name)}: ${val};`);
  };
  for (const fam of FAMILIES) {
    out.push(`  /* ${fam} */`);
    for (const role of ROLES) await put(`${fam}/${role}`);
  }
  for (const [title, names] of GROUPS) {
    out.push(`\n  /* ${title} */`);
    for (const n of names) await put(n);
  }
  const others = extraColors.filter((n) => !CONSTANTS.includes(n));
  if (others.length) {
    out.push('\n  /* In this file and not in the stock kit */');
    for (const n of others) await put(n);
  }
  out.push('\n  /* Focus rings: box-shadow values. Put a ring first when an element carries other shadows. */');
  for (const s of rings) {
    const parts = [];
    for (const e of s.effects) {
      if (e.type !== 'DROP_SHADOW' && e.type !== 'INNER_SHADOW') continue;
      const inset = e.type === 'INNER_SHADOW' ? 'inset ' : '';
      const bound = e.boundVariables && e.boundVariables.color ? await nameOfId(e.boundVariables.color.id) : null;
      let color;
      if (bound) color = `var(${cssName(bound)})`;
      else {
        color = toHex(e.color);
        if (mode === LIGHT) missing.push(`${s.name}: a layer is not bound to a color variable, written as ${color}`);
      }
      parts.push(`${inset}0 0 0 ${num(e.spread || 0)}px ${color}`);
    }
    parts.reverse(); // Figma paints the last layer on top; CSS paints the first on top.
    out.push(`  ${cssName(s.name)}: ${parts.join(', ')};`);
  }
  return out.join('\n');
}

const rgbaPct = (c) => {
  const a = c.a === undefined ? 255 : Math.round(c.a * 255);
  const R = (n) => Math.round(n * 255);
  return `rgb(${R(c.r)} ${R(c.g)} ${R(c.b)} / ${pyRound((a / 255) * 100)}%)`;
};
const shadow = (s) => s.effects
  .filter((e) => e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW')
  .map((e) => {
    const px = (n) => (n === 0 ? '0' : `${num(n)}px`);
    return `${e.type === 'INNER_SHADOW' ? 'inset ' : ''}${px(e.offset.x)} ${px(e.offset.y)} ${px(e.radius)} ${rgbaPct(e.color)}`;
  })
  .join(', ');

// ---------------------------------------------------------------- numbers
const numbers = { spacing: [], radius: [], stroke: [], opacity: [], sizing: [] };
const NUM_GROUP = { spacing: 'spacing', 'border-radius': 'radius', stroke: 'stroke', opacity: 'opacity', sizing: 'sizing' };
for (const v of inCol(numbersCol)) {
  const group = NUM_GROUP[v.name.split('/')[0]];
  const value = await numberValue(v.valuesByMode[numbersCol.defaultModeId]);
  if (!group || value === null) { extra.push(v.name + ' (not exported)'); continue; }
  numbers[group].push({ key: v.name.split('/').pop(), value });
}
for (const g of Object.keys(numbers)) {
  if (!numbers[g].length) missing.push(`number variables in ${g}`);
  numbers[g].sort((a, b) => (a.key.endsWith('-full') ? 1 : 0) - (b.key.endsWith('-full') ? 1 : 0) || a.value - b.value);
}

// ---------------------------------------------------------------- theme ramps
const themeVars = inCol(themeCol).sort((a, b) => (parseFloat(a.name.split('-').pop()) || 0) - (parseFloat(b.name.split('-').pop()) || 0));
if (themeCol && !themeVars.length) missing.push('theme ramp variables');
const themeModes = themeCol ? themeCol.modes.slice() : [];

// ---------------------------------------------------------------- text styles
// A team's own font families, as STRING variables such as font/display = "Commissioner" in any
// collection: each becomes --font-display, and the text styles set in that family use it.
const fontVars = variables.filter((v) => v.resolvedType === 'STRING' && /^font\//.test(v.name));
const teamFonts = new Map();
for (const v of fontVars) {
  const col = colOf(v);
  const val = v.valuesByMode[col.defaultModeId];
  if (typeof val === 'string' && val.trim()) teamFonts.set(val.trim(), '--font-' + v.name.split('/').pop());
}
const WEIGHT = { thin: 100, extralight: 200, light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 };
const textLines = [];
const families = { sans: new Set(), mono: new Set() };
for (const s of textStyles) {
  const face = s.fontName.family + ' ' + s.fontName.style;
  const mono = face.includes('Mono');
  const team = teamFonts.get(s.fontName.family);
  if (!team) families[mono ? 'mono' : 'sans'].add(s.fontName.family);
  const weight = WEIGHT[s.fontName.style.replace(/[\s-]/g, '').replace(/italic/i, '').toLowerCase()];
  if (!weight) missing.push(`${s.name}: font style "${s.fontName.style}" has no CSS weight, written as 400`);
  let lh;
  if (s.lineHeight.unit === 'PIXELS') lh = `${num(s.lineHeight.value)}px`;
  else if (s.lineHeight.unit === 'PERCENT') lh = g6(s.lineHeight.value / 100);
  else lh = 'normal';
  const ls = s.letterSpacing.value === 0 ? '0'
    : s.letterSpacing.unit === 'PERCENT' ? `${g6(s.letterSpacing.value / 100)}em` : `${num(s.letterSpacing.value)}px`;
  textLines.push(`.${s.name.split('/').join('-')} { font: ${weight || 400} ${num(s.fontSize)}px/${lh} ${team ? `var(${team})` : mono ? 'var(--font-mono)' : 'var(--font-sans)'}; letter-spacing: ${ls}; }`);
}
if (!textStyles.length) missing.push('text styles');
const fontStack = (set, stock, fallback) => {
  const fams = [...set];
  if (!fams.length || (fams.length === 1 && fams[0] === stock)) return null;
  if (fams.length > 1) extra.push(`several families share one role (${fams.join(', ')}); give each a font/* variable`);
  return fams.map((f) => `"${f}"`).join(', ') + `, ${fallback}`;
};
for (const [fam] of teamFonts) if (!textStyles.some((s) => s.fontName.family === fam)) extra.push(`font variable for "${fam}" but no text style uses it`);
const sansOverride = fontStack(families.sans, 'Geist', 'ui-sans-serif, system-ui, sans-serif');
const monoOverride = fontStack(families.mono, 'Geist Mono', 'ui-monospace, SFMono-Regular, Menlo, monospace');

// ---------------------------------------------------------------- write
const today = new Date().toISOString().slice(0, 10);
const L = [];
const w = (s) => L.push(s);
const uniq = (a) => [...new Set(a)];
if (missing.length) w(`/* MISSING from this file, skipped below:\n${uniq(missing).map((m) => ' *   ' + m).join('\n')}\n */`);
if (extra.length) w(`/* EXTRA in this file, not in the stock kit:\n${uniq(extra).map((m) => ' *   ' + m).join('\n')}\n */`);
const themeNames = themeModes.map((m) => m.name.trim().toLowerCase());
const defaultThemeName = themeCol ? (themeModes.find((m) => m.modeId === themeCol.defaultModeId) || themeModes[0])?.name.trim().toLowerCase() : 'neutral';
const themeLine = `data-theme="${themeNames.join('" | "')}"`;
const nColors = inCol(colorsCol).length;
const nNumbers = inCol(numbersCol).length;
w(`/*
 * Vetra UI 1.0 tokens
 *
 * Generated from the Vetra UI Figma file on ${today}: ${nColors} color variables,
 * ${themeVars.length} theme steps, ${nNumbers} number variables, ${textStyles.length} text styles and ${effectStyles.length} effect styles.
 * Do not edit values by hand. A value changed here and not in Figma drifts from the design.
 *
 * Naming: a Figma color or effect name with "/" replaced by "-"
 *   (text/primary -> --text-primary, box-shadow/md -> --box-shadow-md);
 * a number variable by its last segment (border-radius/radius-12 -> --radius-12);
 * a text style as a class (text-sm-14px/medium -> .text-sm-14px-medium).
 *
 * Switches, set once on <html>:
 *   data-mode="light" | "dark"               (or class="light" | "dark")
 *   ${themeLine}   (${defaultThemeName} when absent)
 * An element that switches either one below <html> must carry both,
 * or its tokens keep the values resolved on its parent.
 */
`);

w('/* Theme ramps. Internal: reference the semantic tokens below, never --neutral-*. */');
const defaultTheme = themeModes.find((m) => themeCol && m.modeId === themeCol.defaultModeId) || themeModes[0];
const orderedThemes = defaultTheme ? [defaultTheme, ...themeModes.filter((m) => m !== defaultTheme)] : [];
for (let i = 0; i < orderedThemes.length; i++) {
  const m = orderedThemes[i];
  const tag = `[data-theme="${m.name.trim().toLowerCase()}"]`;
  w(`${i === 0 ? ':root,\n' + tag : tag} {`);
  for (const v of themeVars) {
    const val = await cssValue(v.valuesByMode[m.modeId], v.name);
    if (val !== null) w(`  ${cssName(v.name)}: ${val};`);
  }
  w('}\n');
}

w('/* Light mode, the default */');
w(':root,\n.light,\n[data-mode="light"] {\n  color-scheme: light;\n');
w(await modeBlock(LIGHT));
w('}\n');
w('/* Dark mode: a remap, not a repaint. Solid family fills keep one value in both modes. */');
w('.dark,\n[data-mode="dark"] {\n  color-scheme: dark;\n');
w(await modeBlock(DARK));
w('}\n');

w('/* Mode-independent */');
w(':root {');
for (const n of CONSTANTS) {
  const v = colorVars.get(n);
  if (!v) continue;
  const val = await cssValue(v.valuesByMode[LIGHT], n);
  if (val !== null) w(`  ${cssName(n)}: ${val};`);
}
w('\n  /* Spacing: gap and padding. The number is pixels. */');
for (const { key, value } of numbers.spacing) w(`  --${key}: ${value ? num(value) + 'px' : '0'};`);
w('\n  /* Corner radius */');
for (const { key, value } of numbers.radius) w(`  --${key}: ${key.endsWith('-full') ? '9999px' : value ? num(value) + 'px' : '0'};`);
w('\n  /* Stroke width. Every kit border is --stroke-1. */');
for (const { key, value } of numbers.stroke) w(`  --${key}: ${value ? num(value) + 'px' : '0'};`);
w('\n  /* Opacity. Figma stores these as percent; CSS takes a fraction. */');
for (const { key, value } of numbers.opacity) w(`  --${key}: ${g6(value > 1 ? value / 100 : value)};`);
w('\n  /* Sizing: width and height */');
for (const { key, value } of numbers.sizing) w(`  --${key}: ${num(value)}px;`);
w(`
  /* Type */
  /* Google Fonts and @fontsource register "Geist"; @fontsource-variable registers "Geist Variable".
     With next/font, point these at var(--font-geist-sans) and var(--font-geist-mono) instead. */
  --font-sans: ${sansOverride || '"Geist", "Geist Variable", ui-sans-serif, system-ui, sans-serif'};
  --font-mono: ${monoOverride || '"Geist Mono", "Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace'};${[...teamFonts].map(([fam, name]) => `\n  ${name}: "${fam}", ui-sans-serif, system-ui, sans-serif;`).join('')}
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
`);
w('  /* Elevation. Fixed #18181b in both modes on purpose: never make a shadow mode-aware. */');
for (const s of effectStyles) if (s.name.startsWith('box-shadow/')) w(`  ${cssName(s.name)}: ${shadow(s)};`);
w('\n  /* Bevels: actions-primary on a solid fill at rest, actions-primary-hover on its hover,\n     actions-secondary on a neutral control at rest. Pressed and disabled are flat. */');
for (const s of effectStyles) if (s.name.startsWith('actions/')) w(`  ${cssName(s.name)}: ${shadow(s)};`);
w('}\n');

w('/* Text styles: one class per Figma style. Size, line height, tracking and weight travel together. */');
for (const t of textLines) w(t);

const css = L.join('\n') + '\n';
const lines = css.split('\n');
const parts = Math.ceil(lines.length / LINES_PER_PART);
const slice = lines.slice(PART * LINES_PER_PART, (PART + 1) * LINES_PER_PART);
return {
  part: PART,
  of: parts,
  missing: uniq(missing),
  extra: uniq(extra),
  text: slice.join('\n') + (PART < parts - 1 ? '\n' : ''),
};
