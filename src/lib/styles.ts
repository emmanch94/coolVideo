import type { Brand } from "./types";

export interface VisualStyle {
  id: string;
  name: string;
  tagline: string;
  /** Tailwind gradient classes used for the style card preview. */
  gradient: string;
  emoji: string;
  look: string;
  motion: string;
}

export const STYLES: VisualStyle[] = [
  {
    id: "motion-graphics",
    name: "Motion Graphics",
    tagline: "Formas audaces y diseño cinético",
    gradient: "from-violet-500 via-fuchsia-500 to-orange-400",
    emoji: "🌀",
    look:
      "modern flat motion graphics design, bold geometric shapes, vibrant gradients, clean vector " +
      "illustration, dynamic composition with depth layers, generous negative space, Dribbble-quality",
    motion:
      "smooth kinetic motion graphics animation, shapes morph and slide in with eased timing, " +
      "parallax layers, subtle camera push-in",
  },
  {
    id: "vox",
    name: "Vox Style",
    tagline: "Collage explicativo con texturas de papel",
    gradient: "from-amber-300 via-yellow-400 to-red-500",
    emoji: "📰",
    look:
      "Vox explainer video style, mixed-media paper cut-out collage, halftone archival photos, torn " +
      "paper edges, highlighter marker annotations, arrows and circles drawn by hand, muted yellow " +
      "and black palette, documentary editorial look",
    motion:
      "Vox-style explainer animation, paper cut-outs slide and pop in, hand-drawn annotations " +
      "animate on, slow documentary pan across the collage",
  },
  {
    id: "3d-isometric",
    name: "3D Isometric",
    tagline: "Mundos de producto en 3D",
    gradient: "from-sky-400 via-cyan-400 to-emerald-400",
    emoji: "🧊",
    look:
      "cute 3D isometric scene, soft clay-like materials, pastel colors, studio lighting with soft " +
      "shadows, miniature diorama representing the product, Blender octane render",
    motion:
      "gentle 3D isometric animation, small elements bounce and rotate, camera slowly orbits the diorama",
  },
  {
    id: "cinematic",
    name: "Cinematic Ad",
    tagline: "Look de comercial premium",
    gradient: "from-zinc-200 via-slate-400 to-indigo-600",
    emoji: "🎬",
    look:
      "high-end cinematic commercial still, dramatic rim lighting, shallow depth of field, anamorphic " +
      "lens flare, rich color grading, photorealistic hero shot, 35mm film",
    motion:
      "cinematic commercial shot, slow dolly-in with rack focus, light sweeps across the subject, " +
      "atmospheric particles",
  },
  {
    id: "retro-vhs",
    name: "Retro VHS",
    tagline: "Nostalgia synthwave de los 80",
    gradient: "from-pink-500 via-purple-600 to-indigo-700",
    emoji: "📼",
    look:
      "1980s retro synthwave aesthetic, neon grid horizon, chrome text effects, VHS scanlines and " +
      "chromatic aberration, magenta and cyan palette, glowing sunset",
    motion:
      "retro VHS animation, neon lights flicker, grid scrolls toward the horizon, tape glitch transitions",
  },
  {
    id: "anime",
    name: "Anime",
    tagline: "Animación japonesa pintada a mano",
    gradient: "from-rose-300 via-pink-400 to-sky-400",
    emoji: "🌸",
    look:
      "Japanese anime key visual, hand-painted backgrounds, soft cel shading, vivid sky with fluffy " +
      "clouds, expressive characters using the product, Makoto Shinkai inspired lighting",
    motion:
      "anime style animation, wind moves hair and petals, light rays shimmer, gentle camera tilt up to the sky",
  },
  {
    id: "minimal",
    name: "Minimal Swiss",
    tagline: "Retícula, tipografía y elegancia",
    gradient: "from-neutral-100 via-neutral-300 to-red-500",
    emoji: "◼️",
    look:
      "minimalist Swiss International design poster, strict grid, bold abstract forms, limited " +
      "palette of off-white, black and one accent color, lots of whitespace, Bauhaus influence",
    motion:
      "minimal Swiss design animation, blocks slide on the grid with precise timing, crisp masks reveal elements",
  },
  {
    id: "claymation",
    name: "Claymation",
    tagline: "Encanto stop-motion artesanal",
    gradient: "from-orange-300 via-amber-500 to-lime-500",
    emoji: "🧸",
    look:
      "stop-motion claymation scene, handmade plasticine characters and props with visible " +
      "fingerprints, warm practical lighting, miniature set, Aardman inspired",
    motion:
      "stop-motion claymation animation at 12fps, characters wobble and gesture, slight frame jitter",
  },
];

export const STYLE_IDS = STYLES.map((s) => s.id) as [string, ...string[]];

export function getStyle(id: string): VisualStyle | undefined {
  return STYLES.find((s) => s.id === id);
}

function brandContext(brand: Brand): string {
  const parts = [`Promotional visual for "${brand.name}"`];
  if (brand.description) parts.push(`What it is: ${brand.description}`);
  if (brand.headlines.length) parts.push(`Key messages: ${brand.headlines.slice(0, 3).join("; ")}`);
  if (brand.themeColor) parts.push(`Brand accent color ${brand.themeColor}`);
  return parts.join(". ");
}

export function buildImagePrompt(style: VisualStyle, brand: Brand): string {
  return (
    `${brandContext(brand)}. Style: ${style.look}. ` +
    "Eye-catching social media ad composition that clearly communicates the product's value, " +
    "no watermarks, no gibberish text, high detail."
  ).slice(0, 1800);
}

export function buildVideoPrompt(style: VisualStyle, brand: Brand): string {
  return `${style.motion}. Promotional clip for ${brand.name}, smooth loopable motion, high quality.`;
}
