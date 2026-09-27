"use client"

import * as React from "react"
import {
  motion,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion"
import { cn } from "@/lib/utils"
import { ExternalLink, X } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GridZoomStripItem {
  id: string | number
  title?: string
  subtitle?: string
  description?: string
  image?: string
  badge?: string
  href?: string
  content?: React.ReactNode
  [key: string]: unknown
}

export type CardAspectRatio = "1:1" | "4:3" | "3:4" | "4:5" | "16:9" | "9:16" | (string & {})

export interface GridZoomStripProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of items to showcase (ideally 9 items for a 3x3 grid) */
  items: GridZoomStripItem[]
  /** Maximum magnification zoom factor during the in-line strip phase (default: 2.2) */
  zoom?: number
  /** Aspect ratio of individual cards (default: "1:1") */
  cardAspect?: CardAspectRatio
  /** Grid gap between cards in percentage (default: 2.0) */
  gap?: number
  /** Outer container padding in percentage (default: 6.0) */
  padding?: number
  /** Corner radius of cards in percentage or px (default: 18) */
  cornerRadius?: number
  /** Direction in which cards align and pan (default: "horizontal") */
  direction?: "horizontal" | "vertical" | (string & {})
  /** Which card is the initial zoom focal target: "start" (card 1) or "center" (card 5) */
  zoomTarget?: "start" | "center" | (string & {})
  /** Movement style: "smooth" or "stepped" (default: "smooth") */
  movement?: "smooth" | "stepped"
  /** Mode: "scroll" (driven by page scroll) or "interactive" (self-contained wheel/scrub) */
  mode?: "scroll" | "interactive"
  /** Controlled scrub progress [0, 1] */
  progress?: number
  /** Callback fired when progress changes */
  onProgressChange?: (progress: number) => void
  /** Enable mouse wheel scrub in interactive mode (default: true) */
  wheelScrub?: boolean
  /** Enable pointer drag to scrub in interactive mode (default: true) */
  draggable?: boolean
  /** Show card shadows (default: true) */
  shadow?: boolean
  /** Fade non-focused peripheral cards during in-line strip phase (default: true) */
  fade?: boolean
  /** Click card to view zoomed hero modal (default: true) */
  zoomOnClick?: boolean
}

// ─── Aspect Ratio Helper ─────────────────────────────────────────────────────

function parseAspectNumeric(aspect: CardAspectRatio): number {
  switch (aspect) {
    case "1:1":
      return 1
    case "4:3":
      return 4 / 3
    case "3:4":
      return 3 / 4
    case "4:5":
      return 4 / 5
    case "16:9":
      return 16 / 9
    case "9:16":
      return 9 / 16
    default:
      if (typeof aspect === "number") return aspect
      if (typeof aspect === "string" && aspect.includes(":")) {
        const [w, h] = aspect.split(":").map(Number)
        if (w && h) return w / h
      }
      return 1
  }
}

function parseAspectRatioString(aspect: CardAspectRatio): string {
  switch (aspect) {
    case "1:1":
      return "1 / 1"
    case "4:3":
      return "4 / 3"
    case "3:4":
      return "3 / 4"
    case "4:5":
      return "4 / 5"
    case "16:9":
      return "16 / 9"
    case "9:16":
      return "9 / 16"
    default:
      return typeof aspect === "string" ? aspect.replace(":", " / ") : "1 / 1"
  }
}

// Smooth cubic easing
function cubicEase(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function GridZoomStrip({
  items,
  zoom = 2.2,
  cardAspect = "1:1",
  gap = 2.0,
  padding = 6.0,
  cornerRadius = 18,
  direction = "horizontal",
  zoomTarget = "start",
  movement = "smooth",
  mode = "interactive",
  progress: controlledProgress,
  onProgressChange,
  wheelScrub = true,
  draggable = true,
  shadow = true,
  fade = true,
  zoomOnClick = true,
  className,
  style,
  ...props
}: GridZoomStripProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = React.useState({ width: 600, height: 600 })

  // Observe container size
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const updateSize = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({ width: rect.width, height: rect.height })
      }
    }
    updateSize()
    const ro = new ResizeObserver(updateSize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const isControlled = controlledProgress !== undefined

  // Internal motion value for scrub progress [0, 1]
  const internalProgress = useMotionValue(controlledProgress ?? 0)

  // Spring physics for buttery momentum
  const smoothProgress = useSpring(internalProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.0005,
  })

  // Synchronize controlled progress when externally passed
  React.useEffect(() => {
    if (isControlled && controlledProgress !== undefined) {
      internalProgress.set(controlledProgress)
    }
  }, [controlledProgress, isControlled, internalProgress])

  // Drag interaction state
  const isDraggingRef = React.useRef(false)
  const dragStartRef = React.useRef<{ x: number; y: number; startProgress: number } | null>(null)

  // Clicked item for hero spotlight modal
  const [activeItem, setActiveItem] = React.useState<GridZoomStripItem | null>(null)

  // Non-passive native wheel listener ensures preventDefault works without browser passive exceptions
  React.useEffect(() => {
    const el = containerRef.current
    if (!el || mode !== "interactive" || !wheelScrub) return

    const onWheel = (e: WheelEvent) => {
      if (activeItem) return
      e.preventDefault()
      const current = controlledProgress !== undefined ? controlledProgress : internalProgress.get()
      const delta = e.deltaY * 0.0012
      const next = Math.max(0, Math.min(1, current + delta))
      internalProgress.set(next)
      onProgressChange?.(next)
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel)
    }
  }, [mode, wheelScrub, activeItem, controlledProgress, internalProgress, onProgressChange])

  // Pointer drag scrubbing
  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode !== "interactive" || !draggable || activeItem) return
    isDraggingRef.current = true
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startProgress: controlledProgress !== undefined ? controlledProgress : internalProgress.get(),
    }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !dragStartRef.current) return
    const deltaX = e.clientX - dragStartRef.current.x
    const deltaY = e.clientY - dragStartRef.current.y
    const dominantDelta = Math.abs(deltaY) > Math.abs(deltaX) ? -deltaY * 0.002 : -deltaX * 0.002
    const next = Math.max(0, Math.min(1, dragStartRef.current.startProgress + dominantDelta))
    internalProgress.set(next)
    onProgressChange?.(next)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    dragStartRef.current = null
    try {
      ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    } catch {
      // Ignore pointer capture errors
    }
  }

  // ─── Mathematical Morph: 3x3 Grid -> Single In-Line Strip ───────────────────
  // Total cards:
  const total = items.length
  const cols = 3
  const rows = Math.ceil(total / cols)

  const padX = dimensions.width * (padding / 100)
  const padY = dimensions.height * (padding / 100)
  const availW = Math.max(100, dimensions.width - padX * 2)
  const availH = Math.max(100, dimensions.height - padY * 2)
  const gapPx = dimensions.width * (gap / 100)

  // Compute canonical card base size in grid
  const rawCellW = (availW - (cols - 1) * gapPx) / cols
  const rawCellH = (availH - (rows - 1) * gapPx) / rows

  const aspectNum = parseAspectNumeric(cardAspect)
  let cardW = rawCellW
  let cardH = rawCellW / aspectNum

  // Keep grid within available bounds
  if (cardH * rows + (rows - 1) * gapPx > availH) {
    cardH = rawCellH
    cardW = rawCellH * aspectNum
  }

  const gridTotalW = cols * cardW + (cols - 1) * gapPx
  const gridTotalH = rows * cardH + (rows - 1) * gapPx

  const targetIdx = zoomTarget === "center" ? Math.floor(total / 2) : 0
  const isHorizontal = direction === "horizontal"
  const lineGap = gapPx * 1.4

  // State to drive cards reactively from spring
  const [currentProgress, setCurrentProgress] = React.useState(0)

  React.useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      setCurrentProgress(latest)
    })
  }, [smoothProgress])

  // Compute Phase Values:
  // Phase 1 (0.00 -> 0.35): Morph all rows from 3x3 Grid into a SINGLE straight line + scale up
  // Phase 2 (0.35 -> 0.85): In-Line Strip smoothly pans across all cards
  // Phase 3 (0.85 -> 1.00): Morph back from line into 3x3 Grid
  const t = Math.max(0, Math.min(1, currentProgress))

  let morphT = 0
  if (t <= 0.35) {
    morphT = cubicEase(t / 0.35)
  } else if (t <= 0.85) {
    morphT = 1
  } else {
    morphT = 1 - cubicEase((t - 0.85) / 0.15)
  }

  let panT = 0
  if (t <= 0.35) {
    panT = 0
  } else if (t <= 0.85) {
    panT = cubicEase((t - 0.35) / (0.85 - 0.35))
  } else {
    panT = 1
  }

  // Stepped movement support
  const effectivePanT =
    movement === "stepped" ? Math.round(panT * (total - 1)) / (total - 1) : panT

  // Current uniform scale across all cards
  const currentScale = 1.0 + (zoom - 1.0) * morphT

  const centerX = dimensions.width / 2
  const centerY = dimensions.height / 2

  // Total travel distance in line mode from start card to end card
  const lineSpacing = isHorizontal ? cardW * zoom + lineGap : cardH * zoom + lineGap
  const panTravel = (total - 1 - targetIdx) * lineSpacing
  const panOffset = -effectivePanT * panTravel

  return (
    <div
      ref={containerRef}
      data-slot="grid-zoom-strip"
      className={cn(
        "relative isolate w-full h-full select-none overflow-hidden touch-none",
        mode === "interactive" && draggable && !activeItem && "cursor-grab active:cursor-grabbing",
        className
      )}
      style={{
        ...style,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      {...props}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 75%)",
        }}
      />

      {/* ─── Render Cards (All morphing from Grid into a Single Line) ─────────── */}
      {items.map((item, i) => {
        // 1. Grid coordinates (3x3 grid slots):
        const col = i % cols
        const row = Math.floor(i / cols)
        const gx = -gridTotalW / 2 + cardW / 2 + col * (cardW + gapPx)
        const gy = -gridTotalH / 2 + cardH / 2 + row * (cardH + gapPx)

        // 2. Line coordinates (ALL CARDS ALIGNED ON ONE SINGLE STRAIGHT AXIS):
        let lx = 0
        let ly = 0
        if (isHorizontal) {
          // ALL cards collapse to y = 0, distributed horizontally side by side
          const baseLineX = (i - targetIdx) * lineSpacing
          lx = baseLineX + panOffset
          ly = 0
        } else {
          // ALL cards collapse to x = 0, distributed vertically top to bottom
          const baseLineY = (i - targetIdx) * lineSpacing
          lx = 0
          ly = baseLineY + panOffset
        }

        // 3. Smooth continuous interpolation from Grid (morphT = 0) to Single Line (morphT = 1):
        const x = gx + (lx - gx) * morphT
        const y = gy + (ly - gy) * morphT

        // 4. Optical z-index: cards closest to center float above neighbors
        const distFromCenter = isHorizontal ? Math.abs(x) : Math.abs(y)
        const zIndex = 10 + Math.round(Math.max(0, 100 - distFromCenter * 0.08))

        // 5. Peripheral fade during in-line strip phase
        const cardOpacity = fade
          ? 1 - morphT * Math.min(0.65, Math.pow(distFromCenter / (lineSpacing * 1.6), 1.2))
          : 1

        return (
          <div
            key={item.id ?? i}
            data-slot="grid-zoom-strip-card-node"
            className="absolute left-0 top-0 will-change-transform flex items-center justify-center pointer-events-auto"
            style={{
              width: cardW,
              height: cardH,
              transform: `translate3d(${centerX + x - cardW / 2}px, ${centerY + y - cardH / 2}px, 0px) scale(${currentScale})`,
              transformOrigin: "center center",
              zIndex,
              opacity: cardOpacity,
            }}
          >
            <div
              data-slot="grid-zoom-strip-card"
              className={cn(
                "group/strip-card h-full w-full cursor-pointer overflow-hidden relative",
                "transition-all duration-300 ease-out will-change-transform",
                shadow && "shadow-lg shadow-black/60 hover:shadow-2xl hover:shadow-indigo-500/30",
                "ring-1 ring-white/10 hover:ring-2 hover:ring-white/90"
              )}
              style={{
                borderRadius: `${cornerRadius}px`,
                aspectRatio: parseAspectRatioString(cardAspect),
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (zoomOnClick) {
                  setActiveItem(item)
                }
              }}
            >
              {item.content ? (
                item.content
              ) : (
                <GridZoomStripCard item={item} cornerRadius={cornerRadius} />
              )}
            </div>
          </div>
        )
      })}

      {/* ─── Interactive Hero Spotlight Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            key="grid-zoom-strip-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[10000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
            onClick={() => setActiveItem(null)}
          >
            <div className="absolute inset-0 cursor-zoom-out" />

            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.6, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className="relative z-10 w-full max-w-[360px] overflow-hidden rounded-3xl border border-white/20 bg-[#141418] shadow-2xl shadow-indigo-500/30 flex flex-col cursor-default"
              style={{
                aspectRatio: parseAspectRatioString(cardAspect),
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="absolute right-4 top-4 z-30 flex size-8 items-center justify-center rounded-full bg-black/60 text-white/90 backdrop-blur-md transition-all hover:bg-black hover:text-white hover:scale-110 active:scale-90 cursor-pointer"
                aria-label="Close zoomed view"
              >
                <X className="size-4" />
              </button>

              {activeItem.content ? (
                <div className="relative flex h-full w-full flex-col">
                  <div className="h-full w-full overflow-hidden">{activeItem.content}</div>
                  {(activeItem.description || activeItem.href) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-5 text-white backdrop-blur-xs">
                      {activeItem.title && (
                        <h3 className="text-base font-bold tracking-tight text-white mb-1">
                          {activeItem.title}
                        </h3>
                      )}
                      {activeItem.description && (
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {activeItem.description}
                        </p>
                      )}
                      {activeItem.href && (
                        <a
                          href={activeItem.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:underline"
                        >
                          Visit link <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <GridZoomStripCard item={activeItem} isHero />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

export interface GridZoomStripCardProps extends React.HTMLAttributes<HTMLDivElement> {
  item: GridZoomStripItem
  cornerRadius?: number
  isHero?: boolean
}

export function GridZoomStripCard({
  item,
  cornerRadius = 18,
  isHero = false,
  className,
  children,
  ...props
}: GridZoomStripCardProps) {
  if (children) {
    return (
      <div
        data-slot="grid-zoom-strip-card-inner"
        className={cn("h-full w-full overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  const isOnlyImage = Boolean(item.image && !item.title && !item.subtitle && !item.badge)

  return (
    <div
      data-slot="grid-zoom-strip-card-inner"
      className={cn(
        "relative flex h-full w-full flex-col justify-between overflow-hidden bg-zinc-900/90 text-zinc-100",
        isOnlyImage ? "p-0" : "p-3.5",
        className
      )}
      style={{
        borderRadius: `${cornerRadius}px`,
      }}
      {...props}
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.title || "Strip card"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/strip-card:scale-105"
        />
      )}

      {item.image && (item.title || item.subtitle || item.badge) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      )}

      {(item.badge || item.subtitle) && (
        <div className="relative z-10 flex w-full items-center justify-between">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase text-white backdrop-blur-md">
            {item.badge || item.subtitle}
          </span>
        </div>
      )}

      {(item.title || item.description) && (
        <div className="relative z-10 mt-auto">
          {item.title && (
            <h4
              className={cn(
                "font-bold leading-tight tracking-tight text-white drop-shadow-sm truncate",
                isHero ? "text-lg mb-1" : "text-xs"
              )}
            >
              {item.title}
            </h4>
          )}
          {item.description && (
            <p
              className={cn(
                "text-zinc-300 leading-snug",
                isHero ? "text-xs line-clamp-3" : "text-[10px] line-clamp-1 opacity-80"
              )}
            >
              {item.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function GridZoomStripImage({
  src,
  alt = "",
  className,
  ...props
}: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="grid-zoom-strip-image"
      src={src}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  )
}
