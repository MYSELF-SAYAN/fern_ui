import * as React from "react"
import type { ControlsSchema, Preset } from "@/components/playground/types"

export interface ComponentProp {
  name: string
  type: string
  default?: string
  description: string
  required?: boolean
}

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

const PM_EXECUTORS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
}

export const PACKAGE_MANAGERS = Object.keys(PM_EXECUTORS) as PackageManager[]

export interface ComponentItem {
  name: string
  slug: string
  href?: string
  subtitle?: string
  description: string
  interactionType?: string
  category: string
  badge?: string
  registry?: string
  dependencies: string[]
  registryDependencies?: string[]
  controls: ControlsSchema
  presets: Preset[]
  props: ComponentProp[]
  codeExample: string
  filePath: string
  installCommand?: string
  fullCode?: string
  renderDemo?: (
    props: Record<string, any>,
    setProp: (key: string, value: any) => void
  ) => React.ReactNode
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ORBIT GLOBE
// ─────────────────────────────────────────────────────────────────────────────

const orbitGlobeControls: ControlsSchema = {
  globeSize: {
    type: "number",
    label: "Globe Size",
    category: "Geometry",
    defaultValue: 50,
    min: 30,
    max: 85,
    step: 1,
    unit: "%",
  },
  cardSize: {
    type: "number",
    label: "Card Size",
    category: "Geometry",
    defaultValue: 24,
    min: 12,
    max: 38,
    step: 1,
    unit: "%",
  },
  cardAspect: {
    type: "select",
    label: "Card Aspect Ratio",
    category: "Geometry",
    defaultValue: "3:4",
    options: ["1:1", "4:3", "3:4", "16:9"],
  },
  tilt: {
    type: "number",
    label: "Axis Tilt",
    category: "Orientation",
    defaultValue: 27,
    min: -60,
    max: 60,
    step: 1,
    unit: "°",
  },
  backFade: {
    type: "number",
    label: "Depth Fading",
    category: "Appearance",
    defaultValue: 55,
    min: 0,
    max: 95,
    step: 5,
    unit: "%",
  },
  gap: {
    type: "number",
    label: "Card Spacing",
    category: "Geometry",
    defaultValue: 2.5,
    min: 1.0,
    max: 6.0,
    step: 0.1,
  },
  duration: {
    type: "number",
    label: "Rotation Speed",
    category: "Animation",
    defaultValue: 20,
    min: 4,
    max: 60,
    step: 1,
    unit: "s",
  },
  direction: {
    type: "select",
    label: "Orbit Direction",
    category: "Animation",
    defaultValue: "left",
    options: ["left", "right", "alternate"],
  },
  playing: {
    type: "boolean",
    label: "Auto-Rotate",
    category: "Animation",
    defaultValue: true,
  },
  pauseOnHover: {
    type: "boolean",
    label: "Pause on Hover",
    category: "Interaction",
    defaultValue: true,
  },
  draggable: {
    type: "boolean",
    label: "Drag to Rotate",
    category: "Interaction",
    defaultValue: true,
  },
  zoomOnClick: {
    type: "boolean",
    label: "Click to Spotlight",
    category: "Interaction",
    defaultValue: true,
  },
  wheelZoom: {
    type: "boolean",
    label: "Wheel Zoom",
    category: "Interaction",
    defaultValue: true,
  },
}

const orbitGlobePresets: Preset[] = [
  {
    name: "Classic Orbit",
    description: "Standard spherical orbit with subtle depth fading and upright cards.",
    values: {
      globeSize: 50,
      cardSize: 24,
      cardAspect: "3:4",
      tilt: 27,
      backFade: 55,
      duration: 20,
      direction: "left",
      playing: true,
    },
  },
  {
    name: "High Velocity",
    description: "Fast-spinning orbit with high depth fading for dramatic perspective.",
    values: {
      globeSize: 52,
      cardSize: 20,
      tilt: 18,
      backFade: 75,
      duration: 8,
      direction: "left",
      playing: true,
    },
  },
  {
    name: "Deep Space",
    description: "Large globe with high tilt angle and stark depth contrast.",
    values: {
      globeSize: 62,
      cardSize: 22,
      tilt: 45,
      backFade: 80,
      duration: 28,
      direction: "left",
      playing: true,
    },
  },
  {
    name: "Spotlight Focus",
    description: "Compact globe optimized for clicking into hero card view.",
    values: {
      globeSize: 42,
      cardSize: 28,
      tilt: 15,
      backFade: 40,
      duration: 32,
      direction: "alternate",
      playing: true,
    },
  },
  {
    name: "Dark Tech Showcase",
    description: "Tilted orbit with dense spacing and dark mood aesthetics.",
    values: {
      globeSize: 56,
      cardSize: 26,
      tilt: 35,
      gap: 3.0,
      duration: 24,
      direction: "left",
      playing: true,
      backFade: 85,
    },
  },
]

const orbitGlobeProps: ComponentProp[] = [
  { name: "items", type: "OrbitGlobeItem[]", description: "Array of items with title, subtitle, image, or custom content.", required: true },
  { name: "globeSize", type: "number", default: "50", description: "Relative size of the orbit globe relative to container (30–85)." },
  { name: "cardSize", type: "number", default: "24", description: "Width of each card relative to container (12–38)." },
  { name: "cardAspect", type: "string", default: "'3:4'", description: "Aspect ratio for cards ('1:1', '4:3', '3:4', '16:9')." },
  { name: "tilt", type: "number", default: "27", description: "Tilt angle of the globe axis in degrees (-60 to 60)." },
  { name: "backFade", type: "number", default: "55", description: "Depth fade intensity for rear-facing cards (0–95%)." },
  { name: "gap", type: "number", default: "2.5", description: "Gap between cards on the spherical surface." },
  { name: "duration", type: "number", default: "20", description: "Duration of one full rotation in seconds." },
  { name: "direction", type: "'left' | 'right' | 'alternate'", default: "'left'", description: "Direction of rotation animation." },
  { name: "playing", type: "boolean", default: "true", description: "Whether the rotation animation is active." },
  { name: "pauseOnHover", type: "boolean", default: "true", description: "Pause rotation when hovering over cards." },
  { name: "draggable", type: "boolean", default: "true", description: "Allow mouse/touch dragging to spin the globe." },
  { name: "zoomOnClick", type: "boolean", default: "true", description: "Click a card to zoom into hero spotlight view." },
  { name: "wheelZoom", type: "boolean", default: "true", description: "Allow mouse wheel to scale globe size in and out." },
]

const orbitGlobeCodeExample = `import { OrbitGlobe, OrbitGlobeImage } from "@/components/ui/orbit-globe"

const items = [
  {
    id: 1,
    title: "12K Downloads",
    content: <div className="bg-gradient-to-br from-indigo-600 to-pink-500 p-4 text-white">...</div>,
  },
  {
    id: 2,
    title: "Architecture",
    content: <OrbitGlobeImage src="https://..." alt="Architecture" />,
  },
]

export function Demo() {
  return (
    <OrbitGlobe
      items={items}
      globeSize={50}
      cardSize={24}
      tilt={27}
      playing
      draggable
      zoomOnClick
    />
  )
}`

// ─────────────────────────────────────────────────────────────────────────────
// 2. GRID ZOOM STRIP
// ─────────────────────────────────────────────────────────────────────────────

const gridZoomStripControls: ControlsSchema = {
  initialCols: {
    type: "number",
    label: "Grid Columns",
    category: "Grid Layout",
    defaultValue: 3,
    min: 2,
    max: 5,
    step: 1,
  },
  initialRows: {
    type: "number",
    label: "Grid Rows",
    category: "Grid Layout",
    defaultValue: 3,
    min: 2,
    max: 4,
    step: 1,
  },
  zoomDuration: {
    type: "number",
    label: "Zoom Duration",
    category: "Transition Physics",
    defaultValue: 0.9,
    min: 0.3,
    max: 2.5,
    step: 0.1,
    unit: "s",
  },
  springStiffness: {
    type: "number",
    label: "Spring Stiffness",
    category: "Transition Physics",
    defaultValue: 260,
    min: 80,
    max: 500,
    step: 10,
  },
  springDamping: {
    type: "number",
    label: "Spring Damping",
    category: "Transition Physics",
    defaultValue: 28,
    min: 12,
    max: 50,
    step: 2,
  },
  scrollProgress: {
    type: "number",
    label: "Manual Scroll Progress",
    category: "Scroll Simulation",
    defaultValue: 0.0,
    min: 0,
    max: 1,
    step: 0.01,
  },
  focusIndex: {
    type: "number",
    label: "Center Card Index",
    category: "Strip Stage",
    defaultValue: 0,
    min: 0,
    max: 8,
    step: 1,
  },
  gap: {
    type: "number",
    label: "Card Gap",
    category: "Appearance",
    defaultValue: 16,
    min: 4,
    max: 40,
    step: 2,
    unit: "px",
  },
  overlayFade: {
    type: "number",
    label: "Backdrop Dimmer",
    category: "Appearance",
    defaultValue: 70,
    min: 0,
    max: 95,
    step: 5,
    unit: "%",
  },
  itemScale: {
    type: "number",
    label: "Scale Multiplier",
    category: "Appearance",
    defaultValue: 1.0,
    min: 0.7,
    max: 1.3,
    step: 0.05,
    unit: "x",
  },
  allowManualScroll: {
    type: "boolean",
    label: "Allow Drag / Wheel",
    category: "Interaction",
    defaultValue: true,
  },
  showControls: {
    type: "boolean",
    label: "Show Floating Scrub Bar",
    category: "Interaction",
    defaultValue: true,
  },
}

const gridZoomStripPresets: Preset[] = [
  {
    name: "1. Initial 3×3 Grid",
    description: "Overview state showing all 9 cards in an aligned grid layout.",
    values: {
      scrollProgress: 0.0,
      initialCols: 3,
      initialRows: 3,
      gap: 16,
      overlayFade: 0,
    },
  },
  {
    name: "2. Full In-Line Strip",
    description: "Fully expanded horizontal reel with center hero focus.",
    values: {
      scrollProgress: 1.0,
      focusIndex: 0,
      gap: 20,
      overlayFade: 75,
    },
  },
  {
    name: "3. Mid-Transition Morph",
    description: "Halfway state transitioning between 3×3 grid and linear horizontal strip.",
    values: {
      scrollProgress: 0.5,
      gap: 18,
      overlayFade: 40,
      springStiffness: 240,
      springDamping: 26,
    },
  },
  {
    name: "4. Single Focus Card",
    description: "Cinematic focal view highlighting item #2 with dimmed surroundings.",
    values: {
      scrollProgress: 1.0,
      focusIndex: 1,
      overlayFade: 85,
      itemScale: 1.05,
    },
  },
  {
    name: "5. Snappy High Spring",
    description: "Snappy, high-velocity spring physics for rapid transition tests.",
    values: {
      zoomDuration: 0.6,
      springStiffness: 420,
      springDamping: 22,
      allowManualScroll: true,
    },
  },
  {
    name: "6. Gentle Cinematic Drift",
    description: "Luxurious, relaxed easing curves for editorial presentation.",
    values: {
      scrollProgress: 0.75,
      zoomDuration: 1.6,
      springStiffness: 140,
      springDamping: 36,
      gap: 24,
      overlayFade: 60,
    },
  },
]

const gridZoomStripProps: ComponentProp[] = [
  { name: "items", type: "GridZoomStripItem[]", description: "Array of items with title, subtitle, image, or custom content.", required: true },
  { name: "initialCols", type: "number", default: "3", description: "Number of columns in the initial grid state (2–5)." },
  { name: "initialRows", type: "number", default: "3", description: "Number of rows in the initial grid state (2–4)." },
  { name: "scrollProgress", type: "number", default: "0", description: "Controlled progress value from 0 (grid) to 1 (strip)." },
  { name: "focusIndex", type: "number", default: "0", description: "Active card index to center when in strip mode." },
  { name: "gap", type: "number", default: "16", description: "Pixel spacing between cards." },
  { name: "allowManualScroll", type: "boolean", default: "true", description: "Enable drag and wheel scrubbing." },
  { name: "showControls", type: "boolean", default: "true", description: "Show bottom scrub bar controller." },
]

const gridZoomStripCodeExample = `import { GridZoomStrip, GridZoomStripImage } from "@/components/ui/grid-zoom-strip"

const items = [
  { id: 1, title: "Minimal Concrete", image: "https://..." },
  { id: 2, title: "12K Installs", content: <div className="p-4 bg-purple-600">...</div> },
]

export function Demo() {
  return (
    <GridZoomStrip
      items={items}
      initialCols={3}
      initialRows={3}
      allowManualScroll
      showControls
    />
  )
}`

// ─────────────────────────────────────────────────────────────────────────────
// 3. FOCUS SLIDER
// ─────────────────────────────────────────────────────────────────────────────

const focusSliderControls: ControlsSchema = {
  cardWidth: {
    type: "number",
    label: "Card Width",
    category: "Geometry",
    defaultValue: 320,
    min: 200,
    max: 600,
    step: 10,
    unit: "px",
  },
  cardAspect: {
    type: "select",
    label: "Card Aspect Ratio",
    category: "Geometry",
    defaultValue: "3:4",
    options: ["1:1", "4:3", "3:4", "16:9"],
  },
  focusScale: {
    type: "number",
    label: "Focus Scale",
    category: "Scale & Hierarchy",
    defaultValue: 1.0,
    min: 0.9,
    max: 1.3,
    step: 0.05,
    unit: "x",
  },
  sideScale: {
    type: "number",
    label: "Side Cards Scale",
    category: "Scale & Hierarchy",
    defaultValue: 0.88,
    min: 0.6,
    max: 1.0,
    step: 0.02,
    unit: "x",
  },
  gap: {
    type: "number",
    label: "Card Gap",
    category: "Geometry",
    defaultValue: 24,
    min: 8,
    max: 64,
    step: 4,
    unit: "px",
  },
  sideOpacity: {
    type: "number",
    label: "Side Cards Opacity",
    category: "Appearance",
    defaultValue: 0.7,
    min: 0.1,
    max: 1.0,
    step: 0.05,
    unit: "x",
  },
  sideBlur: {
    type: "number",
    label: "Side Cards Blur",
    category: "Appearance",
    defaultValue: 0,
    min: 0,
    max: 12,
    step: 1,
    unit: "px",
  },
  springStiffness: {
    type: "number",
    label: "Spring Stiffness",
    category: "Spring Physics",
    defaultValue: 300,
    min: 80,
    max: 600,
    step: 20,
  },
  springDamping: {
    type: "number",
    label: "Spring Damping",
    category: "Spring Physics",
    defaultValue: 30,
    min: 10,
    max: 60,
    step: 2,
  },
  loop: {
    type: "boolean",
    label: "Infinite Loop",
    category: "Behavior",
    defaultValue: true,
  },
  orientation: {
    type: "select",
    label: "Orientation",
    category: "Geometry",
    defaultValue: "horizontal",
    options: ["horizontal", "vertical"],
  },
  clickToFocus: {
    type: "boolean",
    label: "Click to Focus",
    category: "Interaction",
    defaultValue: true,
  },
  mouseWheelScroll: {
    type: "boolean",
    label: "Mouse Wheel Scroll",
    category: "Interaction",
    defaultValue: true,
  },
  dragEnabled: {
    type: "boolean",
    label: "Drag Enabled",
    category: "Interaction",
    defaultValue: true,
  },
}

const focusSliderPresets: Preset[] = [
  {
    name: "Default Focus",
    description: "Balanced single-card prominence with gentle side scaling.",
    values: {
      cardWidth: 320,
      focusScale: 1.0,
      sideScale: 0.88,
      gap: 24,
      sideOpacity: 0.7,
      sideBlur: 0,
      springStiffness: 300,
      springDamping: 30,
    },
  },
  {
    name: "Compact Multi-Card",
    description: "Shows more surrounding cards with tighter gap and subtle blur.",
    values: {
      cardWidth: 260,
      focusScale: 1.05,
      sideScale: 0.82,
      gap: 16,
      sideOpacity: 0.55,
      sideBlur: 2,
      springStiffness: 350,
      springDamping: 28,
    },
  },
  {
    name: "Cinematic Wide",
    description: "Expansive landscape cards with soft side falloff.",
    values: {
      cardWidth: 440,
      cardAspect: "16:9",
      focusScale: 1.0,
      sideScale: 0.85,
      gap: 32,
      sideOpacity: 0.5,
      sideBlur: 1,
    },
  },
  {
    name: "High Velocity",
    description: "Rapid transitions with low damping and higher spring stiffness.",
    values: {
      springStiffness: 480,
      springDamping: 22,
      dragEnabled: true,
      mouseWheelScroll: true,
    },
  },
  {
    name: "Subtle Blur",
    description: "Depth-of-field effect where non-focused cards are softly blurred.",
    values: {
      sideScale: 0.84,
      sideOpacity: 0.45,
      sideBlur: 6,
      gap: 28,
    },
  },
]

const focusSliderProps: ComponentProp[] = [
  { name: "items", type: "FocusSliderItem[]", description: "Array of items with title, subtitle, image, or custom content.", required: true },
  { name: "cardWidth", type: "number", default: "320", description: "Width of cards in pixels." },
  { name: "cardAspect", type: "string", default: "'3:4'", description: "Aspect ratio for cards ('1:1', '4:3', '3:4', '16:9')." },
  { name: "focusScale", type: "number", default: "1.0", description: "Scale multiplier for active centered card." },
  { name: "sideScale", type: "number", default: "0.88", description: "Scale multiplier for non-centered cards." },
  { name: "gap", type: "number", default: "24", description: "Pixel spacing between cards." },
  { name: "sideOpacity", type: "number", default: "0.7", description: "Opacity for non-centered cards." },
  { name: "sideBlur", type: "number", default: "0", description: "Blur filter in pixels for side cards." },
  { name: "springStiffness", type: "number", default: "300", description: "Physics stiffness for transition animations." },
  { name: "springDamping", type: "number", default: "30", description: "Physics damping for transition animations." },
  { name: "loop", type: "boolean", default: "true", description: "Allow infinite wrapping around cards." },
]

const focusSliderCodeExample = `import { FocusSlider } from "@/components/ui/focus-slider"

const items = [
  { id: 1, title: "North Ave", color: "#545b41" },
  { id: 2, title: "Studio Love", color: "#ebe8de" },
]

export function Demo() {
  return (
    <FocusSlider
      items={items}
      cardWidth={320}
      focusScale={1.0}
      sideScale={0.88}
      loop
      clickToFocus
    />
  )
}`

// ─────────────────────────────────────────────────────────────────────────────
// 4. MOBBIN STATS REVEAL
// ─────────────────────────────────────────────────────────────────────────────

const mobbinStatsRevealControls: ControlsSchema = {
  progress: {
    type: "number",
    label: "Progress",
    category: "Reveal",
    defaultValue: 0.0,
    min: 0,
    max: 1,
    step: 0.01,
  },
  title: {
    type: "string",
    label: "Header Text",
    category: "Content",
    defaultValue: "A growing library of",
  },
  iconCount: {
    type: "number",
    label: "Floating Icons",
    category: "Icons & Motion",
    defaultValue: 12,
    min: 4,
    max: 12,
    step: 1,
  },
  iconSize: {
    type: "number",
    label: "Icon Size",
    category: "Icons & Motion",
    defaultValue: 56,
    min: 40,
    max: 72,
    step: 2,
    unit: "px",
  },
  iconSpread: {
    type: "number",
    label: "Icon Spread",
    category: "Icons & Motion",
    defaultValue: 1.15,
    min: 0.6,
    max: 2.0,
    step: 0.05,
    unit: "x",
  },
  iconSpeed: {
    type: "number",
    label: "Float Speed",
    category: "Icons & Motion",
    defaultValue: 1.0,
    min: 0.2,
    max: 2.5,
    step: 0.1,
    unit: "x",
  },
  randomMovement: {
    type: "boolean",
    label: "Random Drift",
    category: "Icons & Motion",
    defaultValue: true,
  },
  iconParallax: {
    type: "number",
    label: "Parallax Factor",
    category: "Icons & Motion",
    defaultValue: 1.0,
    min: 0,
    max: 2.0,
    step: 0.1,
    unit: "x",
  },
  iconWiggle: {
    type: "boolean",
    label: "Gentle Wiggle",
    category: "Icons & Motion",
    defaultValue: true,
  },
  particleCount: {
    type: "number",
    label: "Background Particles",
    category: "Icons & Motion",
    defaultValue: 8,
    min: 0,
    max: 20,
    step: 1,
  },
  counterDuration: {
    type: "number",
    label: "Counter Speed",
    category: "Typography",
    defaultValue: 1.2,
    min: 0.4,
    max: 3.0,
    step: 0.1,
    unit: "s",
  },
  numberSeparators: {
    type: "boolean",
    label: "Comma Separators",
    category: "Typography",
    defaultValue: true,
  },
  responsiveLayout: {
    type: "boolean",
    label: "Responsive Scale",
    category: "Layout",
    defaultValue: true,
  },
}

const mobbinStatsRevealPresets: Preset[] = [
  {
    name: "1. Initial State",
    description: "Start of scroll animation with floating app icons and muted text.",
    values: {
      progress: 0.0,
      iconCount: 12,
      iconSpread: 1.15,
      randomMovement: true,
    },
  },
  {
    name: "2. Mid-Reveal",
    description: "Transition point where stats begin scaling up and icons drift away.",
    values: {
      progress: 0.5,
      iconSpread: 1.3,
    },
  },
  {
    name: "3. Complete Reveal",
    description: "Full metrics unlocked with large prominent numbers and active glow.",
    values: {
      progress: 1.0,
      iconSpread: 1.5,
    },
  },
  {
    name: "4. Compact / Mobile",
    description: "Tighter bounds with fewer icons, optimized for smaller screens.",
    values: {
      iconCount: 6,
      iconSize: 44,
      iconSpread: 0.85,
    },
  },
  {
    name: "5. High-Motion Drift",
    description: "Dramatic floating icons with fast drift speeds and heavy wiggle.",
    values: {
      iconSpeed: 2.0,
      randomMovement: true,
      iconWiggle: true,
      particleCount: 16,
    },
  },
  {
    name: "6. Minimalist Static",
    description: "Clean presentation without floating drift or background particles.",
    values: {
      randomMovement: false,
      iconWiggle: false,
      particleCount: 0,
    },
  },
]

const mobbinStatsRevealProps: ComponentProp[] = [
  { name: "progress", type: "number", default: "0", description: "Scroll progress ratio between 0 and 1." },
  { name: "title", type: "string", default: "'A growing library of'", description: "Primary section heading text." },
  { name: "stats", type: "MobbinStatItem[]", description: "Array of numerical metrics with labels." },
  { name: "apps", type: "MobbinAppIcon[]", description: "Array of floating logo items with coordinates." },
  { name: "iconCount", type: "number", default: "12", description: "Number of floating icons to render." },
  { name: "counterDuration", type: "number", default: "1.2", description: "Speed of numeric roll animation in seconds." },
]

const mobbinStatsRevealCodeExample = `import { MobbinStatsReveal } from "@/components/ui/mobbin-stats-reveal"

export function Demo() {
  return (
    <MobbinStatsReveal
      progress={0.5}
      title="A growing library of"
    />
  )
}`

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY AGGREGATION
// ─────────────────────────────────────────────────────────────────────────────

export const components: ComponentItem[] = [
  {
    name: "Orbit Globe",
    slug: "orbit-globe",
    href: "/components/orbit-globe",
    description: "Spherical 3D globe of floating cards with perspective depth and drag rotation.",
    category: "3D & Motion",
    badge: "Interactive 3D",
    registry: "orbit-globe",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["utils"],
    filePath: "components/ui/orbit-globe.tsx",
    controls: orbitGlobeControls,
    presets: orbitGlobePresets,
    props: orbitGlobeProps,
    codeExample: orbitGlobeCodeExample,
  },
  {
    name: "Grid Zoom Strip",
    slug: "grid-zoom-strip",
    href: "/components/grid-zoom-strip",
    description: "Morphs an image gallery into an interactive horizontal strip reel.",
    category: "Scroll & Layout",
    badge: "Morph Transition",
    registry: "grid-zoom-strip",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["utils"],
    filePath: "components/ui/grid-zoom-strip.tsx",
    controls: gridZoomStripControls,
    presets: gridZoomStripPresets,
    props: gridZoomStripProps,
    codeExample: gridZoomStripCodeExample,
  },
  {
    name: "Focus Slider",
    slug: "focus-slider",
    href: "/components/focus-slider",
    description: "Spring carousel with center scaling and depth falloff.",
    category: "Scroll & Layout",
    badge: "Carousel",
    registry: "focus-slider",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["utils"],
    filePath: "components/ui/focus-slider.tsx",
    controls: focusSliderControls,
    presets: focusSliderPresets,
    props: focusSliderProps,
    codeExample: focusSliderCodeExample,
  },
  {
    name: "Mobbin Stats Reveal",
    slug: "mobbin-stats-reveal",
    href: "/components/mobbin-stats-reveal",
    description: "Scroll-driven metrics with kinetic counters and floating icons.",
    category: "Data Display",
    badge: "Scroll Reveal",
    registry: "mobbin-stats-reveal",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["utils"],
    filePath: "components/ui/mobbin-stats-reveal.tsx",
    controls: mobbinStatsRevealControls,
    presets: mobbinStatsRevealPresets,
    props: mobbinStatsRevealProps,
    codeExample: mobbinStatsRevealCodeExample,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY ACCESSORS & HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function activeComponent(pathname: string): ComponentItem | undefined {
  const cleanPath = pathname.replace(/\/$/, "")
  return components.find((c) => c.href === cleanPath || cleanPath.endsWith(c.slug))
}

export function getComponentBySlug(slug: string): ComponentItem | undefined {
  return components.find((c) => c.slug === slug)
}

export function getAllSlugs(): string[] {
  return components.map((c) => c.slug)
}

export function getCategories(): { category: string; components: ComponentItem[] }[] {
  const map = new Map<string, ComponentItem[]>()
  for (const comp of components) {
    if (!map.has(comp.category)) {
      map.set(comp.category, [])
    }
    map.get(comp.category)!.push(comp)
  }
  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    components: items,
  }))
}

export function installCommand(
  item: ComponentItem,
  pm: PackageManager = "npm"
): string {
  const baseRegistry = "fern-ui"
  const executor = PM_EXECUTORS[pm] ?? "npx"
  switch (pm) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${baseRegistry}/${item.registry}`
    case "bun":
      return `bunx --bun shadcn@latest add ${baseRegistry}/${item.registry}`
    case "yarn":
      return `yarn dlx shadcn@latest add ${baseRegistry}/${item.registry}`
    case "npm":
    default:
      return `npx shadcn@latest add ${baseRegistry}/${item.registry}`
  }
}
