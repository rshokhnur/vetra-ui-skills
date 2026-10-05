// Vetra UI helpers for use_figma. Paste this block at the top of a script.
// Written for a file that contains the kit (the Vetra UI file or a duplicate of it).
// For a file that uses Vetra UI as a library, see "Library" at the end.

const vars = Object.fromEntries((await figma.variables.getLocalVariablesAsync()).map(v => [v.name, v]));
const cols = Object.fromEntries((await figma.variables.getLocalVariableCollectionsAsync()).map(c => [c.name, c]));
const textStyles = Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s => [s.name, s]));
const effectStyles = Object.fromEntries((await figma.getLocalEffectStylesAsync()).map(s => [s.name, s]));

const tok = name => {
  const v = vars[name];
  if (!v) throw new Error(`No variable "${name}"`);
  return v;
};

// A paint bound to a color token. It carries the token's own alpha: fill/*, stroke/* and
// overlay/scrim are translucent, and a paint built from the color alone paints them solid.
const paint = (node, name) => {
  const v = tok(name);
  const c = v.resolveForConsumer(node).value;
  return figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a ?? 1 }, 'color', v);
};
const fill = (node, name) => { node.fills = name ? [paint(node, name)] : []; };
// stroke(node, 'stroke/secondary'), or one edge: stroke(panel, 'stroke/secondary', ['Left'])
const stroke = (node, name, sides = ['Top', 'Right', 'Bottom', 'Left']) => {
  node.strokes = [paint(node, name)];
  node.strokeAlign = 'INSIDE';
  const w = tok('stroke/stroke-1'), none = tok('stroke/stroke-0');
  // Bind each side: binding the strokeWeight shorthand silently fails once the sides differ.
  // Vectors have no side weights and throw on them.
  try { ['Top', 'Right', 'Bottom', 'Left'].forEach(s => node.setBoundVariable(`stroke${s}Weight`, sides.includes(s) ? w : none)); }
  catch (e) { node.setBoundVariable('strokeWeight', w); }
};
const radius = (node, name) =>
  ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']
    .forEach(f => node.setBoundVariable(f, tok(name)));

// space(node, { pad: 16 }), { pad: [12, 16] } (vertical, horizontal), { pad: [16, 16, 12, 16] }, { gap: 8 }
const space = (node, { pad, gap }) => {
  if (pad !== undefined) {
    const p = [].concat(pad);
    const [t, r, b, l] = p.length === 1 ? [p[0], p[0], p[0], p[0]] : p.length === 2 ? [p[0], p[1], p[0], p[1]] : p;
    [['paddingTop', t], ['paddingRight', r], ['paddingBottom', b], ['paddingLeft', l]]
      .forEach(([f, n]) => node.setBoundVariable(f, tok(`spacing/spacing-${n}`)));
  }
  if (gap !== undefined) node.setBoundVariable('itemSpacing', tok(`spacing/spacing-${gap}`));
};

// Component properties by plain name. Variant properties are plain already; text, boolean and
// instance-swap properties carry a "#id" suffix that differs per component, and this finds it.
// Three passes, because one batched call can silently drop values:
//   1. variants (Size, Style, Tone, State…): a switch drops the instance's other overrides
//   2. text and booleans, including the boolean that reveals an icon slot
//   3. instance swaps (icons), which need their slot already on
const props = (inst, values) => {
  const defs = inst.componentProperties;
  const keys = Object.keys(defs);
  const pass = { VARIANT: {}, TEXT: {}, BOOLEAN: {}, INSTANCE_SWAP: {} };
  for (const [k, v] of Object.entries(values)) {
    const named = n => keys.find(x => x === n || x.split('#')[0] === n);
    // "↳" marks a property reaching into a nested layer; accept the name with or without it.
    let key = named(k) || named(k.replace(/^↳ /, '')) || named(`↳ ${k}`);
    // On fields, `Label` and `Hint Text` are on/off switches and their text is `↳ Label`, `↳ Hint Text`.
    // A string sent to a switch goes to its text instead.
    if (key && typeof v === 'string' && defs[key].type === 'BOOLEAN') key = named(`↳ ${k}`) || key;
    if (!key) throw new Error(`${inst.name} has no property "${k}". It has: ${keys.map(x => x.split('#')[0]).join(', ')}`);
    if (defs[key].type === 'VARIANT') {
      // Figma's own error ("Unable to find a variant") names neither the property nor the options.
      const set = inst.mainComponent?.parent;
      const options = set?.type === 'COMPONENT_SET' ? set.componentPropertyDefinitions[key]?.variantOptions : null;
      if (options && !options.includes(String(v))) throw new Error(`${inst.name}: ${key} "${v}" doesn't exist. Options: ${options.join(', ')}`);
    }
    pass[defs[key].type][key] = v;
  }
  for (const batch of [pass.VARIANT, { ...pass.TEXT, ...pass.BOOLEAN }, pass.INSTANCE_SWAP])
    if (Object.keys(batch).length) inst.setProperties(batch);
};

// A layout frame. createFrame and createAutoLayout paint white, clip, and count strokes in the
// hugged size by default; this does none of that.
const box = (parent, name, direction = 'VERTICAL') => {
  const f = figma.createAutoLayout(direction, { name });
  f.fills = [];
  f.clipsContent = false;
  f.strokesIncludedInLayout = false; // or a 1px border adds 2px to the hugged size
  parent.appendChild(f);
  return f;
};

// A text node on a kit text style and a text token. Style names come from `textStyles`; never type
// a style id: an id without its trailing comma resolves to nothing and leaves the text in Inter 12.
const text = async (parent, chars, style, color = 'text/primary') => {
  const s = textStyles[style];
  if (!s) throw new Error(`No text style "${style}"`);
  const t = figma.createText();
  await figma.loadFontAsync(s.fontName);
  await t.setTextStyleIdAsync(s.id);
  t.characters = chars;
  fill(t, color);
  parent.appendChild(t);
  return t;
};

const effect = async (node, name) => {
  const s = effectStyles[name];
  if (!s) throw new Error(`No effect style "${name}"`);
  await node.setEffectStyleIdAsync(s.id);
};

// mode(frame, 'dark'), mode(frame, 'cool', 'theme')
const mode = (node, name, collection = 'colors') => {
  const c = cols[collection];
  const m = c.modes.find(x => x.name === name);
  if (!m) throw new Error(`No mode "${name}" in ${collection}: ${c.modes.map(x => x.name).join(', ')}`);
  node.setExplicitVariableModeForCollection(c, m.modeId);
};

// Kit lookups. A page you only read from is loaded, not switched to.
const kitPage = async name => {
  const p = figma.root.children.find(x => x.name === name);
  if (!p) throw new Error(`No page "${name}"`);
  await p.loadAsync();
  return p;
};
const componentSet = async name => {
  for (const pageName of ['Components', 'AI Components', 'Charts']) {
    const p = await kitPage(pageName);
    const s = p.findOne(n => (n.type === 'COMPONENT_SET' || n.type === 'COMPONENT') && n.name === name);
    if (s) return s;
  }
  throw new Error(`No component "${name}"`);
};
const icon = async name => {
  const p = await kitPage('Icons');
  const c = p.findOne(n => n.type === 'COMPONENT' && n.name === name);
  if (!c) {
    // Lucide renames glyphs (home → house); suggest names sharing a word.
    const words = name.split('-').filter(w => w.length > 2);
    const near = p.findAll(n => n.type === 'COMPONENT' && words.some(w => n.name.includes(w))).map(n => n.name).slice(0, 8);
    throw new Error(`No icon "${name}".${near.length ? ` Near: ${near.join(', ')}` : ''} Icons use Lucide names: chevron-right, search, trash`);
  }
  return c;
};
// A nested part of an instance, by layer name or by its component's name:
// part(menuRow, 'Left'), part(crumbs, 'x-Base/Breadcrumbs/Item') returns every match.
const part = (inst, name) => inst.findAll(n => n.type === 'INSTANCE' &&
  (n.name === name || n.mainComponent?.name === name || n.mainComponent?.parent?.name === name));
// An icon instance is one whose main component lives on the Icons page (or, from a library, a
// standalone component holding a single vector).
const isIcon = n => {
  const mc = n.type === 'INSTANCE' && n.mainComponent;
  if (!mc) return false;
  let p = mc.parent;
  while (p && p.type !== 'PAGE') p = p.parent;
  if (p) return p.name === 'Icons';
  return mc.parent?.type !== 'COMPONENT_SET' && mc.children?.length === 1 && mc.children[0].type === 'VECTOR';
};
// iconColor(btn, 'on-color'): recolor every icon inside `node` (or `node` itself, if it is an icon).
// A swapped icon keeps the icon master's own gray/primary, whatever the host's fill. Kit icons are
// outlined shapes, so the color goes on the vector's fill; a stroke on top draws them bold.
const iconColor = (node, name) => {
  const icons = isIcon(node) ? [node] : node.findAll(isIcon);
  for (const ic of icons) for (const v of ic.findAll(n => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION')) if (v.fills?.length) fill(v, name);
  return icons.length;
};
const instance = async (parent, name, values = {}) => {
  const s = await componentSet(name);
  const inst = (s.type === 'COMPONENT_SET' ? s.defaultVariant : s).createInstance();
  parent.appendChild(inst);
  if (Object.keys(values).length) props(inst, values);
  return inst;
};

// inventory(frame): per region (each direct child), what it is built from: kit components by name,
// the team's own components, and how many layers were drawn by hand. Step 2 of a review.
const KIT_PAGES = new Set(['Components', 'AI Components', 'Charts', 'Icons', 'Logos']);
const inventory = frame => frame.children.map(region => {
  const kit = {}, team = {};
  let drawn = 0;
  const walk = n => {
    if (n.type === 'INSTANCE') {
      const mc = n.mainComponent;
      const name = mc?.parent?.type === 'COMPONENT_SET' ? mc.parent.name : mc?.name;
      let p = mc?.parent; while (p && p.type !== 'PAGE') p = p.parent;
      const bucket = !p || KIT_PAGES.has(p.name) ? kit : team; // no page: a library component
      if (!isIcon(n)) bucket[name] = (bucket[name] || 0) + 1;
      return; // an instance's insides belong to its master
    }
    if (n !== region || n.type !== 'FRAME') if (['TEXT', 'RECTANGLE', 'ELLIPSE', 'VECTOR', 'FRAME', 'LINE', 'POLYGON', 'STAR', 'BOOLEAN_OPERATION'].includes(n.type)) drawn++;
    if ('children' in n) n.children.forEach(walk);
  };
  walk(region);
  return { region: `${region.name} (${region.id})`, kit, team, drawnLayers: drawn };
});

// resolveVar(variable, 'dark'): the variable's color in a mode, without writing to the file.
// Follows aliases (across collections, in their default mode) and color × opacity expressions.
const resolveVar = (v, modeName = 'light') => {
  const col = Object.values(cols).find(c => c.id === v.variableCollectionId);
  const mode = col.modes.find(m => m.name === modeName) || col.modes.find(m => m.modeId === col.defaultModeId);
  const val = v.valuesByMode[mode.modeId];
  const byId = id => Object.values(vars).find(x => x.id === id);
  const num = x => x?.type === 'VARIABLE_ALIAS' ? num(byId(x.id).valuesByMode[Object.keys(byId(x.id).valuesByMode)[0]]) : x;
  if (val?.type === 'VARIABLE_ALIAS') return resolveVar(byId(val.id), modeName);
  if (val && val.color !== undefined && val.opacity !== undefined) {
    const c = val.color.type === 'VARIABLE_ALIAS' ? resolveVar(byId(val.color.id), modeName) : val.color;
    const o = num(val.opacity);
    return { ...c, a: (c.a ?? 1) * (o > 1 ? o / 100 : o) };
  }
  return val;
};

// ---------------------------------------------------------------------------------------------
// Audit: run on the frame you built. Returns every problem found; an empty list is the goal.
// Scripts that only build can leave this block out.
// A visible text still showing its component's sample default ("Thinking…", "Home"). Numbers pass.
const sampleCopy = (n, root) => {
  const ref = n.componentPropertyReferences?.characters;
  if (!ref || /^[+\d\s.,%]*$/.test(n.characters)) return null;
  for (let p = n.parent; p && p !== root.parent; p = p.parent) {
    if (p.type !== 'INSTANCE' || !(ref in p.componentProperties)) continue;
    const mc = p.mainComponent, holder = mc?.parent?.type === 'COMPONENT_SET' ? mc.parent : mc;
    const def = holder?.componentPropertyDefinitions?.[ref]?.defaultValue;
    return def !== undefined && n.characters === def ? def : null;
  }
  return null;
};
// Checks your own layers for raw values, and every layer, inside instances too, for the misuses a
// screenshot hides: faked translucency, the wrong ramp on icons and text, strokes on icons, spacers.
const PLACEHOLDER_TEXT = new Set(['Label', 'Button', 'Input text', 'Hint text', 'Text', 'Title', 'Subtitle', 'Message', 'Link', 'Page']);
const SHAPES = new Set(['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'ELLIPSE', 'POLYGON', 'LINE']);
const audit = root => {
  const issues = [];
  const insideInstance = n => { for (let p = n.parent; p && p !== root.parent; p = p.parent) if (p.type === 'INSTANCE') return true; return false; };
  const insideIcon = n => { for (let p = n.parent; p && p !== root.parent; p = p.parent) if (isIcon(p)) return true; return false; };
  // The Composer's Stop control is a square glyph by design.
  const inComposer = n => { for (let p = n.parent; p && p !== root.parent; p = p.parent) if (p.type === 'INSTANCE' && p.mainComponent?.parent?.name === 'Composer') return true; return false; };
  const unboundPaints = (n, key) => (Array.isArray(n[key]) ? n[key] : []).filter(p => p.visible !== false && p.type === 'SOLID' && !p.boundVariables?.color).length;
  const byId = new Map(Object.values(vars).map(v => [v.id, v]));
  const boundVar = p => byId.get(p.boundVariables?.color?.id);
  const shown = n => { for (let p = n; p && p !== root.parent; p = p.parent) if (!p.visible) return false; return true; };
  const all = ('findAll' in root ? root.findAll(() => true) : []).concat([root]);
  all.forEach(n => {
    const where = `${n.name} (${n.id})`;
    if (!n.visible) return;
    // Anywhere, inside instances too.
    if (n.type !== 'SECTION' && n !== root && 'opacity' in n && n.opacity < 1) issues.push(`layer opacity ${+n.opacity.toFixed(2)}: ${where}`);
    for (const key of ['fills', 'strokes']) {
      if (!Array.isArray(n[key])) continue;
      for (const p of n[key]) {
        if (p.visible === false) continue;
        const v = boundVar(p);
        if (!v) continue;
        const a = v.resolveForConsumer(n).value.a ?? 1;
        if (Math.abs((p.opacity ?? 1) - a) > 0.01) issues.push(`paint opacity ${+(p.opacity ?? 1).toFixed(2)} on ${v.name}, whose own alpha is ${+a.toFixed(2)}: ${where}`);
        // Only icons and your own shapes: a brand logo inside a component may paint its wordmark text/*.
        if (SHAPES.has(n.type) && (insideIcon(n) || !insideInstance(n)) && v.name.startsWith('text/')) issues.push(`text token ${v.name} on a shape or icon, use gray/* or {fam}/text: ${where}`);
        if (n.type === 'TEXT' && v.name.startsWith('gray/') && v.name !== 'gray/on-fill') issues.push(`gray token ${v.name} on text, use text/*: ${where}`);
        if (n.type === 'TEXT' && !insideInstance(n) && /^text\/(tertiary|quaternary)$/.test(v.name)) issues.push(`${v.name} on text fails contrast, disabled only: ${where}`);
      }
    }
    if (SHAPES.has(n.type) && insideIcon(n) && n.fills?.length && n.strokes?.some(p => p.visible !== false)) issues.push(`stroke on an outlined icon draws it bold, color the fill: ${where}`);
    if (n.type === 'INSTANCE') {
      if (n.mainComponent?.name === 'square' && !inComposer(n)) issues.push(`placeholder icon: ${where}`);
      const set = n.mainComponent?.parent?.type === 'COMPONENT_SET' ? n.mainComponent.parent.name : n.mainComponent?.name;
      // A shortcut drawn as a Badge: the kit has Kbd.
      if (set === 'Badge' && n.findAll(t => t.type === 'TEXT').some(t => /^(⌘|⌃|⌥|⇧|ctrl|cmd|alt|shift)\b|^(ctrl|cmd)\s*\+?\s*\w$/i.test(t.characters.trim())))
        issues.push(`shortcut drawn as a Badge, use Kbd: ${where}`);
      // A loose Counter beside a button: Button and Icon Button carry their own Counter property.
      if (set === 'Counter' && !insideInstance(n) && n.parent?.children?.some(c => c.type === 'INSTANCE' && ['Button', 'Icon Button'].includes(c.mainComponent?.parent?.name)))
        issues.push(`loose Counter beside a button, use the host's Counter property: ${where}`);
      return;
    }
    if (n.type === 'TEXT' && PLACEHOLDER_TEXT.has(n.characters.trim())) issues.push(`placeholder text "${n.characters}": ${where}`);
    else if (n.type === 'TEXT' && shown(n)) { const d = sampleCopy(n, root); if (d) issues.push(`the master's sample copy "${d.slice(0, 40)}", confirm it or replace it: ${where}`); }
    if (insideInstance(n)) return;
    // Your own layers only.
    if (n.type === 'FRAME' && n !== root && n.layoutMode === 'NONE' && n.parent.layoutMode && n.parent.layoutMode !== 'NONE' && !n.children.length && !n.fills.length && !n.strokes.length) issues.push(`spacer frame, use the parent's gap: ${where}`);
    if (unboundPaints(n, 'fills')) issues.push(`raw fill: ${where}`);
    if (unboundPaints(n, 'strokes')) issues.push(`raw stroke: ${where}`);
    if (n.type === 'TEXT' && !n.textStyleId) issues.push(`text without a style: ${where}`);
    if (n.strokes?.length) {
      // Weights bind per side. VECTOR nodes throw on the side properties, so fall back to strokeWeight.
      let sides;
      try { sides = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'].map(f => [f, n[f]]); }
      catch (e) { sides = [['strokeWeight', n.strokeWeight]]; }
      sides.filter(([f, w]) => w > 0 && !n.boundVariables?.[f]).forEach(([f, w]) => issues.push(`raw ${f} ${w}: ${where}`));
    }
    if ('layoutMode' in n && n.layoutMode !== 'NONE') {
      ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'itemSpacing']
        .filter(f => n[f] !== 0 && !n.boundVariables?.[f])
        .forEach(f => issues.push(`raw ${f} ${n[f]}: ${where}`));
    }
    if ('topLeftRadius' in n && n.topLeftRadius !== 0 && !n.boundVariables?.topLeftRadius) issues.push(`raw radius ${n.topLeftRadius}: ${where}`);
    // Shadows and rings come from effect styles; blurs have no style in the kit, so they pass.
    if (!n.effectStyleId && n.effects?.some(e => e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW')) issues.push(`shadow without a style: ${where}`);
  });
  return issues;
};

// ---------------------------------------------------------------------------------------------
// Library: when the kit is a published library rather than pages in this file.
// 1. search_design_system with one query per call; keep results whose libraryName is your
//    Vetra UI library, and note componentKey.
// 2. const set = await figma.importComponentSetByKeyAsync(componentKey)   // a single icon: importComponentByKeyAsync
// 3. Variables: const libCols = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
//    for each Vetra collection: getVariablesInLibraryCollectionAsync(col.key), then
//    figma.variables.importVariableByKeyAsync(v.key) for the ones you bind.
// 4. Styles: figma.importStyleByKeyAsync(styleKey), keys from search_design_system (entity "style").
// Then build `vars`, `textStyles` and `effectStyles` from the imported objects and use the helpers above.
