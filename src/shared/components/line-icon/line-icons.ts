/** ---------------------------------------------------------------------------------------------------------------------
 * @file line-icons.ts
 * @fileOverview emoji → 24×24 line glyph, so content that stores an emoji ("⚡", "🛡️") renders as a proper
 *               stroke icon. The first block is ../ZexServerAdditionalPages/line-icons.js converted 1:1
 *               into the [element, attributes] tuples <zx-nav-icon> already renders; the second block
 *               covers the emoji the seeds use that the reference library never drew.
 *
 * @note Keys have the U+FE0F variation selector stripped — lookupIcon() strips it from input too, so
 *       "🛡️" and "🛡" are the same icon.
 */
export type IconShape = readonly [string, Readonly<Record<string, string | number>>];

export const EMOJI_ICONS: Record<string, ReadonlyArray<IconShape>> = {
  // ---- ported from the reference ------------------------------------------------------------------------------------
  '⚡': [
    ['path', { d: 'M13.5 2.5L5 14h5.5l-1 7.5L19 10h-5.5l1-7.5z' }],
  ],
  '🕑': [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', { d: 'M12 7.5V12l3.5 2' }],
  ],
  '💾': [
    ['rect', { x: 3.5, y: 3.5, width: 17, height: 17, rx: 2.4 }],
    ['path', { d: 'M8 3.5v6h8v-6' }],
    ['rect', { x: 7.5, y: 13, width: 9, height: 7.5, rx: 1.4 }],
  ],
  '🛡': [
    ['path', { d: 'M12 3l7 3v5.5c0 4.3-2.9 7.8-7 9.5-4.1-1.7-7-5.2-7-9.5V6l7-3z' }],
    ['path', { d: 'M9 12.2l2 2 4-4.2' }],
  ],
  '🌐': [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', { d: 'M3 12h18' }],
    ['path', { d: 'M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z' }],
  ],
  '🎧': [
    ['path', { d: 'M4 14v-2a8 8 0 0116 0v2' }],
    ['rect', { x: 2.5, y: 13.5, width: 4, height: 6, rx: 1.6 }],
    ['rect', { x: 17.5, y: 13.5, width: 4, height: 6, rx: 1.6 }],
    ['path', { d: 'M19.5 19.5v.5a2.5 2.5 0 01-2.5 2.5h-3' }],
  ],
  '🔐': [
    ['rect', { x: 4.5, y: 10.5, width: 15, height: 10.5, rx: 2.4 }],
    ['path', { d: 'M8 10.5V7.8a4 4 0 018 0v2.7' }],
    ['path', { d: 'M12 14.5v3' }],
  ],
  '💻': [
    ['rect', { x: 3, y: 4, width: 18, height: 12, rx: 2 }],
    ['path', { d: 'M2 20h20' }],
    ['path', { d: 'M9.5 9.5L11 11l-1.5 1.5M14 12.5h1.5' }],
  ],
  '🔑': [
    ['circle', { cx: 8, cy: 15, r: 3.5 }],
    ['path', { d: 'M10.5 12.5L20 3M16.5 6.5l2.5 2.5M14 9l2.5 2.5' }],
  ],
  '🛠': [
    ['path', { d: 'M14.5 3a5.5 5.5 0 00-4.9 8L3 17.6V21h3.4l6.6-6.6A5.5 5.5 0 0020.5 6.5l-3 3-2.5-2.5 3-3A5.5 5.5 0 0014.5 3z' }],
  ],
  '🔧': [
    ['path', { d: 'M14.5 3a5.5 5.5 0 00-4.9 8L3 17.6V21h3.4l6.6-6.6A5.5 5.5 0 0020.5 6.5l-3 3-2.5-2.5 3-3A5.5 5.5 0 0014.5 3z' }],
  ],
  '📍': [
    ['path', { d: 'M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z' }],
    ['circle', { cx: 12, cy: 10, r: 2.6 }],
  ],
  '🔒': [
    ['rect', { x: 4.5, y: 10.5, width: 15, height: 10.5, rx: 2.4 }],
    ['path', { d: 'M8 10.5V7.8a4 4 0 018 0v2.7' }],
    ['path', { d: 'M12 14.5v3' }],
  ],
  '📦': [
    ['path', { d: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z' }],
    ['path', { d: 'M4 7.5l8 4.5 8-4.5M12 12v9' }],
  ],
  '🚫': [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', { d: 'M6 6l12 12' }],
  ],
  '✅': [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', { d: 'M8 12.3l2.6 2.6L16 9.5' }],
  ],
  '🔄': [
    ['path', { d: 'M20 11a8 8 0 10-2.6 5.9' }],
    ['path', { d: 'M20 5v6h-6' }],
  ],
  '⚙': [
    ['circle', { cx: 12, cy: 12, r: 3.2 }],
    ['path', { d: 'M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.4 5.4l2.1 2.1M16.5 16.5l2.1 2.1M18.6 5.4l-2.1 2.1M7.5 16.5l-2.1 2.1' }],
  ],
  '📈': [
    ['path', { d: 'M4 18V9M10 18v-6M16 18v-9M22 18V5' }],
  ],
  '🖥': [
    ['rect', { x: 3, y: 4, width: 18, height: 12, rx: 2 }],
    ['path', { d: 'M8 20h8M12 16v4' }],
  ],
  '💼': [
    ['rect', { x: 3, y: 7.5, width: 18, height: 12, rx: 2.4 }],
    ['path', { d: 'M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5' }],
    ['path', { d: 'M3 12.5h18' }],
  ],
  '🗃': [
    ['ellipse', { cx: 12, cy: 6, rx: 7.5, ry: 3 }],
    ['path', { d: 'M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6' }],
    ['path', { d: 'M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6' }],
  ],
  '🧩': [
    ['rect', { x: 3, y: 4, width: 8, height: 7.5, rx: 1 }],
    ['rect', { x: 13, y: 4, width: 8, height: 7.5, rx: 1 }],
    ['rect', { x: 3, y: 13.5, width: 8, height: 7.5, rx: 1 }],
    ['rect', { x: 13, y: 13.5, width: 8, height: 7.5, rx: 1 }],
  ],
  // ---- drawn here, same grid / weight ---------------------------------------------------------------------------------
  '🧪': [
    ['path', { d: 'M9 3h6M10 3v6.5L4.8 18.6A2 2 0 006.5 21h11a2 2 0 001.7-2.4L14 9.5V3' }],
    ['path', { d: 'M7.5 15h9' }],
  ],
  '🔍': [
    ['circle', { cx: 10.5, cy: 10.5, r: 6.5 }],
    ['path', { d: 'M15.5 15.5L21 21' }],
  ],
  '⏰': [
    ['circle', { cx: 12, cy: 13, r: 8 }],
    ['path', { d: 'M12 9v4l2.5 1.5M5 4L3 6M19 4l2 2' }],
  ],
  '🎯': [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['circle', { cx: 12, cy: 12, r: 5.2 }],
    ['circle', { cx: 12, cy: 12, r: 1.6 }],
  ],
  '🧱': [
    ['rect', { x: 3, y: 5, width: 18, height: 14, rx: 1.5 }],
    ['path', { d: 'M3 12h18M8 5v7M16 5v7M12 12v7' }],
  ],
  '🪟': [
    ['rect', { x: 3.5, y: 3.5, width: 17, height: 17, rx: 2 }],
    ['path', { d: 'M12 3.5v17M3.5 12h17' }],
  ],
  '🛒': [
    ['path', { d: 'M3 4h2.2l2.3 11h11L21 7H6.4' }],
    ['circle', { cx: 9, cy: 19.5, r: 1.5 }],
    ['circle', { cx: 17, cy: 19.5, r: 1.5 }],
  ],
  '🚀': [
    ['path', { d: 'M12 3c3.5 2 5.5 6 5.5 10.5L14 16h-4l-3.5-2.5C6.5 9 8.5 5 12 3z' }],
    ['circle', { cx: 12, cy: 10, r: 1.6 }],
    ['path', { d: 'M9 16l-1 4.5M15 16l1 4.5M10.5 16.5h3' }],
  ],
  '🔇': [
    ['path', { d: 'M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z' }],
    ['path', { d: 'M16 9.5l5 5M21 9.5l-5 5' }],
  ],
  '📊': [
    ['path', { d: 'M4 20h16' }],
    ['rect', { x: 5.5, y: 11, width: 3.5, height: 9 }],
    ['rect', { x: 10.5, y: 6, width: 3.5, height: 14 }],
    ['rect', { x: 15.5, y: 13.5, width: 3.5, height: 6.5 }],
  ],
  '🐸': [
    ['path', { d: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z' }],
    ['path', { d: 'M4 7.5l8 4.5 8-4.5M12 12v9' }],
  ],
  '🎨': [
    ['path', { d: 'M12 3a9 9 0 100 18c1.7 0 2.5-1 2.5-2.2 0-1.4-1-2-1-3.3 0-1 .8-1.7 1.8-1.7H17a4 4 0 004-4c0-3.9-4-6.8-9-6.8z' }],
    ['circle', { cx: 7.5, cy: 11, r: 1.2 }],
    ['circle', { cx: 10.5, cy: 7.5, r: 1.2 }],
    ['circle', { cx: 15, cy: 7.5, r: 1.2 }],
  ],
  '🏗️': [
    ['path', { d: 'M3 21h18M6 21V9l6-4 6 4v12M10 21v-5h4v5' }],
    ['path', { d: 'M12 5V3' }],
  ],
  '💿': [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['circle', { cx: 12, cy: 12, r: 2.5 }],
    ['path', { d: 'M12 6.5a5.5 5.5 0 015.5 5.5' }],
  ],
  '🪨': [
    ['path', { d: 'M4 16l3-7 5-3 6 2 2 5-3 5H7z' }],
    ['path', { d: 'M7 9l5 3 6-2M12 12l-2 6' }],
  ],
  '🔁': [
    ['path', { d: 'M17 2.5l3 3-3 3M20 5.5H8a4 4 0 00-4 4v1' }],
    ['path', { d: 'M7 21.5l-3-3 3-3M4 18.5h12a4 4 0 004-4v-1' }],
  ],
  '🍋': [
    ['path', { d: 'M12 3c4 4 7 7.5 7 11a7 7 0 01-14 0c0-3.5 3-7 7-11z' }],
    ['path', { d: 'M12 9v9M9 14l3 3 3-3' }],
  ],
  '📉': [
    ['path', { d: 'M3 5v14h18' }],
    ['path', { d: 'M6 8l4.5 5 3-3L19 16M19 12v4h-4' }],
  ],
  '👀': [
    ['path', { d: 'M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z' }],
    ['circle', { cx: 12, cy: 12, r: 2.8 }],
  ],
  '🗄️': [
    ['ellipse', { cx: 12, cy: 6, rx: 7.5, ry: 3 }],
    ['path', { d: 'M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6' }],
    ['path', { d: 'M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6' }],
  ],
  '🌍': [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', { d: 'M3 12h18' }],
    ['path', { d: 'M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z' }],
  ],
  '🐧': [
    ['rect', { x: 3, y: 4, width: 18, height: 16, rx: 2 }],
    ['path', { d: 'M7 9l3 3-3 3M12.5 15h4.5' }],
  ],
  '✉️': [
    ['rect', { x: 3, y: 5, width: 18, height: 14, rx: 2 }],
    ['path', { d: 'M3.5 6.5L12 13l8.5-6.5' }],
  ],
  '🎮': [
    ['path', { d: 'M7 7h10a5 5 0 014.8 6.3l-1 3.8a2.5 2.5 0 01-4.3 1L15 16.5H9l-1.5 1.6a2.5 2.5 0 01-4.3-1l-1-3.8A5 5 0 017 7z' }],
    ['path', { d: 'M8 10.5v3M6.5 12h3M15 11.5h.01M17.5 13h.01' }],
  ],
  '🌪️': [
    ['path', { d: 'M4 5h16M6 9h12M8 13h8M10 17h4M11.5 21h1' }],
  ],
  '🎫': [
    ['path', { d: 'M3 8.5a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 3v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-3z' }],
    ['path', { d: 'M14 7v10' }],
  ],
};

const stripVariant = (emoji: string): string => emoji.replace(/\uFE0F/g, '');

/** Keys normalised once, so an entry typed with the selector ("🗄️") still matches. */
const NORMALISED: ReadonlyMap<string, ReadonlyArray<IconShape>> = new Map(
  Object.entries(EMOJI_ICONS).map(([emoji, shapes]) => [stripVariant(emoji), shapes]),
);

/** Plain-word aliases for content that names an icon instead of pasting the emoji (e.g. social links). */
const ALIASES: Readonly<Record<string, string>> = {
  globe: '🌐',
  website: '🌐',
  mail: '✉️',
  email: '✉️',
};

/** Strips the emoji variation selector so both spellings of "🛡️" hit the same entry. */
export function lookupIcon(emoji: string): ReadonlyArray<IconShape> | undefined {
  const key = ALIASES[emoji.trim().toLowerCase()] ?? emoji;
  return NORMALISED.get(stripVariant(key));
}
