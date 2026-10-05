// derive-brand.mjs: turn a brand color into Vetra UI accent options and a tinted neutral ramp.
//   node derive-brand.mjs "#3410B8"              → prints JSON: options A, B, C, the neutral ramp,
//   node derive-brand.mjs "#3410B8" --tint 0.8     contrast for each option, and the kit families
//                                                 whose hue sits within 25° of the brand
// Option A, "hue only": every accent role keeps Vetra's OKLCH lightness and the same share of its
// sRGB chroma ceiling, with the brand's hue; hover and active step −0.070 and −0.140 L with hue and
// chroma held. The kit's contrast and the other families hold.
// Option B, "exact": the brand color is the solid role in both modes; tints and text are option A's.
// Option C, "brand-leaning": the brand's hue and chroma at the lightest L where white clears 4.5:1.
// Option D, only with --default: that exact solid (for example the chosen option one step darker),
// states stepped from it, the tints kept, and text re-checked so it never sits lighter than hover.
// Neutrals: the kit's Neutral lightness, Tailwind Gray's chroma times --tint, turned to the brand hue.
// Contrast covers the dark surfaces a solid mark sits on (b1, b2, its own tint), not only white.
const BRAND = process.argv[2];
const USAGE = 'usage: node derive-brand.mjs "#RRGGBB" [--tint 0.8] [--default "#RRGGBB"]';
if (!/^#[0-9a-f]{6}$/i.test(BRAND || '')) { console.error(USAGE); process.exit(1); }
const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
const TINT = arg('--tint') !== undefined ? +arg('--tint') : 0.8;
const DEFAULT = arg('--default');
if (DEFAULT !== undefined && !/^#[0-9a-f]{6}$/i.test(DEFAULT)) { console.error(USAGE); process.exit(1); }

const toLin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const rgb = h => [0, 2, 4].map(i => parseInt(h.replace('#', '').slice(i, i + 2), 16));
function oklch(h) { const [r, g, b] = rgb(h).map(toLin); const l = Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b), m = Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b), s = Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
  const L = 0.2104542553*l+0.7936177850*m-0.0040720468*s, A = 1.9779984951*l-2.4285922050*m+0.4505937099*s, B = 0.0259040371*l+0.7827717662*m-0.8086757660*s; let H = Math.atan2(B, A) * 180 / Math.PI; if (H < 0) H += 360; return { L, C: Math.hypot(A, B), H }; }
function lin(L, C, Hd) { const H = Hd * Math.PI / 180, A = C * Math.cos(H), B = C * Math.sin(H);
  const l = (L + 0.3963377774*A + 0.2158037573*B) ** 3, m = (L - 0.1055613458*A - 0.0638541728*B) ** 3, s = (L - 0.0894841775*A - 1.2914855480*B) ** 3;
  return [4.0767416621*l - 3.3077115913*m + 0.2309699292*s, -1.2684380046*l + 2.6097574011*m - 0.3413193965*s, -0.0041960863*l - 0.7034186147*m + 1.7076147010*s]; }
const inGamut = (L, C, H) => lin(L, C, H).every(v => v >= -1e-6 && v <= 1 + 1e-6);
const maxC = (L, H) => { let lo = 0, hi = 0.5; for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (inGamut(L, mid, H)) lo = mid; else hi = mid; } return lo; };
const enc = x => { const v = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055; return Math.round(Math.min(1, Math.max(0, v)) * 255); };
const hex = (L, C, H) => '#' + lin(L, Math.min(C, maxC(L, H)), H).map(enc).map(x => x.toString(16).padStart(2, '0')).join('');
const lum = h => { const [r, g, b] = rgb(h).map(toLin); return 0.2126*r + 0.7152*g + 0.0722*b; };
const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// Vetra UI 1.0 accent, light / dark, read from the file 2026-09-25.
const VETRA = { default: ['#398ef6', '#398ef6'], hover: ['#1f78de', '#1f78de'], active: ['#0163c3', '#0163c3'], text: ['#0f64c0', '#4696f9'], stroke: ['#c4dbfb', '#1d334f'], fill: ['#f1f6fe', '#111d2d'], 'fill-hover': ['#e2eefd', '#14263d'], 'fill-active': ['#d4e5fd', '#172f4d'] };
const NEUTRAL = { 'n-0': '#ffffff', 'n-25': '#fafafa', 'n-50': '#f5f5f5', 'n-200': '#d4d4d4', 'n-400': '#a1a1a1', 'n-500': '#737373', 'n-600': '#525252', 'n-700': '#404040', 'n-800': '#262626', 'n-900': '#171717', 'n-950': '#0a0a0a' };
const COOL = { 'n-0': '#ffffff', 'n-25': '#f9fafb', 'n-50': '#f3f4f6', 'n-200': '#d1d5dc', 'n-400': '#99a1af', 'n-500': '#6a7282', 'n-600': '#4a5565', 'n-700': '#364153', 'n-800': '#1e2939', 'n-900': '#101828', 'n-950': '#030712' };

const H = oklch(BRAND).H;
const shift = h => { const o = oklch(h); const share = o.C / maxC(o.L, o.H); return hex(o.L, share * maxC(o.L, H), H); };
const A = Object.fromEntries(Object.entries(VETRA).map(([r, v]) => [r, v.map(shift)]));
// states hold the default's hue and chroma and step lightness only, as the kit does
const states = (d) => { const o = oklch(d); return { default: [d, d], hover: Array(2).fill(hex(o.L - 0.07, o.C, H)), active: Array(2).fill(hex(o.L - 0.14, o.C, H)) }; };
Object.assign(A, states(A.default[0]));
// text: move L only until it clears 4.5:1 on its pressed tint, as the kit does
A.text = A.text.map((t, mi) => { let o = oklch(t), L = o.L, g = 0; while (cr(t, A['fill-active'][mi]) < 4.5 && g++ < 200) { L += mi ? 0.004 : -0.004; t = hex(L, o.C, H); } return t; });
const b = oklch(BRAND);
const B = { ...A, ...states(BRAND.toLowerCase()) };
// Option C, "brand-leaning": the brand's hue and chroma at the lightest L where white on it still clears 4.5:1
let Lc = 0.7; while (cr('#ffffff', hex(Lc, b.C, H)) < 4.5 && Lc > 0.3) Lc -= 0.002;
const C = { ...A, ...states(hex(Lc, b.C, H)) };
// text: the kit keeps light text at or below hover's lightness; repair to 4.5:1 on the pressed tint.
const fixText = opt => {
  const t = opt.text.slice();
  if (oklch(t[0]).L > oklch(opt.hover[0]).L) t[0] = opt.active[0];
  return t.map((x, mi) => { let o = oklch(x), L = o.L, g = 0; while (cr(x, opt['fill-active'][mi]) < 4.5 && g++ < 200) { L += mi ? 0.004 : -0.004; x = hex(L, o.C, H); } return x; });
};
const D = DEFAULT ? (() => { const d = { ...A, ...states(DEFAULT.toLowerCase()) }; d.text = fixText(d); return d; })() : undefined;
const TINTED = Object.fromEntries(Object.entries(NEUTRAL).map(([k, v]) => { const n = oklch(v), c = oklch(COOL[k]); return [k, k === 'n-0' ? '#ffffff' : hex(n.L, c.C * TINT, H)]; }));

// Dark surfaces from the kit's mapping: b1 = n-900, b2 = n-800.
const b1 = ['#ffffff', TINTED['n-900']];
const b2Dark = TINTED['n-800'];
// A solid mark (dot, checkbox, focus band, filled icon) needs 3:1 on every surface it sits on.
const report = opt => {
  const r = {
    whiteOnDefault: cr('#ffffff', opt.default[0]).toFixed(2), whiteOnHover: cr('#ffffff', opt.hover[0]).toFixed(2),
    defaultOnCardLight: cr(opt.default[0], b1[0]).toFixed(2), defaultOnCardDark: cr(opt.default[1], b1[1]).toFixed(2),
    defaultOnB2Dark: cr(opt.default[1], b2Dark).toFixed(2), defaultOnFillDark: cr(opt.default[1], opt.fill[1]).toFixed(2),
    textOnCard: [0, 1].map(m => cr(opt.text[m], b1[m]).toFixed(2)).join(' / '),
  };
  r.marksPassDark = [r.defaultOnCardDark, r.defaultOnB2Dark, r.defaultOnFillDark].every(x => +x >= 3);
  return r;
};
// Kit families whose hue sits near the brand: they will read as a second accent.
const FAMILIES = { red: '#f7423d', orange: '#de6722', brown: '#b88059', yellow: '#b08822', lime: '#7c9d23', green: '#28a950', sky: '#289fb3', violet: '#9671f6', pink: '#e843a3' };
const near = Object.entries(FAMILIES).map(([f, h]) => { const d = Math.abs(((oklch(h).H - H) + 540) % 360 - 180); return [f, +d.toFixed(0)]; }).filter(([, d]) => d < 25);
const contrast = { A: report(A), B: report(B), C: report(C), ...(D ? { D: report(D) } : {}) };
const out = { nearFamilies: near, brand: BRAND, hue: +H.toFixed(1), A, B, C, ...(D ? { D } : {}), neutral: TINTED, contrast };
console.log(JSON.stringify(out, null, 2));
