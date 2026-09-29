"use client"

import * as React from "react"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScrollCardStackItem {
  /** Unique identifier */
  id: string | number
  /** Card content — any React node */
  content: React.ReactNode
  /** Optional background color for the card */
  bgColor?: string
}

export interface ScrollCardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of cards to stack */
  items: ScrollCardStackItem[]
  /** Vertical offset between stacked cards in px (default: 28) */
  stackOffset?: number
  /** Scale reduction per stacked card behind (default: 0.04) */
  scaleStep?: number
  /** Border radius of cards in px (default: 24) */
  borderRadius?: number
  /** Spring stiffness for smooth transitions (default: 100) */
  springStiffness?: number
  /** Spring damping (default: 30) */
  springDamping?: number
  /** Shadow intensity 0–100 (default: 40) */
  shadowIntensity?: number
  /** Card aspect ratio: "16:9" | "4:3" | "3:2" | "auto" (default: "16:9") */
  cardAspect?: "16:9" | "4:3" | "3:2" | "auto"
  /** Controlled scroll progress 0–1, if provided overrides scroll-based progress */
  progress?: number
  /** Callback when scroll progress changes */
  onProgressChange?: (progress: number) => void
  /** Display mode: "scroll" (full page sticky) or "interactive" (embedded with internal scroll) */
  mode?: "scroll" | "interactive"
  /** Enable wheel scrubbing in interactive mode (default: true) */
  wheelScrub?: boolean
  /** Opacity dimming of background cards 0–1 (default: 0.15) */
  dimAmount?: number
  /** Position of progress indicator: "top" | "bottom" | "hidden" (default: "top") */
  indicatorPosition?: "top" | "bottom" | "hidden"
  /** Scroll & drag scrubbing sensitivity multiplier (default: 1.0) */
  sensitivity?: number
}

// ─── Aspect Ratio Helper ─────────────────────────────────────────────────────

function getAspectPadding(aspect: string): string {
  switch (aspect) {
    case "16:9": return "56.25%"
    case "4:3": return "75%"
    case "3:2": return "66.67%"
    default: return "56.25%"
  }
}

// ─── Single Card (scroll-driven) ─────────────────────────────────────────────

interface StackCardProps {
  item: ScrollCardStackItem
  index: number
  total: number
  scrollYProgress: MotionValue<number>
  stackOffset: number
  scaleStep: number
  borderRadius: number
  shadowIntensity: number
  dimAmount: number
  cardAspect: string
}

function StackCard({
  item,
  index,
  total,
  scrollYProgress,
  stackOffset,
  scaleStep,
  borderRadius,
  shadowIntensity,
  dimAmount,
}: StackCardProps) {
  const numTransitions = Math.max(1, total - 1)

  // Card 0 is the starting base card (already settled at start).
  // For each card k (1 to total - 1):
  //   - Entry travel starts at: segStart = (k - 1) / numTransitions
  //   - Entry travel settles at: segSettle = (k - 1 + 0.8) / numTransitions
  //   - Settled rest pause: segSettle to k / numTransitions
  //   - The NEXT card does NOT start moving until the rest pause is done!
  const entryStart = index === 0 ? 0 : (index - 1) / numTransitions
  const entrySettle = index === 0 ? 0 : (index - 1 + 0.8) / numTransitions

  // Target settled Y position for this card in the stack.
  // Each card settles at its target position (index * stackOffset) and STAYS STUCK THERE permanently.
  // Previous cards are NEVER uplifted upwards!
  const targetY = index * stackOffset

  // Card Y position:
  // Starts 650px below (offscreen), slides smoothly up to targetY when settling.
  // Once settled (p >= entrySettle), it stays firmly pinned at targetY.
  const cardY = useTransform(scrollYProgress, (p) => {
    if (index === 0) return targetY
    if (p < entryStart) return 650
    if (p >= entrySettle) return targetY
    const t = (p - entryStart) / (entrySettle - entryStart)
    // Smooth cubic ease out
    const ease = 1 - Math.pow(1 - t, 2.5)
    return targetY + (650 - targetY) * (1 - ease)
  })

  // Continuous factor for how many subsequent cards have settled on top of this card:
  const cardsOnTop = useTransform(scrollYProgress, (p) => {
    let count = 0
    for (let k = index + 1; k < total; k++) {
      const segStart = (k - 1) / numTransitions
      const segSettle = (k - 1 + 0.8) / numTransitions
      if (p <= segStart) continue
      if (p >= segSettle) {
        count += 1
      } else {
        const t = (p - segStart) / (segSettle - segStart)
        const ease = 1 - Math.pow(1 - t, 2.5)
        count += ease
      }
    }
    return count
  })

  // 4. Scale: card stays scale 1.0 until subsequent cards stack on top of it
  const scale = useTransform(cardsOnTop, (count) => Math.max(0.78, 1 - scaleStep * count))

  // 5. Opacity:
  // Pre-entry: 0 (completely invisible)
  // During entry: fades in quickly in the first 40% of travel
  // Post-settle: dims slightly as more cards stack on top
  const opacity = useTransform(scrollYProgress, (p) => {
    if (index === 0) {
      let count = 0
      for (let k = 1; k < total; k++) {
        const segStart = (k - 1) / numTransitions
        const segSettle = (k - 1 + 0.8) / numTransitions
        if (p >= segSettle) count += 1
        else if (p > segStart) count += (p - segStart) / (segSettle - segStart)
      }
      return Math.max(0.35, 1 - dimAmount * count)
    }

    if (p < entryStart) return 0
    if (p < entrySettle) {
      const t = (p - entryStart) / (entrySettle - entryStart)
      return Math.min(1, t * 2.5)
    }

    // Settled or stacked under future cards:
    let count = 0
    for (let k = index + 1; k < total; k++) {
      const segStart = (k - 1) / numTransitions
      const segSettle = (k - 1 + 0.8) / numTransitions
      if (p >= segSettle) count += 1
      else if (p > segStart) count += (p - segStart) / (segSettle - segStart)
    }
    return Math.max(0.35, 1 - dimAmount * count)
  })

  // 6. Visibility: hidden before entryStart so no subpixel border/shadow ever leaks
  const visibility = useTransform(scrollYProgress, (p) => {
    if (index === 0) return "visible"
    return p >= entryStart ? "visible" : "hidden"
  })

  // 7. Shadow: elevated while entering or at top of stack
  const boxShadow = useTransform(scrollYProgress, (p) => {
    const isTopCard =
      index === 0
        ? p < (0.8 / numTransitions)
        : p >= entryStart && (index === total - 1 || p < (index / numTransitions))

    const intensity = shadowIntensity / 100
    if (isTopCard) {
      return `0 24px 48px rgba(0, 0, 0, ${0.22 * intensity}), 0 8px 16px rgba(0, 0, 0, ${0.1 * intensity})`
    }
    return `0 4px 16px rgba(0, 0, 0, ${0.08 * intensity})`
  })

  return (
    <motion.div
      className="absolute inset-0 w-full h-full origin-top will-change-transform"
      style={{
        y: cardY,
        scale,
        opacity,
        visibility,
        boxShadow,
        zIndex: index + 1,
        borderRadius,
      }}
    >
      <div
        className="relative w-full h-full overflow-hidden border border-white/[0.08] dark:border-white/[0.08]"
        style={{
          borderRadius,
          backgroundColor: item.bgColor || undefined,
        }}
      >
        {item.content}
      </div>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ScrollCardStack({
  items,
  stackOffset,
  scaleStep = 0.04,
  borderRadius = 24,
  springStiffness = 100,
  springDamping = 30,
  shadowIntensity = 40,
  cardAspect = "16:9",
  progress: controlledProgress,
  onProgressChange,
  mode = "interactive",
  wheelScrub = true,
  dimAmount = 0.15,
  indicatorPosition = "top",
  sensitivity = 1,
  className,
  ...rest
}: ScrollCardStackProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const total = items.length
  const isControlled = controlledProgress !== undefined

  // Automatic scroll stack offset calculated from card aspect geometry if not explicitly passed
  const effectiveOffset = stackOffset ?? (cardAspect === "4:3" ? 32 : cardAspect === "3:2" ? 30 : 28)

  // ── Scroll mode: uses page scroll with sticky container ──────────────
  const { scrollYProgress: pageScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Smooth page scroll progress with spring
  const smoothPageProgress = useSpring(pageScrollProgress, {
    stiffness: springStiffness,
    damping: springDamping,
  })

  // ── Interactive mode: internal progress state ────────────────────────
  const [internalProgress, setInternalProgress] = React.useState(controlledProgress ?? 0)

  // Keep internal progress in sync if controlled progress updates externally (e.g. sidebar slider)
  React.useEffect(() => {
    if (controlledProgress !== undefined) {
      setInternalProgress(controlledProgress)
    }
  }, [controlledProgress])

  const setProgress = React.useCallback(
    (newProgress: number) => {
      const clamped = Math.max(0, Math.min(1, newProgress))
      setInternalProgress(clamped)
      onProgressChange?.(clamped)
    },
    [onProgressChange]
  )

  const activeProgress = isControlled ? (controlledProgress ?? 0) : internalProgress

  // Motion value driving the cards, smoothed with a spring
  const rawProgress = useMotionValue(activeProgress)
  const smoothedProgress = useSpring(rawProgress, {
    stiffness: springStiffness * 1.5,
    damping: springDamping * 1.2,
  })

  // Update raw motion value when progress changes
  React.useEffect(() => {
    rawProgress.set(activeProgress)
  }, [activeProgress, rawProgress])

  // Non-passive wheel listener on container to intercept mouse wheel & trackpad
  React.useEffect(() => {
    const el = containerRef.current
    if (!el || mode !== "interactive" || !wheelScrub) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      // Calibrated gentle wheel step for deliberate, controllable scrubbing
      // Standard wheel click is ~100px delta. Trackpad delivers continuous 2-15px deltas.
      const stepFactor = 0.00032 * sensitivity
      const maxBurst = 0.035 * sensitivity
      const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * stepFactor, maxBurst)
      const current = isControlled ? (controlledProgress ?? 0) : internalProgress
      const next = Math.max(0, Math.min(1, current + delta))
      setProgress(next)
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel)
    }
  }, [mode, wheelScrub, isControlled, controlledProgress, internalProgress, setProgress, sensitivity])

  // Pointer drag scrubbing (click & drag vertically anywhere on the deck)
  const isDraggingRef = React.useRef(false)
  const dragStartYRef = React.useRef(0)
  const dragStartProgressRef = React.useRef(0)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== "interactive") return
    if ((e.target as HTMLElement).closest("button, a, input")) return
    isDraggingRef.current = true
    dragStartYRef.current = e.clientY
    dragStartProgressRef.current = isControlled ? (controlledProgress ?? 0) : internalProgress
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    } catch {}
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    const deltaY = dragStartYRef.current - e.clientY
    // 100px drag advances ~9-10% of progress, offering fine tactile control
    const deltaProgress = deltaY * 0.00095 * sensitivity
    const next = Math.max(0, Math.min(1, dragStartProgressRef.current + deltaProgress))
    setProgress(next)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
    } catch {}
  }

  // Touch scrubbing for mobile devices
  const touchStartY = React.useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (mode !== "interactive") return
    const currentY = e.touches[0].clientY
    const delta = (touchStartY.current - currentY) * 0.001 * sensitivity
    touchStartY.current = currentY
    const current = isControlled ? (controlledProgress ?? 0) : internalProgress
    setProgress(current + delta)
  }

  // Report progress changes in scroll mode
  useMotionValueEvent(pageScrollProgress, "change", (v) => {
    if (mode === "scroll") {
      onProgressChange?.(v)
    }
  })

  const scrollProgress = mode === "scroll" ? smoothPageProgress : smoothedProgress
  const currentProgress = activeProgress

  // Calculate which card is currently in focus (1-indexed)
  const numTransitions = Math.max(1, total - 1)
  let currentCardNumber = 1
  for (let k = 1; k < total; k++) {
    const segStart = (k - 1) / numTransitions
    if (currentProgress >= segStart + 0.4 / numTransitions) {
      currentCardNumber = k + 1
    }
  }

  // ── Scroll mode ──────────────────────────────────────────────────────
  if (mode === "scroll") {
    // Each card gets ~100vh of scroll room
    const scrollHeight = `${(total + 1) * 100}vh`

    return (
      <div
        ref={containerRef}
        className={cn("relative", className)}
        style={{ height: scrollHeight }}
        {...rest}
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-8">
          <div
            className="relative w-full max-w-5xl mx-auto"
            style={{
              paddingBottom: cardAspect === "auto" ? undefined : getAspectPadding(cardAspect),
            }}
          >
            {items.map((item, i) => (
              <StackCard
                key={item.id}
                item={item}
                index={i}
                total={total}
                scrollYProgress={scrollProgress}
                stackOffset={effectiveOffset}
                scaleStep={scaleStep}
                borderRadius={borderRadius}
                shadowIntensity={shadowIntensity}
                dimAmount={dimAmount}
                cardAspect={cardAspect}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Interactive mode (embedded) ──────────────────────────────────────
  const aspectClass =
    cardAspect === "4:3"
      ? "aspect-[4/3]"
      : cardAspect === "3:2"
      ? "aspect-[3/2]"
      : "aspect-[16/9]"

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      tabIndex={0}
      role="region"
      aria-label="Scroll card stack — scroll or drag vertically to stack cards"
      className={cn(
        "relative w-full h-full overflow-hidden select-none cursor-ns-resize focus:outline-none",
        className
      )}
      {...rest}
    >
      {/* Visual Card Stack presentation */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4 sm:p-8 pointer-events-none">
        <div
          className={cn(
            "relative w-full max-w-2xl max-h-[88%] mx-auto pointer-events-auto",
            aspectClass
          )}
        >
          {items.map((item, i) => (
            <StackCard
              key={item.id}
              item={item}
              index={i}
              total={total}
              scrollYProgress={scrollProgress}
              stackOffset={effectiveOffset}
              scaleStep={scaleStep}
              borderRadius={borderRadius}
              shadowIntensity={shadowIntensity}
              dimAmount={dimAmount}
              cardAspect={cardAspect}
            />
          ))}
        </div>
      </div>

      {/* Floating progress indicator */}
      {indicatorPosition !== "hidden" && (
        <div
          className={cn(
            "pointer-events-none absolute z-20",
            indicatorPosition === "bottom"
              ? "bottom-3 left-1/2 -translate-x-1/2"
              : "top-4 left-1/2 -translate-x-1/2"
          )}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/85 dark:bg-neutral-900/90 backdrop-blur-xl border border-white/[0.1] text-[11px] font-mono text-neutral-300 shadow-xl">
            <span className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>Card {currentCardNumber}/{total}</span>
            <span className="text-neutral-600">·</span>
            <span>{Math.round(currentProgress * 100)}%</span>
          </div>
        </div>
      )}

      {/* Hairline progress bar along bottom edge */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-200/30 dark:bg-white/[0.04] z-20">
        <div
          className="h-full bg-indigo-500/80 transition-all duration-75"
          style={{ width: `${Math.round(currentProgress * 100)}%` }}
        />
      </div>
    </div>
  )
}

// ─── Default Demo Items ──────────────────────────────────────────────────────

export const defaultCardStackItems: ScrollCardStackItem[] = [
  {
    id: "card-1",
    bgColor: "#1a1a2e",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between p-8 sm:p-12 text-white select-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/10" />
        <div className="relative z-10">
          <span className="text-[11px] font-mono tracking-widest uppercase text-indigo-300/80">01 / Design</span>
        </div>
        <div className="relative z-10 mt-auto space-y-3">
          <h3 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.1]">
            Craft with
            <br />
            <span className="font-serif italic text-indigo-300">intention.</span>
          </h3>
          <p className="text-sm text-white/50 max-w-md leading-relaxed">
            Every pixel serves a purpose. Build interfaces that communicate
            through restraint and precision.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "card-2",
    bgColor: "#0d1b2a",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between p-8 sm:p-12 text-white select-none overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
            alt="Abstract Art"
            className="w-full h-full object-cover opacity-30"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a] via-[#0d1b2a]/60 to-transparent" />
        </div>
        <div className="relative z-10">
          <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-300/70">02 / Motion</span>
        </div>
        <div className="relative z-10 mt-auto space-y-3">
          <h3 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.1]">
            Movement
            <br />
            <span className="font-serif italic text-cyan-300">that breathes.</span>
          </h3>
          <p className="text-sm text-white/50 max-w-md leading-relaxed">
            Spring physics and scroll-driven animation create interfaces
            that feel alive, not performed.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "card-3",
    bgColor: "#2d1b0e",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between p-8 sm:p-12 text-white select-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/15 via-transparent to-orange-600/10" />
        <div className="relative z-10">
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-300/70">03 / Texture</span>
        </div>
        <div className="relative z-10 mt-auto space-y-3">
          <h3 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.1]">
            Depth through
            <br />
            <span className="font-serif italic text-amber-300">surface.</span>
          </h3>
          <p className="text-sm text-white/50 max-w-md leading-relaxed">
            Layered shadows, frosted glass, and tactile materials
            give flat screens physical presence.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "card-4",
    bgColor: "#0a1a0a",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between p-8 sm:p-12 text-white select-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/15 via-transparent to-teal-600/10" />
        <div className="relative z-10">
          <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-300/70">04 / System</span>
        </div>
        <div className="relative z-10 mt-auto space-y-3">
          <h3 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.1]">
            Ship with
            <br />
            <span className="font-serif italic text-emerald-300">confidence.</span>
          </h3>
          <p className="text-sm text-white/50 max-w-md leading-relaxed">
            Copy, paste, own. Components designed to be forked,
            themed, and made entirely yours.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "card-5",
    bgColor: "#1a0a1a",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between p-8 sm:p-12 text-white select-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-transparent to-pink-600/10" />
        <div className="relative z-10">
          <span className="text-[11px] font-mono tracking-widest uppercase text-purple-300/70">05 / Polish</span>
        </div>
        <div className="relative z-10 mt-auto space-y-3">
          <h3 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.1]">
            Details
            <br />
            <span className="font-serif italic text-purple-300">compound.</span>
          </h3>
          <p className="text-sm text-white/50 max-w-md leading-relaxed">
            The gap between good and remarkable lives in the 
            micro-interactions nobody asked for.
          </p>
        </div>
      </div>
    ),
  },
]
