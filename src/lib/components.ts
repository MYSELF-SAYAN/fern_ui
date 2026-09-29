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
    name: "1. 3×3 Grid Layout",
    description: "Compact 3×3 overview grid layout.",
    values: {
      initialCols: 3,
      initialRows: 3,
      gap: 16,
      overlayFade: 0,
    },
  },
  {
    name: "2. Wide Spacing",
    description: "Generous card spacing for spacious layouts.",
    values: {
      focusIndex: 0,
      gap: 24,
      overlayFade: 75,
    },
  },
  {
    name: "3. High-Contrast Focus",
    description: "Deep backdrop dimming highlighting active cards.",
    values: {
      gap: 18,
      overlayFade: 85,
      springStiffness: 240,
      springDamping: 26,
    },
  },
  {
    name: "4. Scaled Spotlight",
    description: "Item scale enlargement with dimmed surroundings.",
    values: {
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
    defaultValue: 1.0,
    min: 0.6,
    max: 1.6,
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
    name: "1. 12-Icon Cloud",
    description: "Full floating app icon cloud with organic ambient drift.",
    values: {
      iconCount: 12,
      iconSpread: 1.0,
      randomMovement: true,
    },
  },
  {
    name: "2. Wide Dispersion",
    description: "Expanded icon spread creating broader canvas coverage.",
    values: {
      iconSpread: 1.2,
    },
  },
  {
    name: "3. Dense Focus",
    description: "Clustered icons with tight spread around central metrics.",
    values: {
      iconSpread: 0.85,
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
// 5. SCROLL CARD STACK
// ─────────────────────────────────────────────────────────────────────────────

const scrollCardStackControls: ControlsSchema = {
  scaleStep: {
    type: "number",
    label: "Scale Step",
    category: "Stacking",
    defaultValue: 0.04,
    min: 0,
    max: 0.12,
    step: 0.01,
    unit: "x",
  },
  dimAmount: {
    type: "number",
    label: "Dim Amount",
    category: "Stacking",
    defaultValue: 0.15,
    min: 0,
    max: 0.5,
    step: 0.05,
    unit: "x",
  },
  borderRadius: {
    type: "number",
    label: "Border Radius",
    category: "Appearance",
    defaultValue: 24,
    min: 0,
    max: 48,
    step: 4,
    unit: "px",
  },
  shadowIntensity: {
    type: "number",
    label: "Shadow Intensity",
    category: "Appearance",
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 10,
    unit: "%",
  },
  cardAspect: {
    type: "select",
    label: "Card Aspect",
    category: "Appearance",
    defaultValue: "16:9",
    options: ["16:9", "4:3", "3:2"],
  },
  springStiffness: {
    type: "number",
    label: "Spring Stiffness",
    category: "Physics",
    defaultValue: 100,
    min: 40,
    max: 300,
    step: 10,
  },
  springDamping: {
    type: "number",
    label: "Spring Damping",
    category: "Physics",
    defaultValue: 30,
    min: 10,
    max: 60,
    step: 2,
  },
  sensitivity: {
    type: "number",
    label: "Scroll Sensitivity",
    category: "Interaction",
    defaultValue: 1.0,
    min: 0.2,
    max: 2.5,
    step: 0.1,
    unit: "x",
  },
}

const scrollCardStackPresets: Preset[] = [
  {
    name: "Default Deck",
    description: "Classic stacked deck with automatic scroll-based offset and smooth spring physics.",
    values: {
      scaleStep: 0.02,
      dimAmount: 0.1,
      borderRadius: 24,
      shadowIntensity: 45,
      cardAspect: "16:9",
      springStiffness: 100,
      springDamping: 30,
    },
  },
  {
    name: "Pure Wipe",
    description: "In-position card transitions with minimal depth scale.",
    values: {
      scaleStep: 0,
      dimAmount: 0.05,
      borderRadius: 24,
      shadowIntensity: 40,
      cardAspect: "16:9",
      springStiffness: 110,
      springDamping: 30,
    },
  },
  {
    name: "Elevated Deck",
    description: "Higher elevation shadows with dynamic spring response.",
    values: {
      scaleStep: 0.025,
      dimAmount: 0.14,
      borderRadius: 24,
      shadowIntensity: 55,
      cardAspect: "16:9",
      springStiffness: 100,
      springDamping: 30,
    },
  },
  {
    name: "Compact Deck",
    description: "Tightly grouped cards with subtle scaling for compact layouts.",
    values: {
      scaleStep: 0.015,
      dimAmount: 0.08,
      borderRadius: 16,
      shadowIntensity: 35,
      cardAspect: "16:9",
      springStiffness: 120,
      springDamping: 32,
    },
  },
  {
    name: "Bouncy Springs",
    description: "Low damping and energetic spring physics for tactile, playful landing motion in position.",
    values: {
      springStiffness: 85,
      springDamping: 14,
      scaleStep: 0.02,
      shadowIntensity: 50,
      borderRadius: 24,
      dimAmount: 0.12,
    },
  },
  {
    name: "Minimal Flat",
    description: "Zero drop shadows with razor-sharp borders and in-position card settlement.",
    values: {
      shadowIntensity: 0,
      scaleStep: 0.015,
      dimAmount: 0.06,
      borderRadius: 12,
      cardAspect: "16:9",
      springStiffness: 130,
      springDamping: 34,
    },
  },
]

const scrollCardStackProps: ComponentProp[] = [
  { name: "items", type: "ScrollCardStackItem[]", description: "Array of card items with id, content, and optional bgColor.", required: true },
  { name: "scaleStep", type: "number", default: "0.04", description: "Scale reduction per card behind the top card." },
  { name: "borderRadius", type: "number", default: "24", description: "Border radius of cards in pixels." },
  { name: "springStiffness", type: "number", default: "100", description: "Spring stiffness for scroll-driven transitions." },
  { name: "springDamping", type: "number", default: "30", description: "Spring damping for scroll-driven transitions." },
  { name: "shadowIntensity", type: "number", default: "40", description: "Shadow intensity from 0 to 100." },
  { name: "dimAmount", type: "number", default: "0.15", description: "Opacity dimming per stacked card behind (0–0.5)." },
  { name: "cardAspect", type: "string", default: "'16:9'", description: "Card aspect ratio: '16:9', '4:3', '3:2', or 'auto'." },
  { name: "mode", type: "'scroll' | 'interactive'", default: "'interactive'", description: "Display mode: full page sticky or embedded scroll." },
  { name: "progress", type: "number", description: "Controlled scroll progress (0–1). Overrides internal scroll." },
]

const scrollCardStackCodeExample = `import { ScrollCardStack } from "@/components/ui/scroll-card-stack"

const items = [
  {
    id: "intro",
    bgColor: "#1a1a2e",
    content: (
      <div className="flex h-full w-full items-center justify-center p-12 text-white">
        <h2 className="text-4xl font-medium">First Card</h2>
      </div>
    ),
  },
  {
    id: "features",
    bgColor: "#0d1b2a",
    content: (
      <div className="flex h-full w-full items-center justify-center p-12 text-white">
        <h2 className="text-4xl font-medium">Second Card</h2>
      </div>
    ),
  },
]

export function Demo() {
  return (
    <ScrollCardStack
      items={items}
      scaleStep={0.03}
      mode="scroll"
    />
  )
}`

// ─────────────────────────────────────────────────────────────────────────────
// 7. ANIMATED RIBBON
// ─────────────────────────────────────────────────────────────────────────────

const animatedRibbonControls: ControlsSchema = {
  speed: {
    type: "number",
    label: "Flow Speed",
    category: "Animation",
    defaultValue: 40,
    min: 5,
    max: 120,
    step: 5,
    unit: "px/s",
  },
  paused: {
    type: "boolean",
    label: "Paused",
    category: "Animation",
    defaultValue: false,
  },
  direction: {
    type: "select",
    label: "Direction",
    category: "Animation",
    defaultValue: "ltr",
    options: ["ltr", "rtl"],
  },
  zoom: {
    type: "number",
    label: "Zoom Scale",
    category: "View",
    defaultValue: 1.3,
    min: 0.6,
    max: 2.5,
    step: 0.05,
    unit: "x",
  },
  panY: {
    type: "number",
    label: "Vertical Pan",
    category: "View",
    defaultValue: 0,
    min: -150,
    max: 150,
    step: 10,
    unit: "px",
  },
  fontSize: {
    type: "number",
    label: "Font Size",
    category: "Typography",
    defaultValue: 18,
    min: 12,
    max: 32,
    step: 1,
    unit: "px",
  },
  letterSpacing: {
    type: "number",
    label: "Letter Spacing",
    category: "Typography",
    defaultValue: 0.5,
    min: 0,
    max: 3,
    step: 0.25,
    unit: "px",
  },
  ribbonWidth: {
    type: "number",
    label: "Ribbon Width",
    category: "Appearance",
    defaultValue: 50,
    min: 28,
    max: 80,
    step: 2,
    unit: "px",
  },
  loopTextOpacity: {
    type: "number",
    label: "Loop Text Opacity",
    category: "Appearance",
    defaultValue: 0.65,
    min: 0.1,
    max: 1.0,
    step: 0.05,
    unit: "x",
  },
  loopX: {
    type: "number",
    label: "Loop X Position",
    category: "Curves",
    defaultValue: 22,
    min: 10,
    max: 42,
    step: 1,
    unit: "%",
  },
  loopY: {
    type: "number",
    label: "Loop Y Position",
    category: "Curves",
    defaultValue: 42,
    min: 20,
    max: 65,
    step: 1,
    unit: "%",
  },
  loopSize: {
    type: "number",
    label: "Loop Size",
    category: "Curves",
    defaultValue: 45,
    min: 15,
    max: 75,
    step: 5,
  },
  ribbonAngle: {
    type: "number",
    label: "Ribbon Angle",
    category: "Curves",
    defaultValue: 28,
    min: 0,
    max: 55,
    step: 2,
    unit: "°",
  },
  ribbonCurve: {
    type: "number",
    label: "Ribbon Curvature",
    category: "Curves",
    defaultValue: 0.4,
    min: 0,
    max: 1,
    step: 0.1,
  },
  capsuleAt: {
    type: "number",
    label: "Capsule Position",
    category: "Capsule",
    defaultValue: 0.62,
    min: 0.4,
    max: 0.8,
    step: 0.02,
  },
  showCapsule: {
    type: "boolean",
    label: "Show Capsule",
    category: "Capsule",
    defaultValue: true,
  },
  textRepeat: {
    type: "number",
    label: "Text Repeat",
    category: "Content",
    defaultValue: 5,
    min: 2,
    max: 8,
    step: 1,
  },
}

const animatedRibbonPresets: Preset[] = [
  {
    name: "Wispr Default",
    description: "Matches the wisprflow.ai hero style with warm tones and gentle flow.",
    values: {
      speed: 40,
      fontSize: 18,
      ribbonWidth: 50,
      zoom: 1.3,
      panY: 0,
      loopTextOpacity: 0.65,
      letterSpacing: 0.5,
      loopX: 22,
      loopY: 42,
      loopSize: 45,
      ribbonAngle: 28,
      ribbonCurve: 0.4,
      capsuleAt: 0.62,
      showCapsule: true,
      textRepeat: 5,
    },
  },
  {
    name: "Wide Sweep",
    description: "Large loop with steep ribbon angle for dramatic wide presentation.",
    values: {
      speed: 35,
      fontSize: 20,
      ribbonWidth: 56,
      zoom: 1.15,
      panY: 20,
      loopTextOpacity: 0.6,
      letterSpacing: 0.5,
      loopX: 18,
      loopY: 38,
      loopSize: 60,
      ribbonAngle: 42,
      ribbonCurve: 0.6,
      capsuleAt: 0.58,
      showCapsule: true,
      textRepeat: 5,
    },
  },
  {
    name: "Close-Up Focus",
    description: "Deep zoom into the capsule and loop text for maximum legibility.",
    values: {
      speed: 30,
      fontSize: 21,
      ribbonWidth: 58,
      zoom: 1.7,
      panY: -10,
      loopTextOpacity: 0.7,
      letterSpacing: 0.5,
      loopX: 24,
      loopY: 44,
      loopSize: 46,
      ribbonAngle: 24,
      ribbonCurve: 0.35,
      capsuleAt: 0.62,
      showCapsule: true,
      textRepeat: 5,
    },
  },
  {
    name: "Bold Statement",
    description: "Extra large type on a thick ribbon for impactful hero sections.",
    values: {
      speed: 25,
      fontSize: 24,
      ribbonWidth: 64,
      zoom: 1.45,
      panY: 0,
      loopTextOpacity: 0.75,
      letterSpacing: 1,
      loopX: 20,
      loopY: 40,
      loopSize: 50,
      ribbonAngle: 32,
      ribbonCurve: 0.5,
      capsuleAt: 0.60,
      showCapsule: true,
      textRepeat: 4,
    },
  },
]

const animatedRibbonProps: ComponentProp[] = [
  { name: "text", type: "string", description: "Text content that flows along the ribbon path." },
  { name: "speed", type: "number", default: "40", description: "Animation speed in pixels per second along the path." },
  { name: "ribbonWidth", type: "number", default: "50", description: "Thickness of the solid ribbon band in SVG units." },
  { name: "fontSize", type: "number", default: "18", description: "Font size of the flowing text." },
  { name: "zoom", type: "number", default: "1.3", description: "Zoom scale of the view (0.5–2.5). Higher values zoom in closer on the ribbon." },
  { name: "panY", type: "number", default: "0", description: "Vertical pan offset in SVG user units (-150 to 150)." },
  { name: "panX", type: "number", default: "0", description: "Horizontal pan offset in SVG user units (-400 to 400)." },
  { name: "loopTextOpacity", type: "number", default: "0.65", description: "Opacity of text on the loop section (0–1)." },
  { name: "ribbonColor", type: "string", description: "Ribbon band color. Defaults to var(--foreground)." },
  { name: "ribbonTextColor", type: "string", description: "Text color on the ribbon. Defaults to var(--background)." },
  { name: "loopTextColor", type: "string", description: "Text color on the loop. Defaults to var(--muted-foreground)." },
  { name: "loopX", type: "number", default: "22", description: "X-center of the spiral loop as % of width." },
  { name: "loopY", type: "number", default: "42", description: "Y-center of the spiral loop as % of height." },
  { name: "loopSize", type: "number", default: "45", description: "Size of the spiral loop (10–80)." },
  { name: "ribbonAngle", type: "number", default: "28", description: "Exit angle of the ribbon in degrees (0–60)." },
  { name: "ribbonCurve", type: "number", default: "0.4", description: "Curvature of the ribbon (0=straight, 1=very curved)." },
  { name: "capsuleAt", type: "number", default: "0.62", description: "Position of capsule along path (0–1)." },
  { name: "capsuleContent", type: "ReactNode", description: "Custom capsule content. Replaces the default waveform widget." },
  { name: "showCapsule", type: "boolean", default: "true", description: "Show or hide the capsule widget." },
  { name: "paused", type: "boolean", default: "false", description: "Pause the animation." },
  { name: "direction", type: "'ltr' | 'rtl'", default: "'ltr'", description: "Direction of text flow." },
  { name: "customPath", type: "string", description: "Full custom SVG path d attribute for complete curve control." },
]

const animatedRibbonCodeExample = `import { AnimatedRibbon, DefaultRibbonCapsule } from "@/components/ui/animated-ribbon"

export function Hero() {
  return (
    <div className="relative h-[600px]">
      <AnimatedRibbon
        text="Your streaming text content goes here..."
        speed={40}
        fontSize={18}
        ribbonWidth={50}
        zoom={1.3}
        loopX={22}
        loopY={42}
        loopSize={45}
        ribbonAngle={28}
        ribbonCurve={0.4}
        capsuleAt={0.62}
        showCapsule={true}
        capsuleContent={<DefaultRibbonCapsule />}
        className="w-full h-full"
      />
    </div>
  )
}`

// ─────────────────────────────────────────────────────────────────────────────
// 8. ORBIT CARD REEL (Wispr Flow "Early access, real results")
// ─────────────────────────────────────────────────────────────────────────────

const orbitCardReelControls: ControlsSchema = {
  maxRotation: {
    type: "number",
    label: "Max 3D Tilt",
    category: "3D Physics",
    defaultValue: 48,
    min: 20,
    max: 70,
    step: 2,
    unit: "°",
  },
  perspective: {
    type: "number",
    label: "Perspective Depth",
    category: "3D Physics",
    defaultValue: 1250,
    min: 600,
    max: 2400,
    step: 50,
    unit: "px",
  },
  orbitRatio: {
    type: "number",
    label: "Orbit Radius",
    category: "3D Physics",
    defaultValue: 0.65,
    min: 0.3,
    max: 1.2,
    step: 0.05,
    unit: "x",
  },
  cardScale: {
    type: "number",
    label: "Card Scale",
    category: "Layout",
    defaultValue: 1.0,
    min: 0.7,
    max: 1.3,
    step: 0.05,
    unit: "x",
  },
  cardGap: {
    type: "number",
    label: "Card Spacing",
    category: "Layout",
    defaultValue: 44,
    min: 16,
    max: 96,
    step: 4,
    unit: "px",
  },
  dragScrub: {
    type: "boolean",
    label: "Drag & Touch",
    category: "Interaction",
    defaultValue: true,
  },
  wheelScrub: {
    type: "boolean",
    label: "Wheel Scrub",
    category: "Interaction",
    defaultValue: true,
  },
}

const orbitCardReelPresets: Preset[] = [
  {
    name: "Default Orbit",
    description: "Balanced 3D cylindrical perspective with smooth spring physics.",
    values: {
      maxRotation: 48,
      perspective: 1250,
      orbitRatio: 0.65,
      cardScale: 1.0,
      cardGap: 44,
    },
  },
  {
    name: "Cinematic 3D",
    description: "Deep perspective and pronounced 60° tilt for high-impact visual presentations.",
    values: {
      maxRotation: 60,
      perspective: 950,
      orbitRatio: 0.8,
      cardScale: 1.05,
      cardGap: 52,
    },
  },
  {
    name: "Subtle Float",
    description: "Gentle 24° tilt with wide-angle perspective and subtle curvature.",
    values: {
      maxRotation: 24,
      perspective: 1800,
      orbitRatio: 0.5,
      cardScale: 0.95,
      cardGap: 36,
    },
  },
  {
    name: "Compact Reel",
    description: "Dense, scaled-down card tray optimized for high-volume content showcases.",
    values: {
      maxRotation: 40,
      perspective: 1100,
      orbitRatio: 0.6,
      cardScale: 0.85,
      cardGap: 28,
    },
  },
]

const orbitCardReelProps: ComponentProp[] = [
  { name: "items", type: "OrbitCardItem[]", description: "Array of card items to display along the 3D reel." },
  { name: "renderCard", type: "(item: OrbitCardItem, index: number) => React.ReactNode", description: "Optional custom renderer for displaying any arbitrary card layout or content." },
  { name: "progress", type: "number", default: "0", description: "Controlled progress value from 0 to 1 along the reel." },
  { name: "onProgressChange", type: "(progress: number) => void", description: "Callback triggered as the user scrolls or drags through the reel." },
  { name: "mode", type: "'interactive' | 'scroll' | 'auto'", default: "'interactive'", description: "Display mode: 'interactive' for smooth wheel/drag scrubbing, or 'scroll' for pinned full-page scroll." },
  { name: "maxRotation", type: "number", default: "48", description: "Maximum 3D tilt angle in degrees around the cylinder axis." },
  { name: "perspective", type: "number", default: "1250", description: "CSS 3D perspective distance in pixels." },
  { name: "orbitRatio", type: "number", default: "0.65", description: "Radius of the orbital cylinder relative to median card width." },
  { name: "cardScale", type: "number", default: "1.0", description: "Card scale factor (0.7 to 1.3)." },
  { name: "cardGap", type: "number", default: "44", description: "Spacing in pixels between adjacent cards." },
  { name: "wheelScrub", type: "boolean", default: "true", description: "Enable trackpad and mouse wheel scrubbing." },
  { name: "dragScrub", type: "boolean", default: "true", description: "Enable pointer dragging and touch swiping." },
  { name: "showIndicators", type: "boolean", default: "false", description: "Show or hide bottom progress indicator dots." },
]

const orbitCardReelCodeExample = `import { OrbitCardReel, defaultOrbitCards } from "@/components/ui/orbit-card-reel"

export function ShowcaseReel() {
  return (
    <section className="relative w-full h-[600px] bg-background overflow-hidden">
      <OrbitCardReel
        items={defaultOrbitCards}
        mode="interactive"
        maxRotation={48}
        perspective={1250}
        cardScale={1.0}
      />
    </section>
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
  {
    name: "Scroll Card Stack",
    slug: "scroll-card-stack",
    href: "/components/scroll-card-stack",
    description: "Scroll-driven card stacking with spring physics and progressive depth.",
    category: "Scroll & Layout",
    badge: "Card Stack",
    registry: "scroll-card-stack",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["utils"],
    filePath: "components/ui/scroll-card-stack.tsx",
    controls: scrollCardStackControls,
    presets: scrollCardStackPresets,
    props: scrollCardStackProps,
    codeExample: scrollCardStackCodeExample,
  },
  {
    name: "Animated Ribbon",
    slug: "animated-ribbon",
    href: "/components/animated-ribbon",
    description: "SVG text ribbon with curved loop path and flowing marquee animation.",
    category: "3D & Motion",
    badge: "Text Animation",
    registry: "animated-ribbon",
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: ["utils"],
    filePath: "components/ui/animated-ribbon.tsx",
    controls: animatedRibbonControls,
    presets: animatedRibbonPresets,
    props: animatedRibbonProps,
    codeExample: animatedRibbonCodeExample,
  },
  {
    name: "Orbit Card Reel",
    slug: "orbit-card-reel",
    href: "/components/orbit-card-reel",
    description: "3D cylindrical card reel with smooth scroll & drag physics, perspective depth, and customizable cards.",
    category: "Scroll & Layout",
    badge: "3D Scroll Reel",
    registry: "orbit-card-reel",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["utils"],
    filePath: "components/ui/orbit-card-reel.tsx",
    controls: orbitCardReelControls,
    presets: orbitCardReelPresets,
    props: orbitCardReelProps,
    codeExample: orbitCardReelCodeExample,
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
