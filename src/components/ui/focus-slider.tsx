"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  AnimatePresence,
} from "framer-motion"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FocusSliderItem {
  id: string | number
  title?: string
  subtitle?: string
  image?: string
  badge?: string
  color?: string
  content?: React.ReactNode
  [key: string]: unknown
}

export interface FocusSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of items to display in the carousel */
  items: FocusSliderItem[]
  /** Visible cards layout mode: 1 for '1 Full + 2 Cut' (animos style), or 2 for 'Multi-Card' (default: 1) */
  visibleSideCards?: 1 | 2
  /** Card size as percentage of container width (e.g. 76 for 76% width). Defaults to 76 for 1-full-2-cut, 52 for multi-card */
  cardSize?: number
  /** Width fallback of the focused (center) card in px (default: 320) */
  cardWidth?: number
  /** Aspect ratio of cards: "1:1", "4:5", "3:4", "16:9" (default: "1:1") */
  cardAspect?: "1:1" | "4:5" | "3:4" | "16:9" | (string & {})
  /** Corner radius of cards in px (default: 32) */
  cornerRadius?: number
  /** Gap between cards in px (default: 16) */
  gap?: number
  /** Custom distance between card centers in px. If omitted, calculated automatically */
  cardSpacing?: number
  /** Scale factor for non-focused side cards (default: 0.88) */
  sideScale?: number
  /** Opacity for non-focused side cards 0–1 (default: 0.75) */
  sideOpacity?: number
  /** Whether side cards alternate in a vertical zigzag (default: true, matching animos.app) */
  zigzag?: boolean
  /** Vertical zigzag offset in px for side cards (default: 48) */
  zigzagOffset?: number
  /** Zigzag mode: 'alternate' (flips each step) or 'fixed' or 'none' (default: 'alternate') */
  zigzagMode?: "alternate" | "fixed" | "none"
  /** Animation transition duration / speed in seconds (or ms if > 10). (default: 0.75) */
  speed?: number
  /** Bounciness of the spring transition between 0 (no bounce) and 1 (high bounce). (default: 0.3) */
  bounce?: number
  /** Direction of movement: 'horizontal' or 'vertical' (default: 'horizontal') */
  direction?: "horizontal" | "vertical"
  /** Whether dragging is enabled (default: true) */
  draggable?: boolean
  /** Controlled active index */
  activeIndex?: number
  /** Callback when active index changes */
  onActiveIndexChange?: (index: number) => void
  /** Show navigation dots (default: true) */
  showDots?: boolean
  /** Show navigation arrows (default: true) */
  showArrows?: boolean
  /** Whether the carousel loops infinitely (default: true) */
  loop?: boolean
  /** Enable mouse wheel / trackpad navigation (default: true) */
  mouseWheel?: boolean
  /** Background color behind cards — uses CSS value (default: transparent) */
  backgroundColor?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAspectRatioNumber(aspect: string): number {
  const parts = aspect.split(":")
  if (parts.length === 2) {
    const w = parseFloat(parts[0])
    const h = parseFloat(parts[1])
    if (w > 0 && h > 0) return w / h
  }
  return 1
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FocusSlider({
  items,
  visibleSideCards = 1,
  cardSize,
  cardWidth = 320,
  cardAspect = "1:1",
  cornerRadius = 32,
  gap = 16,
  cardSpacing,
  sideScale = 0.88,
  sideOpacity = 0.75,
  zigzag = true,
  zigzagOffset = 48,
  zigzagMode = "alternate",
  direction = "horizontal",
  speed = 0.75,
  bounce = 0.3,
  draggable = true,
  activeIndex: controlledIndex,
  onActiveIndexChange,
  showDots = true,
  showArrows = true,
  loop = true,
  mouseWheel = true,
  backgroundColor,
  className,
  style,
  ...rest
}: FocusSliderProps) {
  const n = items.length
  if (n === 0) return null

  const effectiveDuration = speed !== undefined ? (speed > 10 ? speed / 1000 : speed) : 0.75
  const effectiveBounce = bounce !== undefined ? Math.max(0, Math.min(0.9, bounce)) : 0.3

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = React.useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const updateSize = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0) {
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }
    updateSize()
    const ro = new ResizeObserver(updateSize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const visibleRange = visibleSideCards ?? 1
  const effectiveCardPercent = cardSize ?? (visibleRange === 1 ? 76 : 52)
  const ar = getAspectRatioNumber(cardAspect)
  const isH = direction === "horizontal"
  const effectiveZigzag = zigzag && zigzagMode !== "none" ? zigzagOffset : 0

  // Responsively scale card width from container width percentage
  let effectiveCardWidth =
    containerSize.width > 0
      ? Math.round(containerSize.width * (effectiveCardPercent / 100))
      : cardWidth

  let effectiveCardHeight = effectiveCardWidth / ar

  // Constrain height if the parent container has a fixed height limit
  const maxAllowedHeight =
    containerSize.height > 180 ? containerSize.height - effectiveZigzag * 2 - 40 : 0
  if (maxAllowedHeight > 0 && effectiveCardHeight > maxAllowedHeight) {
    effectiveCardHeight = maxAllowedHeight
    effectiveCardWidth = Math.round(effectiveCardHeight * ar)
  }

  // ─── Internal index state ────────────────────────────────────────────
  const [internalIndex, setInternalIndex] = React.useState(0)
  const active = controlledIndex ?? internalIndex

  const setActive = React.useCallback(
    (idx: number) => {
      const wrapped = loop ? mod(idx, n) : Math.max(0, Math.min(idx, n - 1))
      if (controlledIndex === undefined) {
        setInternalIndex(wrapped)
      }
      onActiveIndexChange?.(wrapped)
    },
    [controlledIndex, n, loop, onActiveIndexChange]
  )

  const goNext = React.useCallback(() => setActive(active + 1), [active, setActive])
  const goPrev = React.useCallback(() => setActive(active - 1), [active, setActive])

  // ─── Native Non-Passive Wheel scrolling ──────────────────────────────
  React.useEffect(() => {
    const el = containerRef.current
    if (!el || !mouseWheel) return

    let accumulatedDelta = 0
    let lastWheelTrigger = 0

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = Date.now()
      const delta = isH
        ? Math.abs(e.deltaX) > Math.abs(e.deltaY)
          ? e.deltaX
          : e.deltaY
        : e.deltaY

      accumulatedDelta += delta

      if (now - lastWheelTrigger > 260 && Math.abs(accumulatedDelta) >= 20) {
        lastWheelTrigger = now
        if (accumulatedDelta > 0) {
          goNext()
        } else {
          goPrev()
        }
        accumulatedDelta = 0
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel)
    }
  }, [mouseWheel, isH, goNext, goPrev])

  // ─── Drag handling ───────────────────────────────────────────────────
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragEnd = React.useCallback(
    (_: any, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
      const swipeThreshold = effectiveCardWidth * 0.18
      const velocityThreshold = 250
      setIsDragging(false)

      const offsetDist = isH ? info.offset.x : info.offset.y
      const vel = isH ? info.velocity.x : info.velocity.y

      if (offsetDist < -swipeThreshold || vel < -velocityThreshold) {
        goNext()
      } else if (offsetDist > swipeThreshold || vel > velocityThreshold) {
        goPrev()
      }
    },
    [effectiveCardWidth, goNext, goPrev, isH]
  )

  // ─── Keyboard nav ───────────────────────────────────────────────────
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        goPrev()
      }
    },
    [goNext, goPrev]
  )

  // ─── Compute visible cards ───────────────────────────────────────────
  // visibleRange: 1 produces 3 cards ([-1, 0, 1]) -> 1 full at a time and 2 cut
  // visibleRange: 2 produces 5 cards ([-2, -1, 0, 1, 2]) -> multi-card
  const visibleIndices = React.useMemo(() => {
    const result: number[] = []
    for (let offset = -visibleRange; offset <= visibleRange; offset++) {
      const idx = loop ? mod(active + offset, n) : active + offset
      if (idx >= 0 && idx < n) {
        result.push(offset)
      }
    }
    return result
  }, [active, n, loop, visibleRange])

  // ─── Card positions ─────────────────────────────────────────────────
  const getCardStyle = (offset: number) => {
    const absOffset = Math.abs(offset)
    const scale = offset === 0 ? 1 : sideScale * Math.pow(0.95, absOffset - 1)
    const opacity = offset === 0 ? 1 : sideOpacity * Math.pow(0.85, absOffset - 1)

    // Primary axis translate (X in horizontal, Y in vertical):
    let primary = 0
    if (offset !== 0) {
      const sign = offset > 0 ? 1 : -1
      if (cardSpacing !== undefined) {
        primary = sign * absOffset * cardSpacing
      } else if (visibleRange === 1) {
        // Animos 1 full + 2 cut: Card sits immediately outside center card with gap,
        // so its outer body extends outside container bounds and gets cleanly cut off.
        const step1 = (effectiveCardWidth * (1 + sideScale)) / 2 + gap
        primary = sign * step1
      } else {
        // Multi-card layout
        const step1 = (effectiveCardWidth * sideScale) * 0.72 + gap
        const stepMore = (effectiveCardWidth * sideScale) * 0.70 + gap
        primary = sign * (step1 + (absOffset - 1) * stepMore)
      }
    }

    // Cross axis translate for alternating vertical zigzag (animos.app signature):
    let cross = 0
    if (zigzag && zigzagMode !== "none" && offset !== 0) {
      const sign = offset > 0 ? 1 : -1
      // Alternates every slide: when active is even, left is down (+), right is up (-)
      const b = zigzagMode === "fixed" ? 1 : (Math.abs(active) % 2 === 0 ? 1 : -1)
      cross = - sign * effectiveZigzag * b
    }

    const x = isH ? primary : cross
    const y = isH ? cross : primary
    const zIndex = 20 - absOffset

    return {
      scale,
      opacity,
      x,
      y,
      zIndex,
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative isolate flex flex-col items-center justify-center overflow-hidden select-none outline-none",
        className
      )}
      style={{
        backgroundColor,
        ...style,
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Focus slider carousel"
      aria-roledescription="carousel"
      {...rest}
    >
      {/* ─── Carousel Track ─────────────────────────────────────────── */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "100%",
          height: effectiveCardHeight + effectiveZigzag * 2 + 24,
        }}
      >
        {/* Drag wrapper */}
        <motion.div
          className="relative flex items-center justify-center"
          style={{
            width: "100%",
            height: effectiveCardHeight,
            cursor: draggable ? "grab" : "default",
          }}
          drag={draggable ? (isH ? "x" : "y") : false}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.15}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          whileDrag={{ cursor: "grabbing" }}
        >
          <AnimatePresence mode="popLayout">
            {visibleIndices.map((offset) => {
              const idx = loop ? mod(active + offset, n) : active + offset
              const item = items[idx]
              if (!item) return null

              const { scale, opacity, x, y, zIndex } = getCardStyle(offset)

              return (
                <motion.div
                  key={`${item.id}-${idx}`}
                  className="absolute"
                  initial={{ scale: 0.75, opacity: 0, x, y }}
                  animate={{
                    scale,
                    opacity,
                    x,
                    y,
                    zIndex,
                  }}
                  exit={{
                    scale: 0.75,
                    opacity: 0,
                    transition: { duration: effectiveDuration * 0.45, ease: "easeOut" },
                  }}
                  transition={{
                    type: "spring",
                    duration: effectiveDuration,
                    bounce: effectiveBounce,
                    opacity: { duration: effectiveDuration * 0.55, ease: "easeOut" },
                  }}
                  style={{
                    width: effectiveCardWidth,
                    height: effectiveCardHeight,
                    borderRadius: cornerRadius,
                    transformOrigin: "center center",
                  }}
                  onClick={() => {
                    if (!isDragging && offset !== 0) {
                      setActive(active + offset)
                    }
                  }}
                >
                  <div
                    className={cn(
                      "relative w-full h-full overflow-hidden",
                      offset !== 0 && "cursor-pointer"
                    )}
                    style={{
                      borderRadius: cornerRadius,
                      boxShadow:
                        offset === 0
                          ? "0 25px 60px -12px rgba(0, 0, 0, 0.45), 0 8px 24px -6px rgba(0, 0, 0, 0.3)"
                          : "0 12px 32px -8px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {/* Image or custom content */}
                    {item.content ? (
                      <div className="w-full h-full">{item.content}</div>
                    ) : item.color ? (
                      <div
                        className="relative w-full h-full flex flex-col justify-between p-4 sm:p-5 select-none"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.image && (
                          <div className="relative w-full flex-1 overflow-hidden rounded-xl sm:rounded-2xl shadow-inner">
                            <img
                              src={item.image}
                              alt={item.title || "Slide"}
                              className="w-full h-full object-cover"
                              draggable={false}
                            />
                          </div>
                        )}
                        <div className="pt-3">
                          {item.subtitle && (
                            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/70 mb-0.5">
                              {item.subtitle}
                            </p>
                          )}
                          {item.title && (
                            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                              {item.title}
                            </h3>
                          )}
                        </div>
                      </div>
                    ) : item.image ? (
                      <img
                        src={item.image}
                        alt={item.title || `Slide ${idx + 1}`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                          {idx + 1}
                        </span>
                      </div>
                    )}

                    {/* Overlay with title + subtitle for focused full-bleed card */}
                    {!item.color && offset === 0 && item.title && (
                      <motion.div
                        className="absolute inset-x-0 bottom-0 p-5 pt-12"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)",
                          borderRadius: `0 0 ${cornerRadius}px ${cornerRadius}px`,
                        }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                      >
                        {item.subtitle && (
                          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/70 mb-1">
                            {item.subtitle}
                          </p>
                        )}
                        <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight leading-snug">
                          {item.title}
                        </h3>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ─── Navigation Arrows ──────────────────────────────────────── */}
      {showArrows && n > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            disabled={!loop && active === 0}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-full",
              "bg-white/10 dark:bg-black/30 backdrop-blur-lg border border-white/20 dark:border-white/10",
              "text-white hover:bg-white/20 dark:hover:bg-black/50 transition-all cursor-pointer",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            aria-label="Previous slide"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!loop && active === n - 1}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-full",
              "bg-white/10 dark:bg-black/30 backdrop-blur-lg border border-white/20 dark:border-white/10",
              "text-white hover:bg-white/20 dark:hover:bg-black/50 transition-all cursor-pointer",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            aria-label="Next slide"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* ─── Dot Indicators ─────────────────────────────────────────── */}
      {showDots && n > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-5 z-10" role="tablist">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-full transition-all duration-300 cursor-pointer",
                i === active
                  ? "w-6 h-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
