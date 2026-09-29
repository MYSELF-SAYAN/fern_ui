"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
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
import {
  ScrollCardStack,
  defaultCardStackItems,
} from "@/components/ui/scroll-card-stack"
import { AnimatedRibbon } from "@/components/ui/animated-ribbon"
import { OrbitCardReel, defaultOrbitCards } from "@/components/ui/orbit-card-reel"

// ─────────────────────────────────────────────────────────────────────────────
// Shared Bento Card Shell — Double-Bezel Hardware Architecture
// ─────────────────────────────────────────────────────────────────────────────

interface BentoCardProps {
  id: string
  name: string
  badge: string
  description: string
  hint: string
  href: string
  className?: string
  children: React.ReactNode
  /** Height class override, defaults to h-[420px] sm:h-[460px] */
  heightClass?: string
}

function BentoCard({
  id,
  name,
  badge,
  description,
  hint,
  href,
  className,
  children,
  heightClass = "h-[420px] sm:h-[460px]",
}: BentoCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group/card relative rounded-3xl p-1 sm:p-1.5 transition-all duration-300",
        // Outer hardware shell
        "bg-neutral-200/60 dark:bg-white/[0.04] border border-neutral-300/60 dark:border-white/[0.08]",
        "hover:border-neutral-400/80 dark:hover:border-white/[0.16]",
        "shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]",
        "dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_16px_50px_rgba(0,0,0,0.5)]",
        heightClass,
        className
      )}
    >
      {/* Inner Machined Core */}
      <div className="relative w-full h-full rounded-[calc(1.5rem-2px)] sm:rounded-[calc(1.5rem-4px)] bg-[#fafafa] dark:bg-[#0c0c0e] overflow-hidden border border-black/[0.04] dark:border-white/[0.04] flex flex-col justify-between">
        {/* Top Header Bar — glassmorphic, non-blocking */}
        <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-2 pointer-events-none">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-neutral-200/80 dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300 font-medium backdrop-blur-md">
              {badge}
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              {name}
            </h3>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 dark:text-neutral-500 bg-black/[0.03] dark:bg-white/[0.03] px-2.5 py-1 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
            <span className="size-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
            <span className="hidden sm:inline">{hint}</span>
            <span className="sm:hidden">Interactive</span>
          </div>
        </div>

        {/* Interactive Canvas Area */}
        <div className="absolute inset-0 w-full h-full pt-14 pb-14 pointer-events-auto">
          {children}
        </div>

        {/* Bottom Bar — info & button-in-button CTA */}
        <div className="relative z-20 mt-auto flex items-center justify-between px-4 sm:px-6 pb-4 sm:pb-5 pt-2 pointer-events-none">
          <p className="text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 tracking-[-0.01em] max-w-[62%] sm:max-w-[70%] truncate font-normal">
            {description}
          </p>

          <Link
            href={href}
            className="group/btn inline-flex items-center gap-2 pl-3.5 pr-1.5 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-medium tracking-tight hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm active:scale-[0.98] pointer-events-auto cursor-pointer"
          >
            <span>Explore</span>
            <span className="size-5 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
              <ArrowUpRight className="size-3" />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ORBIT CARD REEL STAGE (Wispr Flow 3D Cylindrical Perspective)
// ─────────────────────────────────────────────────────────────────────────────

export function OrbitCardReelStage() {
  return (
    <BentoCard
      id="stage-orbit-card-reel"
      name="Orbit Card Reel"
      badge="3D Perspective"
      description="3D cylindrical perspective reel with dynamic axis tilt and smooth wheel scrubbing."
      hint="Scroll or drag to scrub"
      href="/components/orbit-card-reel"
      heightClass="h-[460px] sm:h-[500px]"
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <OrbitCardReel
          items={defaultOrbitCards}
          mode="interactive"
          maxRotation={44}
          perspective={1250}
          orbitRatio={0.65}
          cardScale={0.92}
          cardGap={42}
          wheelScrub={true}
          dragScrub={true}
          className="w-full h-full"
        />
      </div>
    </BentoCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ANIMATED RIBBON STAGE (Wispr Flow Hero Flowing Marquee)
// ─────────────────────────────────────────────────────────────────────────────

export function AnimatedRibbonStage() {
  return (
    <BentoCard
      id="stage-animated-ribbon"
      name="Animated Ribbon"
      badge="Hero Motion"
      description="Continuous bezier ribbon marquee with custom loop dynamics & capsule junction."
      hint="Theme-aware flowing path"
      href="/components/animated-ribbon"
      heightClass="h-[420px] sm:h-[460px]"
    >
      <div className="relative w-full h-full overflow-hidden">
        <AnimatedRibbon
          text="Fern UI is an open source collection of animated React components • Built with Tailwind CSS and Framer Motion • Copy, paste, and ship with zero configuration •"
          speed={38}
          fontSize={16}
          ribbonWidth={48}
          loopTextOpacity={0.65}
          zoom={1.22}
          panY={12}
          showCapsule={true}
          className="w-full h-full"
        />
      </div>
    </BentoCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SCROLL CARD STACK STAGE
// ─────────────────────────────────────────────────────────────────────────────

export function ScrollCardStackStage() {
  return (
    <BentoCard
      id="stage-scroll-card-stack"
      name="Scroll Card Stack"
      badge="Deck Stacking"
      description="Sticky card stacking with automatic geometric offsets and tactile spring physics."
      hint="Wheel or drag to stack"
      href="/components/scroll-card-stack"
      heightClass="h-[420px] sm:h-[460px]"
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-4">
        <ScrollCardStack
          items={defaultCardStackItems}
          scaleStep={0.035}
          borderRadius={22}
          springStiffness={100}
          springDamping={30}
          shadowIntensity={40}
          dimAmount={0.15}
          mode="interactive"
          wheelScrub={true}
          className="w-full h-full"
        />
      </div>
    </BentoCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FOCUS SLIDER STAGE
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
  return (
    <BentoCard
      id="stage-focus-slider"
      name="Focus Slider"
      badge="Kinetic Carousel"
      description="Center-prominence carousel with spring physics, side scaling, and depth blur."
      hint="Wheel or drag horizontally"
      href="/components/focus-slider"
      heightClass="h-[420px] sm:h-[460px]"
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <FocusSlider
          items={focusSliderItems}
          cardWidth={280}
          cardAspect="3:4"
          sideScale={0.88}
          gap={20}
          sideOpacity={0.7}
          speed={0.75}
          direction="horizontal"
          loop={true}
          draggable={true}
          mouseWheel={true}
          className="w-full h-full"
        />
      </div>
    </BentoCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ORBIT GLOBE STAGE
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
  return (
    <BentoCard
      id="stage-orbit-globe"
      name="Orbit Globe"
      badge="3D Sphere"
      description="Interactive 3D orbital carousel rotating cards in physical space with mouse drag."
      hint="Drag to spin 3D globe"
      href="/components/orbit-globe"
      heightClass="h-[420px] sm:h-[460px]"
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <OrbitGlobe
          items={orbitGlobeItems}
          globeSize={54}
          cardSize={25}
          tilt={24}
          direction="left"
          duration={22}
          draggable={true}
          pauseOnHover={true}
          zoomOnClick={false}
          className="w-full h-full"
        />
      </div>
    </BentoCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. GRID ZOOM STRIP STAGE
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
  return (
    <BentoCard
      id="stage-grid-zoom-strip"
      name="Grid Zoom Strip"
      badge="Morph Transition"
      description="Dynamic 3×3 image overview grid morphing into an interactive horizontal strip reel."
      hint="Wheel or drag to zoom & scrub"
      href="/components/grid-zoom-strip"
      heightClass="h-[420px] sm:h-[460px]"
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <GridZoomStrip
          items={gridZoomItems}
          zoom={2.0}
          gap={2.2}
          wheelScrub={true}
          draggable={true}
          className="w-full h-full"
        />
      </div>
    </BentoCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MOBBIN STATS REVEAL STAGE
// ─────────────────────────────────────────────────────────────────────────────

export function MobbinStatsRevealStage() {
  return (
    <BentoCard
      id="stage-mobbin-stats"
      name="Mobbin Stats Reveal"
      badge="Kinetic Numbers"
      description="Numerical metric count-up with floating app logo cloud and ambient Brownian drift."
      hint="Scroll & move cursor"
      href="/components/mobbin-stats-reveal"
      heightClass="h-[420px] sm:h-[460px]"
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <MobbinStatsReveal
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
          className="w-full h-full min-h-[380px]"
        />
      </div>
    </BentoCard>
  )
}
