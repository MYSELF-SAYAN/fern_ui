"use client"

import * as React from "react"
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  TYPES                                                                     */
/* ═══════════════════════════════════════════════════════════════════════════ */

export interface OrbitCardStat {
  value: string
  label: string
}

export interface OrbitCardItem {
  id: string | number
  type?: "landscape" | "square"
  bgColor?: string
  textColor?: string
  badge?: string
  company?: string
  authorName?: string
  authorRole?: string
  quote: string
  ctaText?: string
  ctaHref?: string
  image?: string
  stats?: OrbitCardStat[]
  customContent?: React.ReactNode
}

export interface OrbitCardReelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of card items to display along the 3D orbit reel */
  items?: OrbitCardItem[]
  /** Custom render function to display any custom card UI */
  renderCard?: (item: OrbitCardItem, index: number) => React.ReactNode
  /** Controlled progress (0 to 1) along the card reel */
  progress?: number
  /** Callback fired when progress changes */
  onProgressChange?: (progress: number) => void
  /** Operating mode: 'interactive' (wheel/drag/scrub) or 'scroll' (window sticky pin) */
  mode?: "interactive" | "scroll" | "auto"
  /** Maximum tilt angle in degrees when entering/exiting (default: 48) */
  maxRotation?: number
  /** 3D perspective distance in pixels (default: 1250) */
  perspective?: number
  /** Orbit radius ratio relative to card width (default: 0.65) */
  orbitRatio?: number
  /** Card scale multiplier (default: 1.0) */
  cardScale?: number
  /** Spacing gap between cards in pixels (default: 44) */
  cardGap?: number
  /** Enable mouse wheel / trackpad scrubbing in interactive mode (default: true) */
  wheelScrub?: boolean
  /** Enable mouse drag / touch swipe scrubbing (default: true) */
  dragScrub?: boolean
  /** Scroll height multiplier when in 'scroll' mode (e.g. 4 for 400vh track) */
  scrollMultiplier?: number
  /** Show or hide bottom progress indicator dots (default: false) */
  showIndicators?: boolean
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  DEFAULT WISPR FLOW CARDS DATA                                              */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const defaultOrbitCards: OrbitCardItem[] = [
  {
    id: "steven-bartlett",
    type: "landscape",
    bgColor: "#f0d7ff",
    textColor: "#1a1a1a",
    badge: "Steven Bartlett",
    authorName: "Steven Bartlett",
    authorRole: "Host of Diary of a CEO",
    quote:
      "“The thought I have becomes my explanation. The gap between my thought and my delivery of my idea collapses.”",
    ctaText: "Read case study",
    image:
      "https://cdn.prod.website-files.com/682f84b3838c89f8ff7667db/6a5e01987e841f9b100822bd_steven-2%20(1).webp",
    stats: [
      { value: "90%", label: "faster message output" },
      { value: "2h", label: "extra productive hours/day" },
    ],
  },
  {
    id: "slash-gear",
    type: "square",
    bgColor: "#ffffeb",
    textColor: "#1a1a1a",
    company: "Slash Gear",
    authorName: "Slash Gear",
    authorRole: "Tech Publication",
    quote:
      "“If you find it tiring to write long emails, or just need something quick to note down an idea in the heat of the moment — this app is a Godsend for you.”",
    image:
      "https://cdn.prod.website-files.com/682f84b3838c89f8ff7667db/6a5e020f4c51ec84140482ae_slash-gear.png",
  },
  {
    id: "alex-lieberman",
    type: "square",
    bgColor: "#ffa946",
    textColor: "#1a1a1a",
    authorName: "Alex Lieberman",
    authorRole: "Co-founder of Morning Brew",
    quote:
      "“Wispr Flow is a top 3 favorite AI tool for me. I literally do not use my fingers to type anymore.”",
    image:
      "https://cdn.prod.website-files.com/682f84b3838c89f8ff7667db/6a5e025ac9f2ccc48ff80c4d_alex%20(1).webp",
  },
  {
    id: "elena-verna",
    type: "landscape",
    bgColor: "#34d399",
    textColor: "#0f382c",
    authorName: "Elena Verna",
    authorRole: "Head of Growth at Lovable",
    quote:
      "“I feel like I have no time to type anymore. So I just talk to my phone and my laptop all the time.”",
    image:
      "https://cdn.prod.website-files.com/682f84b3838c89f8ff7667db/6a5e035b40a39dfa450ad68f_elena%20(1).webp",
  },
  {
    id: "fast-company",
    type: "square",
    bgColor: "#e4e4d0",
    textColor: "#1a1a1a",
    company: "Fast Company",
    authorName: "Fast Company",
    authorRole: "Design & Innovation",
    quote:
      "“Wispr Flow just gets it right. It is consistently so much better than the standard voice input, it'll blow your mind.”",
    image:
      "https://cdn.prod.website-files.com/682f84b3838c89f8ff7667db/6a5e03a6b1e09ec0bf117c6c_fast-compnay.png",
  },
  {
    id: "clay",
    type: "landscape",
    bgColor: "#ff6c4c",
    textColor: "#ffffff",
    company: "Clay",
    authorName: "Enterprise Team",
    authorRole: "GTM Intelligence",
    quote:
      "“Wispr Flow gives our team hours back every week. Speaking out loud captures the nuance and context that typing often loses.”",
    ctaText: "Read case study",
    image:
      "https://cdn.prod.website-files.com/682f84b3838c89f8ff7667db/6a5e0836e976d834eda5f253_clay-bg%20(1).webp",
    stats: [
      { value: "20%", label: "more customer calls/day" },
      { value: "$3.08m", label: "est. annual cost savings" },
    ],
  },
  {
    id: "dave-gilboa",
    type: "landscape",
    bgColor: "#ffbe53",
    textColor: "#1a1a1a",
    authorName: "Dave Gilboa",
    authorRole: "CEO of Warby Parker",
    quote:
      "“Wispr Flow's dictation has always felt like magic. With Notetaker, that magic has gone multiplayer with no extra setup and summaries that are actually useful.”",
    image:
      "https://cdn.prod.website-files.com/682f84b3838c89f8ff7667db/6a72c9e0c7cefd0c6d7c8d06_dave-gilboa.webp",
  },
]

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  CARD COMPONENT                                                            */
/* ═══════════════════════════════════════════════════════════════════════════ */

function ReelCard({
  item,
  index,
  width,
  height,
  renderCard,
}: {
  item: OrbitCardItem
  index: number
  width: number
  height: number
  renderCard?: (item: OrbitCardItem, index: number) => React.ReactNode
}) {
  if (renderCard) {
    return (
      <div style={{ width: `${width}px`, height: `${height}px` }} className="select-none">
        {renderCard(item, index)}
      </div>
    )
  }

  if (item.customContent) {
    return (
      <div style={{ width: `${width}px`, height: `${height}px` }} className="select-none">
        {item.customContent}
      </div>
    )
  }

  const isLandscape = item.type !== "square"

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: item.bgColor ?? "#f4f4f5",
        color: item.textColor ?? "#18181b",
      }}
      className={cn(
        "relative rounded-[40px] sm:rounded-[48px] p-5 sm:p-7 select-none overflow-hidden",
        "flex flex-col justify-between shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)]",
        "border border-black/[0.08] dark:border-white/[0.12] transition-colors"
      )}
    >
      {/* ── Landscape Layout (Split Quote & Media) ────────────────────── */}
      {isLandscape ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-full w-full">
          {/* Left Column: Author, Quote, CTA */}
          <div className="md:col-span-6 flex flex-col justify-between h-full z-10 pr-2">
            <div>
              {/* Author / Badge Tag */}
              <div className="flex items-center gap-2 mb-3">
                {item.company && (
                  <span className="text-[11px] font-bold tracking-wider uppercase opacity-85 font-mono">
                    {item.company}
                  </span>
                )}
                {item.authorRole && (
                  <span className="text-xs font-medium opacity-75">
                    {item.authorRole}
                  </span>
                )}
              </div>

              {/* Serif Quote */}
              <p
                className="font-serif text-[19px] sm:text-[22px] leading-[1.3] tracking-tight font-medium"
                style={{
                  fontFamily:
                    "'Editorial New', Georgia, 'Times New Roman', serif",
                }}
              >
                {item.quote}
              </p>
            </div>

            {/* Bottom Footer / Case study link */}
            <div className="pt-4 flex items-center justify-between">
              {item.ctaText ? (
                <div className="group/link inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer underline underline-offset-4 opacity-90 hover:opacity-100 transition-opacity">
                  <span>{item.ctaText}</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </div>
              ) : (
                item.authorName && (
                  <div>
                    <p className="text-sm font-bold tracking-tight">
                      {item.authorName}
                    </p>
                    {item.authorRole && (
                      <p className="text-[11px] opacity-70">{item.authorRole}</p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right Column: Image with overlay stat pills */}
          <div className="md:col-span-6 relative h-full w-full rounded-[28px] sm:rounded-[34px] overflow-hidden bg-black/10">
            {item.image && (
              <img
                src={item.image}
                alt={item.authorName ?? "Testimonial"}
                className="w-full h-full object-cover select-none pointer-events-none"
                loading="eager"
              />
            )}

            {/* Gradient Overlay for Stat Badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

            {/* Stat Badges Grid */}
            {item.stats && item.stats.length > 0 && (
              <div className="absolute bottom-3 inset-x-3 grid grid-cols-2 gap-2 z-10">
                {item.stats.map((st, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-[18px] bg-black/45 dark:bg-black/60 backdrop-blur-md border border-white/15 text-white shadow-lg flex flex-col justify-center"
                  >
                    <span className="text-lg sm:text-xl font-black tracking-tight leading-none text-white">
                      {st.value}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-zinc-300 font-medium leading-tight mt-1">
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── Square Layout (Full Hero Photo or Graphic Pill) ─────────── */
        <div className="relative h-full w-full flex flex-col justify-between">
          {/* Background Image if available */}
          {item.image && (
            <div className="absolute inset-0 rounded-[28px] sm:rounded-[34px] overflow-hidden">
              <img
                src={item.image}
                alt={item.authorName ?? "Portrait"}
                className={cn(
                  "w-full h-full select-none pointer-events-none",
                  item.image.endsWith(".png") || item.image.endsWith(".svg")
                    ? "object-contain p-8 opacity-90"
                    : "object-cover"
                )}
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            </div>
          )}

          {/* Floating Pill Card at Bottom */}
          <div className="relative z-10 mt-auto p-5 rounded-[26px] bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white shadow-xl">
            <p
              className="font-serif text-[17px] sm:text-[18px] leading-snug font-medium mb-3"
              style={{
                fontFamily:
                  "'Editorial New', Georgia, 'Times New Roman', serif",
              }}
            >
              {item.quote}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 dark:border-white/[0.08]">
              <div>
                <p className="text-xs font-bold leading-tight">
                  {item.authorName}
                </p>
                {item.authorRole && (
                  <p className="text-[10px] text-neutral-500 dark:text-zinc-400">
                    {item.authorRole}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  MAIN ORBIT CARD REEL COMPONENT                                            */
/* ═══════════════════════════════════════════════════════════════════════════ */

export function OrbitCardReel({
  items = defaultOrbitCards,
  renderCard,
  progress: controlledProgress,
  onProgressChange,
  mode = "interactive",
  maxRotation = 48,
  perspective = 1250,
  orbitRatio = 0.65,
  cardScale = 1.0,
  cardGap = 44,
  wheelScrub = true,
  dragScrub = true,
  scrollMultiplier = 4,
  showIndicators = false,
  className,
  ...rest
}: OrbitCardReelProps) {
  /* ── State & Refs ─────────────────────────────────────────────────── */
  const containerRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [internalProgress, setInternalProgress] = React.useState(0)
  const isDraggingRef = React.useRef(false)
  const dragStartXRef = React.useRef(0)
  const dragStartProgressRef = React.useRef(0)

  // Current active progress value (0 to 1)
  const currentProgress = controlledProgress ?? internalProgress

  /* ── Window scroll tracking (used when mode === 'scroll') ──────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Synchronize scroll progress when mode is 'scroll'
  React.useEffect(() => {
    if (mode === "scroll") {
      const unsub = scrollYProgress.on("change", (latest) => {
        setInternalProgress(latest)
        onProgressChange?.(latest)
      })
      return () => unsub()
    }
  }, [mode, scrollYProgress, onProgressChange])

  /* ── Smooth physics value with spring interpolation ────────────────── */
  const springProgress = useSpring(currentProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.6,
  })

  React.useEffect(() => {
    springProgress.set(currentProgress)
  }, [currentProgress, springProgress])

  /* ── Card Dimensions & Offsets Calculations ───────────────────────── */
  const baseLandscapeW = 500 * cardScale
  const baseSquareW = 390 * cardScale
  const baseH = 390 * cardScale

  // Compute horizontal layout offsets for each card
  const { cardOffsets, totalSpan, medianWidth } = React.useMemo(() => {
    const widths = items.map((item) =>
      item.type === "square" ? baseSquareW : baseLandscapeW
    )
    const offsets: number[] = [0]

    for (let i = 1; i < items.length; i++) {
      const pairW = (widths[i - 1] + widths[i]) / 2
      offsets.push(offsets[i - 1] + pairW + cardGap)
    }

    const total = offsets[offsets.length - 1] || 1
    const sortedW = [...widths].sort((a, b) => a - b)
    const medW = sortedW[Math.floor(sortedW.length / 2)] || 480

    return { cardOffsets: offsets, totalSpan: total, medianWidth: medW }
  }, [items, baseLandscapeW, baseSquareW, cardGap])

  /* ── Interactive Wheel / Trackpad Scrubbing ────────────────────────── */
  const handleWheel = React.useCallback(
    (e: React.WheelEvent) => {
      if (!wheelScrub || mode === "scroll") return

      // Use horizontal deltaX if swiping horizontally, otherwise deltaY
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(delta) < 2) return

      e.preventDefault()
      const step = delta / (totalSpan * 1.8)
      const nextProgress = Math.max(0, Math.min(1, currentProgress + step))

      setInternalProgress(nextProgress)
      onProgressChange?.(nextProgress)
    },
    [wheelScrub, mode, totalSpan, currentProgress, onProgressChange]
  )

  /* ── Pointer Drag Scrubbing ────────────────────────────────────────── */
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!dragScrub) return
    isDraggingRef.current = true
    dragStartXRef.current = e.clientX
    dragStartProgressRef.current = currentProgress
    ;(e.target as HTMLElement)?.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartXRef.current
    const step = -dx / (totalSpan * 0.9)
    const nextProgress = Math.max(0, Math.min(1, dragStartProgressRef.current + step))
    setInternalProgress(nextProgress)
    onProgressChange?.(nextProgress)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false
    try {
      ;(e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId)
    } catch {}
  }

  /* ── 3D Cylinder Orbit Parameters ──────────────────────────────────── */
  const orbitRadius = Math.max(220, medianWidth * orbitRatio)
  const rotSpan = medianWidth * 2.1
  const RAD = Math.PI / 180

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        height: mode === "scroll" ? `${scrollMultiplier * 100}vh` : "100%",
        touchAction: mode === "interactive" ? "none" : "pan-y",
      }}
      className={cn(
        "relative w-full overflow-hidden select-none bg-background text-foreground",
        dragScrub && "cursor-grab active:cursor-grabbing",
        className
      )}
      {...rest}
    >
      {/* ── Sticky Viewport Container ─────────────────────────────────── */}
      <div
        className={cn(
          "w-full h-full flex flex-col justify-center items-center relative overflow-hidden",
          mode === "scroll" && "sticky top-0 h-screen"
        )}
      >
        {/* Subtle Ambient Studio Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.9) 0%, transparent 70%)`,
          }}
        />

        {/* ── 3D Perspective Track ────────────────────────────────────── */}
        <div
          ref={trackRef}
          style={{ perspective: `${perspective}px` }}
          className="relative flex-1 w-full flex items-center justify-center overflow-visible"
        >
          {items.map((item, index) => {
            const cardW = item.type === "square" ? baseSquareW : baseLandscapeW
            const cardH = baseH
            const cardOffset = cardOffsets[index] || 0

            return (
              <CardOrbitWrapper
                key={item.id}
                item={item}
                index={index}
                renderCard={renderCard}
                cardOffset={cardOffset}
                totalSpan={totalSpan}
                springProgress={springProgress}
                orbitRadius={orbitRadius}
                rotSpan={rotSpan}
                perspective={perspective}
                maxRotation={maxRotation}
                cardW={cardW}
                cardH={cardH}
                RAD={RAD}
              />
            )
          })}
        </div>

        {/* ── Bottom Scrubber Progress Bar (optional) ─────────────────── */}
        {showIndicators && (
          <div className="relative z-30 pb-6 sm:pb-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-neutral-100/90 dark:bg-zinc-900/90 border border-neutral-200/80 dark:border-white/[0.1] backdrop-blur-md shadow-md">
              {items.map((card, i) => {
                const targetProgress = totalSpan > 0 ? cardOffsets[i] / totalSpan : 0
                const isActive = Math.abs(currentProgress - targetProgress) < 0.08

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      setInternalProgress(targetProgress)
                      onProgressChange?.(targetProgress)
                    }}
                    className={cn(
                      "relative size-2.5 rounded-full transition-all duration-300 cursor-pointer",
                      isActive
                        ? "w-7 bg-neutral-900 dark:bg-white"
                        : "bg-neutral-300 dark:bg-zinc-600 hover:bg-neutral-400 dark:hover:bg-zinc-400"
                    )}
                    title={card.authorName ?? `Card ${i + 1}`}
                    aria-label={`Jump to ${card.authorName ?? `card ${i + 1}`}`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  INDIVIDUAL ORBIT WRAPPER (CALCULATES 3D CYLINDRICAL TRANSFORM)             */
/* ═══════════════════════════════════════════════════════════════════════════ */

function CardOrbitWrapper({
  item,
  index,
  renderCard,
  cardOffset,
  totalSpan,
  springProgress,
  orbitRadius,
  rotSpan,
  perspective,
  maxRotation,
  cardW,
  cardH,
  RAD,
}: {
  item: OrbitCardItem
  index: number
  renderCard?: (item: OrbitCardItem, index: number) => React.ReactNode
  cardOffset: number
  totalSpan: number
  springProgress: any
  orbitRadius: number
  rotSpan: number
  perspective: number
  maxRotation: number
  cardW: number
  cardH: number
  RAD: number
}) {
  // Transform calculation based on spring scroll progress
  const transform = useTransform(springProgress, (p: number) => {
    const head = p * totalSpan
    const u = head - cardOffset // relative horizontal distance from center

    // Normalized progression within rotation boundary (-1 to +1)
    const norm = Math.max(-1, Math.min(1, u / rotSpan))

    // Smooth sinusoidal tilt rotation around X-axis
    // u < 0 (right / incoming) -> tilts backward (-maxRotation)
    // u === 0 (center) -> flat upright (0deg)
    // u > 0 (left / outgoing) -> tilts forward (+maxRotation)
    const rot = maxRotation * Math.sin(norm * (Math.PI / 2))

    // 3D cylindrical orbital depth calculation
    const depth = orbitRadius * (1 - Math.cos(rot * RAD))
    const scaleFactor = perspective / (perspective + depth)
    const screenX = u / scaleFactor

    return `translate3d(calc(-50% + ${screenX}px), -50%, ${-depth}px) rotateX(${rot}deg)`
  })

  // Dynamic zIndex so the card closest to center is always on top
  const zIndex = useTransform(springProgress, (p: number) => {
    const head = p * totalSpan
    const u = Math.abs(head - cardOffset)
    return Math.max(1, Math.round(100 - u * 0.1))
  })

  // Opacity falloff at distant screen edges
  const opacity = useTransform(springProgress, (p: number) => {
    const head = p * totalSpan
    const u = Math.abs(head - cardOffset)
    return Math.max(0.15, Math.min(1, 1 - (u - rotSpan * 1.1) / (rotSpan * 0.8)))
  })

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transformStyle: "preserve-3d",
        transformOrigin: `50% 50% -${orbitRadius}px`,
        backfaceVisibility: "hidden",
        willChange: "transform",
        transform,
        zIndex,
        opacity,
      }}
      className="absolute select-none pointer-events-auto"
    >
      <ReelCard
        item={item}
        index={index}
        renderCard={renderCard}
        width={cardW}
        height={cardH}
      />
    </motion.div>
  )
}

export default OrbitCardReel
