"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Layers,
  Move3d,
  RotateCcw,
  Sparkles,
  Sliders,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  OrbitGlobe,
  OrbitGlobeImage,
  type OrbitGlobeItem,
} from "@/components/ui/orbit-globe"
import {
  FocusSlider,
  type FocusSliderItem,
} from "@/components/ui/focus-slider"
import {
  GridZoomStrip,
  type GridZoomStripItem,
} from "@/components/ui/grid-zoom-strip"
import {
  MobbinStatsReveal,
  defaultMobbinStats,
  defaultMobbinApps,
} from "@/components/ui/mobbin-stats-reveal"

// ─────────────────────────────────────────────────────────────────────────────
// Shared Stage Wrapper
// ─────────────────────────────────────────────────────────────────────────────

export interface StageContainerProps {
  id: string
  number: string
  title: string
  category: string
  hint: string
  href: string
  installSlug: string
  className?: string
  children: React.ReactNode
  controls?: React.ReactNode
}

export function StageContainer({
  id,
  number,
  title,
  category,
  hint,
  href,
  installSlug,
  className,
  children,
  controls,
}: StageContainerProps) {
  const [copied, setCopied] = React.useState(false)

  const copyInstall = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(`npx shadcn add fern-ui/${installSlug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      id={id}
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl border border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/50 dark:bg-white/[0.02] p-6 sm:p-8 transition-all duration-300 hover:border-neutral-300 dark:hover:border-white/[0.16] hover:bg-neutral-50/70 dark:hover:bg-white/[0.03] shadow-xs",
        className
      )}
    >
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-200/60 dark:border-white/[0.05]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold tracking-widest text-emerald-600 dark:text-emerald-400">
              {number}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-medium">
              {category}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block font-mono text-[10px] tracking-wide text-neutral-400 dark:text-neutral-500">
            {hint}
          </span>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
          >
            <span>Playground</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="relative flex flex-1 items-center justify-center py-6 select-none min-h-[340px] sm:min-h-[380px] overflow-hidden">
        {children}
      </div>

      {/* Stage Bottom Interactive Toolbar */}
      <div className="pt-5 border-t border-neutral-200/60 dark:border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {controls}
        </div>

        {/* Copy command pill */}
        <button
          type="button"
          onClick={copyInstall}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200/80 dark:border-white/[0.06] bg-neutral-100/70 dark:bg-white/[0.04] text-[11px] font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer w-full sm:w-auto justify-center"
          title={`Copy: npx shadcn add fern-ui/${installSlug}`}
        >
          <span>npx shadcn add {installSlug}</span>
          {copied ? (
            <Check className="size-3 text-emerald-500" />
          ) : (
            <Copy className="size-3 text-neutral-400" />
          )}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. FOCUS SLIDER STAGE
// ─────────────────────────────────────────────────────────────────────────────

const focusSliderItems: FocusSliderItem[] = [
  {
    id: 1,
    title: "north ave",
    subtitle: "STUDIO",
    color: "#545b41",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between p-4 bg-[#545b41] text-white select-none rounded-2xl">
        <div className="relative w-full h-full flex flex-col justify-between p-4 rounded-xl bg-[#e4e5dc] text-[#282d1c] shadow-sm overflow-hidden">
          <div className="relative w-[75%] aspect-[4/3] overflow-hidden rounded-md border-2 border-white shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=800&auto=format&fit=crop"
              alt="Meadow Flowers"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          <div className="mt-auto flex justify-end items-end pt-2">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#282d1c]">
              north ave
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Make things with love",
    subtitle: "CREATIVE",
    color: "#ebe8de",
    content: (
      <div className="relative flex h-full w-full flex-col items-center justify-center p-4 bg-[#ebe8de] text-[#292d1c] select-none text-center rounded-2xl">
        <div className="size-16 sm:size-20 rounded-full overflow-hidden shadow-sm mb-3 border-2 border-white shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
            alt="Studio Portrait"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        <p className="text-base sm:text-lg font-bold tracking-tight text-[#292d1c] leading-tight max-w-[150px]">
          Make things with love
        </p>
      </div>
    ),
  },
  {
    id: 3,
    title: "0316 AVE",
    subtitle: "GALLERY",
    color: "#463d36",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between p-4 bg-[#463d36] text-white select-none rounded-2xl">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest text-amber-200/80">EDITION 03</span>
          <span className="text-xs font-mono">2026</span>
        </div>
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md border border-white/20 my-auto">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop"
            alt="Art Gallery"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        <div className="flex justify-between items-end pt-2">
          <span className="text-lg font-black tracking-widest uppercase">Atelier</span>
          <span className="text-[10px] font-mono text-white/60">Paris</span>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Minimal Design",
    subtitle: "ARCH",
    color: "#2b3a42",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between p-4 bg-[#2b3a42] text-white select-none rounded-2xl">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest text-teal-300">SYSTEMS</span>
        </div>
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md border border-white/20 my-auto">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
            alt="Minimal Architecture"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        <p className="text-base font-bold tracking-tight">Kinetic Volume</p>
      </div>
    ),
  },
]

export function FocusSliderStage() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [visibleMode, setVisibleMode] = React.useState<1 | 2>(1)

  const n = focusSliderItems.length
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + n) % n)
  const goNext = () => setActiveIndex((prev) => (prev + 1) % n)

  return (
    <StageContainer
      id="stage-focus-slider"
      number="01"
      title="Focus Slider"
      category="Scroll & Layout"
      hint="Scroll over box or drag cards to browse"
      href="/components/focus-slider"
      installSlug="focus-slider"
      controls={
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-neutral-200 dark:border-white/[0.08] overflow-hidden">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous card"
              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="px-2 text-xs font-mono text-neutral-500 border-x border-neutral-200 dark:border-white/[0.08]">
              {activeIndex + 1}/{n}
            </span>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next card"
              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setVisibleMode(visibleMode === 1 ? 2 : 1)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-white/[0.08] text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            {visibleMode === 1 ? "1-Card Focus" : "Multi-Card"}
          </button>
        </div>
      }
    >
      <div className="relative w-full h-[340px] flex items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/30 dark:bg-zinc-950/40">
        <FocusSlider
          items={focusSliderItems}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          visibleSideCards={visibleMode}
          cardSize={visibleMode === 1 ? 72 : 52}
          zigzag={true}
          zigzagOffset={32}
          speed={0.65}
          bounce={0.25}
          className="w-full h-full"
        />

        {/* Subtle scroll cue badge */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-white/[0.08] text-[11px] font-mono text-neutral-600 dark:text-neutral-400 shadow-sm">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span>Scroll or drag cards</span>
        </div>
      </div>
    </StageContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ORBIT GLOBE STAGE
// ─────────────────────────────────────────────────────────────────────────────

const orbitGlobeItems: OrbitGlobeItem[] = [
  {
    id: 1,
    title: "12K Installs",
    subtitle: "Metrics",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-3 text-white rounded-xl">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[8px] font-semibold uppercase">
            Metrics
          </span>
          <span className="text-[9px] opacity-80">2026</span>
        </div>
        <div className="mt-auto">
          <p className="text-xl font-black tracking-tight leading-none">12K</p>
          <p className="text-[9px] font-medium text-purple-100 truncate mt-0.5">Installs</p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Architecture",
    subtitle: "Spatial",
    content: (
      <OrbitGlobeImage
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
        alt="Pavilion"
      />
    ),
  },
  {
    id: 3,
    title: "MADRID",
    subtitle: "Atelier",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-3 text-white rounded-xl">
        <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[8px] font-semibold uppercase w-fit">
          Spain
        </span>
        <div className="mt-auto">
          <p className="text-base font-black tracking-widest uppercase">Madrid</p>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Quantum",
    subtitle: "Hardware",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 p-3 text-white rounded-xl">
        <span className="text-[9px] font-mono text-cyan-200">128-Q</span>
        <p className="text-sm font-black leading-tight mt-auto">Quantum</p>
      </div>
    ),
  },
  {
    id: 5,
    title: "Typography",
    subtitle: "Print",
    content: (
      <OrbitGlobeImage
        src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop"
        alt="Typography"
      />
    ),
  },
  {
    id: 6,
    title: "3D Artwork",
    subtitle: "Generative",
    content: (
      <OrbitGlobeImage
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
        alt="Artwork"
      />
    ),
  },
]

export function OrbitGlobeStage() {
  const [direction, setDirection] = React.useState<"left" | "right">("left")
  const [tilt, setTilt] = React.useState(24)

  return (
    <StageContainer
      id="stage-orbit-globe"
      number="02"
      title="Orbit Globe"
      category="3D & Motion"
      hint="Click and drag to rotate in 3D"
      href="/components/orbit-globe"
      installSlug="orbit-globe"
      controls={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDirection(direction === "left" ? "right" : "left")}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-white/[0.08] text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Orbit: {direction === "left" ? "Left ↺" : "Right ↻"}
          </button>
          <button
            type="button"
            onClick={() => setTilt(tilt === 24 ? 45 : 24)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-white/[0.08] text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Tilt: {tilt}°
          </button>
        </div>
      }
    >
      <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
        <OrbitGlobe
          items={orbitGlobeItems}
          globeSize={56}
          cardSize={26}
          tilt={tilt}
          direction={direction}
          duration={22}
          draggable={true}
          pauseOnHover={true}
          zoomOnClick={false}
          className="w-full h-full"
        />
      </div>
    </StageContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GRID ZOOM STRIP STAGE
// ─────────────────────────────────────────────────────────────────────────────

const gridZoomItems: GridZoomStripItem[] = [
  {
    id: 1,
    title: "Pavilion",
    subtitle: "Architecture",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "12K Global",
    subtitle: "Milestone",
    content: (
      <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-3 text-white rounded-xl">
        <span className="text-[9px] font-mono opacity-80 uppercase">Metrics</span>
        <p className="text-xl font-black">12.4K</p>
      </div>
    ),
  },
  {
    id: 3,
    title: "Luminescence",
    subtitle: "Generative",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Madrid",
    subtitle: "Atelier",
    content: (
      <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-3 text-white rounded-xl">
        <span className="text-[9px] font-mono opacity-80 uppercase">Spain</span>
        <p className="text-lg font-black uppercase">Madrid</p>
      </div>
    ),
  },
  {
    id: 5,
    title: "Quantum",
    subtitle: "Superconducting",
    content: (
      <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 p-3 text-white rounded-xl">
        <span className="text-[9px] font-mono opacity-80">128-Q</span>
        <p className="text-base font-black">Quantum</p>
      </div>
    ),
  },
  {
    id: 6,
    title: "Typographic",
    subtitle: "Swiss Grid",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Hypercar",
    subtitle: "Aero",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Biohazard",
    subtitle: "Interface",
    content: (
      <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-neutral-900 to-neutral-950 border border-emerald-500/20 p-3 text-white rounded-xl">
        <span className="text-[9px] font-mono text-emerald-400">STATUS OK</span>
        <p className="text-sm font-semibold text-neutral-200">Terminal</p>
      </div>
    ),
  },
  {
    id: 9,
    title: "Cosmos",
    subtitle: "Orbital",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop",
  },
]

export function GridZoomStripStage() {
  const [progress, setProgress] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const maxScroll = scrollHeight - clientHeight
    if (maxScroll > 0) {
      setProgress(Math.min(1, Math.max(0, scrollTop / maxScroll)))
    }
  }

  const scrollToProgress = (p: number) => {
    if (!containerRef.current) return
    const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight
    containerRef.current.scrollTo({ top: p * maxScroll, behavior: "smooth" })
    setProgress(p)
  }

  const handleSliderChange = (newVal: number) => {
    setProgress(newVal)
    if (containerRef.current) {
      const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight
      containerRef.current.scrollTop = newVal * maxScroll
    }
  }

  return (
    <StageContainer
      id="stage-grid-zoom-strip"
      number="03"
      title="Grid Zoom Strip"
      category="Scroll & Layout"
      hint="Scroll inside the box to morph 3×3 grid to horizontal reel"
      href="/components/grid-zoom-strip"
      installSlug="grid-zoom-strip"
      controls={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToProgress(0)}
            className={cn(
              "px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer",
              progress < 0.05
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium"
                : "border-neutral-200 dark:border-white/[0.08] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            Grid (0%)
          </button>
          <button
            type="button"
            onClick={() => scrollToProgress(1)}
            className={cn(
              "px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer",
              progress > 0.95
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium"
                : "border-neutral-200 dark:border-white/[0.08] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            Reel (100%)
          </button>
          <div className="flex items-center gap-1.5 ml-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={progress}
              onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
              className="w-20 sm:w-28 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              aria-label="Grid zoom progress slider"
            />
            <span className="font-mono text-[10px] text-neutral-400 w-8">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>
      }
    >
      <div className="relative w-full">
        {/* Scrollable Container with native scrollbar and overscroll containment */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          tabIndex={0}
          role="region"
          aria-label="Scrollable Grid Zoom Strip preview"
          className="relative w-full h-[360px] overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-neutral-950 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.4)_transparent]"
        >
          {/* Virtual scroll track for rich scrub depth */}
          <div className="h-[1200px] relative w-full">
            {/* Sticky presentation viewport locked at top of inner box */}
            <div className="sticky top-0 h-[360px] w-full flex items-center justify-center overflow-hidden">
              <GridZoomStrip
                items={gridZoomItems}
                mode="interactive"
                progress={progress}
                zoom={2.0}
                gap={2.5}
                padding={5.0}
                wheelScrub={false}
                draggable={true}
                className="w-full h-full"
              />

              {/* Progress bar line along top border of inner box */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-neutral-200/50 dark:bg-white/[0.06]">
                <div
                  className="h-full bg-emerald-500 transition-all duration-75"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>

              {/* Floating scroll indicator badge inside the box */}
              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-white/[0.1] text-[11px] font-mono text-neutral-600 dark:text-neutral-300 shadow-md">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Scroll inside box ({Math.round(progress * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StageContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MOBBIN STATS REVEAL STAGE
// ─────────────────────────────────────────────────────────────────────────────

export function MobbinStatsRevealStage() {
  const [progress, setProgress] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const maxScroll = scrollHeight - clientHeight
    if (maxScroll > 0) {
      setProgress(Math.min(1, Math.max(0, scrollTop / maxScroll)))
    }
  }

  const scrollToProgress = (p: number) => {
    if (!containerRef.current) return
    const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight
    containerRef.current.scrollTo({ top: p * maxScroll, behavior: "smooth" })
    setProgress(p)
  }

  const handleSliderChange = (newVal: number) => {
    setProgress(newVal)
    if (containerRef.current) {
      const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight
      containerRef.current.scrollTop = newVal * maxScroll
    }
  }

  return (
    <StageContainer
      id="stage-mobbin-stats"
      number="04"
      title="Mobbin Stats Reveal"
      category="Scroll & Data"
      hint="Scroll inside the box to reveal kinetic metrics"
      href="/components/mobbin-stats-reveal"
      installSlug="mobbin-stats-reveal"
      controls={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToProgress(0)}
            className={cn(
              "px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer",
              progress < 0.05
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium"
                : "border-neutral-200 dark:border-white/[0.08] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            Float (0%)
          </button>
          <button
            type="button"
            onClick={() => scrollToProgress(1)}
            className={cn(
              "px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer",
              progress > 0.95
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium"
                : "border-neutral-200 dark:border-white/[0.08] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            Reveal (100%)
          </button>
          <div className="flex items-center gap-1.5 ml-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={progress}
              onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
              className="w-20 sm:w-28 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              aria-label="Stats reveal progress slider"
            />
            <span className="font-mono text-[10px] text-neutral-400 w-8">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>
      }
    >
      <div className="relative w-full">
        {/* Scrollable Container with native scrollbar and overscroll containment */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          tabIndex={0}
          role="region"
          aria-label="Scrollable Mobbin Stats Reveal preview"
          className="relative w-full h-[360px] overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-[#f7f7f8] dark:bg-[#0c0c0e] focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.4)_transparent]"
        >
          {/* Virtual scroll track for rich scrub depth */}
          <div className="h-[1300px] relative w-full">
            {/* Sticky presentation viewport locked at top of inner box */}
            <div className="sticky top-0 h-[360px] w-full flex items-center justify-center overflow-hidden">
              <MobbinStatsReveal
                progress={progress}
                title="A growing library of"
                stats={defaultMobbinStats}
                apps={defaultMobbinApps.slice(0, 10)}
                iconSize={48}
                iconSpread={1.05}
                randomMovement={true}
                floatAnimation={true}
                mouseParallax={true}
                wheelScrub={false}
                draggable={false}
                className="w-full h-full min-h-[360px]"
              />

              {/* Progress bar line along top border of inner box */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-neutral-200/50 dark:bg-white/[0.06]">
                <div
                  className="h-full bg-emerald-500 transition-all duration-75"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>

              {/* Floating scroll indicator badge inside the box */}
              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-white/[0.1] text-[11px] font-mono text-neutral-600 dark:text-neutral-300 shadow-md">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Scroll inside box to reveal stats ({Math.round(progress * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StageContainer>
  )
}
