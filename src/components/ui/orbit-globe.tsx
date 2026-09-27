"use client"

import * as React from "react"
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion"
import { X, ExternalLink, ZoomIn, ZoomOut } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OrbitGlobeItem {
  /** Unique identifier */
  id: string | number
  /** Content to render inside the card */
  content?: React.ReactNode
  /** Optional title */
  title?: string
  /** Optional image URL */
  image?: string
  /** Optional badge or subtitle */
  subtitle?: string
  /** Optional detailed description shown when zoomed in */
  description?: string
  /** Optional external link URL */
  href?: string
  /** Optional custom data */
  [key: string]: unknown
}

export type CardAspectRatio = "1:1" | "4:3" | "3:4" | "4:5" | "16:9" | "9:16" | "auto" | (string & {}) | number

export interface OrbitGlobeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of items to distribute across the globe */
  items: OrbitGlobeItem[]
  /** Size of the orbit globe relative to container (30-90, default: 50) */
  globeSize?: number
  /** Width of each card relative to container (10-40, default: 24) */
  cardSize?: number
  /** Card aspect ratio (default: "3:4") */
  cardAspect?: CardAspectRatio
  /** Gap between cards in percentage (default: 2.5) */
  gap?: number
  /** Tilt angle of the globe axis in degrees (default: 27) */
  tilt?: number
  /** Back fade percentage for distant cards (0-100, default: 55) */
  backFade?: number
  /** Duration of one full rotation in seconds (default: 20) */
  duration?: number
  /** Direction of rotation (default: "left") */
  direction?: "left" | "right" | "alternate" | (string & {})
  /** Whether the rotation animation is active (default: true) */
  playing?: boolean
  /** Slow down / pause rotation on card hover (default: true) */
  pauseOnHover?: boolean
  /** Allow mouse/touch dragging to spin the globe (default: true) */
  draggable?: boolean
  /** Allow mouse wheel to zoom the globe in/out (default: true) */
  wheelZoom?: boolean
  /** Camera perspective distance factor (default: 1.5) */
  perspective?: number
  /** Card border radius in px or CSS string (default: "1rem") */
  cardRadius?: string | number
  /** Whether clicking a card zooms it into a hero spotlight view (default: true) */
  zoomOnClick?: boolean
  /** Currently zoomed card ID (controlled) */
  activeZoomId?: string | number | null
  /** Callback fired when zoom state changes */
  onZoomChange?: (item: OrbitGlobeItem | null) => void
  /** Callback when a card is clicked */
  onCardClick?: (item: OrbitGlobeItem, index: number) => void
  /** Custom render function for card content */
  renderCard?: (
    item: OrbitGlobeItem,
    state: {
      scale: number
      opacity: number
      isFront: boolean
      isHovered: boolean
      ringIndex: number
      cardIndex: number
    }
  ) => React.ReactNode
  /** Custom render function for zoomed card */
  renderZoomedCard?: (item: OrbitGlobeItem, onClose: () => void) => React.ReactNode
}

// ─── Aspect Ratio Helper ─────────────────────────────────────────────────────

function parseAspectRatio(aspect: CardAspectRatio): number {
  if (typeof aspect === "number") return aspect
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
    case "auto":
    default:
      return 3 / 4
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function OrbitGlobe({
  items,
  globeSize: initialGlobeSize = 50,
  cardSize = 24,
  cardAspect = "3:4",
  gap = 2.5,
  tilt = 27,
  backFade = 55,
  duration = 20,
  direction = "left",
  playing = true,
  pauseOnHover = true,
  draggable = true,
  wheelZoom = true,
  perspective = 1.5,
  cardRadius = "0.875rem",
  zoomOnClick = true,
  activeZoomId: controlledZoomId,
  onZoomChange,
  onCardClick,
  renderCard,
  renderZoomedCard,
  className,
  style,
  ...props
}: OrbitGlobeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = React.useState({ width: 600, height: 600 })
  const [mounted, setMounted] = React.useState(false)

  // Dynamic zoom factor adjusted by mouse wheel if wheelZoom is true
  const [zoomScale, setZoomScale] = React.useState(1)

  // Card hover state
  const [hoveredCardKey, setHoveredCardKey] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  // Zoomed-in card state
  const [internalZoomItem, setInternalZoomItem] = React.useState<OrbitGlobeItem | null>(null)
  const isControlled = controlledZoomId !== undefined
  const activeZoomItem = isControlled
    ? items.find((i) => i.id === controlledZoomId) || null
    : internalZoomItem

  const setZoomItem = (item: OrbitGlobeItem | null) => {
    if (!isControlled) {
      setInternalZoomItem(item)
    }
    onZoomChange?.(item)
  }

  // Rotation progress in radians [0, 2*PI)
  const [rotation, setRotation] = React.useState(0)
  const dragStartRef = React.useRef<{ x: number; y: number; startRotation: number } | null>(null)
  const lastTimeRef = React.useRef<number>(0)
  const velocityRef = React.useRef<number>(0)

  // Observe container dimensions
  React.useEffect(() => {
    setMounted(true)
    const el = containerRef.current
    if (!el) return

    const updateSize = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Close zoomed card on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeZoomItem) {
        setZoomItem(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeZoomItem])

  // Mouse wheel to zoom the globe
  const handleWheel = (e: React.WheelEvent) => {
    if (!wheelZoom || activeZoomItem) return
    e.preventDefault()
    setZoomScale((prev) => {
      const delta = -e.deltaY * 0.001
      return Math.max(0.7, Math.min(1.4, prev + delta))
    })
  }

  // Animation frame loop
  useAnimationFrame((time) => {
    if (!mounted) return

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time
      return
    }

    const delta = (time - lastTimeRef.current) / 1000
    lastTimeRef.current = time

    // If currently dragging or viewing a zoomed card, freeze rotation
    if (isDragging || activeZoomItem) return

    // Apply inertia damping from drag
    if (Math.abs(velocityRef.current) > 0.0008) {
      setRotation((prev) => (prev + velocityRef.current) % (Math.PI * 2))
      velocityRef.current *= 0.93
    }

    // Auto-rotation: when hovering a card and pauseOnHover is true, gently drift at 15% speed or pause
    const isHoveringCard = hoveredCardKey !== null
    const speedMultiplier = isHoveringCard && pauseOnHover ? 0 : 1

    if (playing && speedMultiplier > 0) {
      const dirMultiplier = direction === "right" ? -1 : 1
      const speed = (2 * Math.PI) / duration
      const deltaRotation = dirMultiplier * speed * delta * speedMultiplier

      setRotation((prev) => {
        let next = prev + deltaRotation
        if (next < 0) next += Math.PI * 2
        return next % (Math.PI * 2)
      })
    }
  })

  // Pointer drag to spin the globe
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable || activeZoomItem) return
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startRotation: rotation,
    }
    velocityRef.current = 0
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return
    const deltaX = e.clientX - dragStartRef.current.x
    const sensitivity = 0.0055
    const newRotation = dragStartRef.current.startRotation + deltaX * sensitivity
    velocityRef.current = (e.movementX || 0) * 0.002
    setRotation(newRotation)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    dragStartRef.current = null
    try {
      ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    } catch {
      // Ignore pointer capture errors
    }
  }

  // Handle card click
  const handleCardClick = (item: OrbitGlobeItem, index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    onCardClick?.(item, index)
    if (zoomOnClick) {
      setZoomItem(item)
    }
  }

  // ─── Mathematical 3D Sphere Orbit Calculation ──────────────────────────────
  const o = dimensions.width
  const a = dimensions.height
  const su = (Math.min(o, a) / 100) * zoomScale

  const globeRadius = su * initialGlobeSize
  const cardWidth = su * cardSize
  const aspectMultiplier = parseAspectRatio(cardAspect)
  const cardHeight = cardWidth / aspectMultiplier
  const cardGap = su * gap
  const fadeFactor = backFade / 100

  // Tilt in radians
  const tiltRad = (tilt * Math.PI) / 180
  const cosTilt = Math.cos(tiltRad)
  const sinTilt = Math.sin(tiltRad)

  const centerX = o / 2
  const centerY = a / 2
  const itemCount = Math.max(1, items.length)

  // Camera perspective distance:
  const R = globeRadius * perspective
  // Angular elevation step per ring:
  const D = (cardHeight + cardGap) / Math.max(1, globeRadius)
  // Number of rings above and below equator:
  const H = Math.max(1, Math.floor(1.15 / Math.max(0.001, D)))
  const ringCount = H * 2 + 1
  const slotStepPerRing = Math.max(1, Math.round(itemCount / ringCount))

  interface CalculatedCard {
    key: string
    slot: number
    ringIndex: number
    cardIndex: number
    item: OrbitGlobeItem
    screenX: number
    screenY: number
    width: number
    height: number
    scale: number
    opacity: number
    depthDistance: number
    isFront: boolean
    zIndex: number
    interactive: boolean
  }

  const cards: CalculatedCard[] = []

  // Generate cards across spherical rings
  for (let k = -H, ringIdx = 0; ringIdx < ringCount; k++, ringIdx++) {
    const latAngle = k * D
    const ringRadiusFactor = Math.cos(latAngle)
    const ringY = Math.sin(latAngle)

    const ringCircumference = 2 * Math.PI * globeRadius * ringRadiusFactor
    const cardsOnRing = Math.max(3, Math.round(ringCircumference / (cardWidth + cardGap)))
    const phaseStagger = ringIdx * 0.37

    for (let cIdx = 0; cIdx < cardsOnRing; cIdx++) {
      const baseAngle = phaseStagger + (2 * Math.PI * cIdx) / cardsOnRing
      const dirMultiplier = direction === "right" || (direction === "alternate" && ringIdx % 2 === 1) ? -1 : 1
      const currentAngle = baseAngle + dirMultiplier * rotation

      // 3D coordinates on unit sphere:
      const U = Math.sin(currentAngle) * ringRadiusFactor
      const Q = ringY
      const F = Math.cos(currentAngle) * ringRadiusFactor // Depth: -1 (back) to +1 (front)

      // Perspective projection:
      const distFromCam = R + globeRadius * (1 - F)
      const perspScale = R / Math.max(1, distFromCam)

      // Projected un-tilted 2D coordinates:
      const projX = globeRadius * U * perspScale
      const projY = -globeRadius * Q * perspScale

      // Apply tilt rotation around screen normal:
      const screenX = centerX + projX * cosTilt - projY * sinTilt
      const screenY = centerY + projX * sinTilt + projY * cosTilt

      // Depth fade:
      const depthAlpha = 1 - fadeFactor * ((1 - F) / 2)

      // Slot index mapped to provided items:
      const itemIndex = ((cIdx + ringIdx * slotStepPerRing) % itemCount + itemCount) % itemCount
      const item = items[itemIndex]

      // Z-index calculation (closer cards have higher z-index):
      const zIndex = Math.round((1 - (distFromCam - R) / (2 * globeRadius)) * 1000)
      const cardKey = `ring-${ringIdx}-card-${cIdx}-slot-${itemIndex}`

      // ONLY cards in the front hemisphere (F > -0.05) are interactive.
      // This prevents back-facing cards from awkwardly intercepting mouse events!
      const interactive = F > -0.05

      cards.push({
        key: cardKey,
        slot: itemIndex,
        ringIndex: ringIdx,
        cardIndex: cIdx,
        item,
        screenX,
        screenY,
        width: cardWidth * perspScale,
        height: cardHeight * perspScale,
        scale: perspScale,
        opacity: Math.max(0.05, Math.min(1, depthAlpha)),
        depthDistance: distFromCam,
        isFront: F > 0,
        zIndex,
        interactive,
      })
    }
  }

  // Sort back to front (largest depth distance first) for correct occlusion
  cards.sort((a, b) => b.depthDistance - a.depthDistance)

  const isAnyCardHovered = hoveredCardKey !== null

  return (
    <div
      ref={containerRef}
      data-slot="orbit-globe"
      className={cn(
        "relative isolate select-none overflow-hidden touch-none",
        draggable && !activeZoomItem && "cursor-grab active:cursor-grabbing",
        className
      )}
      style={{
        ...style,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      {...props}
    >
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-700"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Render 3D orbit cards */}
      {cards.map((card) => {
        const isHovered = hoveredCardKey === card.key
        // Boost z-index to the very top when hovered so it never clips under neighboring cards
        const effectiveZIndex = isHovered ? 50000 : card.zIndex
        // Optical depth of field: when a card is hovered, non-hovered cards gently dim
        const effectiveOpacity = isAnyCardHovered && !isHovered
          ? card.opacity * 0.45
          : card.opacity

        return (
          <div
            key={card.key}
            data-slot="orbit-globe-node"
            className="absolute left-0 top-0 will-change-transform"
            style={{
              width: cardWidth,
              height: cardHeight,
              transform: `translate3d(${card.screenX - cardWidth / 2}px, ${card.screenY - cardHeight / 2}px, 0px) scale(${card.scale})`,
              transformOrigin: "center center",
              opacity: effectiveOpacity,
              zIndex: effectiveZIndex,
              // Strictly disable pointer events on cards in the back, or all cards when a card is zoomed in
              pointerEvents: !activeZoomItem && card.interactive ? "auto" : "none",
            }}
          >
            {/* Inner card with CSS-accelerated hover lift & scale */}
            <div
              className={cn(
                "group/card h-full w-full cursor-pointer overflow-hidden",
                "transition-all duration-300 ease-out will-change-transform",
                "ring-1 ring-white/10 hover:ring-2 hover:ring-white/80",
                "shadow-lg shadow-black/50 hover:shadow-2xl hover:shadow-indigo-500/40",
                isHovered && !activeZoomItem && "scale-115 -translate-y-2 ring-2 ring-white"
              )}
              style={{
                borderRadius: typeof cardRadius === "number" ? `${cardRadius}px` : cardRadius,
                transform: isHovered && !activeZoomItem ? "scale(1.15) translateY(-6px)" : "scale(1)",
              }}
              onMouseEnter={() => !activeZoomItem && setHoveredCardKey(card.key)}
              onMouseLeave={() => setHoveredCardKey(null)}
              onClick={(e) => handleCardClick(card.item, card.slot, e)}
            >
              {renderCard ? (
                renderCard(card.item, {
                  scale: card.scale,
                  opacity: card.opacity,
                  isFront: card.isFront,
                  isHovered,
                  ringIndex: card.ringIndex,
                  cardIndex: card.cardIndex,
                })
              ) : card.item.content ? (
                card.item.content
              ) : (
                <OrbitGlobeCard item={card.item} />
              )}
            </div>
          </div>
        )
      })}

      {/* ─── Hero Zoom-in Spotlight Overlay ────────────────────────────────────── */}
      <AnimatePresence>
        {activeZoomItem && (
          <motion.div
            key="orbit-globe-zoom-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[100000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
            onClick={() => setZoomItem(null)}
          >
            {/* Click-outside backdrop */}
            <div className="absolute inset-0 cursor-zoom-out" />

            {/* Spotlight Card with Spring Zoom-in */}
            <motion.div
              key={`zoomed-${activeZoomItem.id}`}
              initial={{ scale: 0.4, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] max-h-[78%] overflow-hidden rounded-3xl border border-white/30 bg-[#141418] shadow-2xl shadow-indigo-500/30 flex flex-col cursor-default"
              style={{
                aspectRatio: typeof cardAspect === "string" && cardAspect !== "auto" ? cardAspect.replace(":", " / ") : "3 / 4",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sleek Close Button */}
              <button
                type="button"
                onClick={() => setZoomItem(null)}
                className="absolute right-4 top-4 z-30 flex size-8 items-center justify-center rounded-full bg-black/60 text-white/90 backdrop-blur-md transition-all hover:bg-black hover:text-white hover:scale-110 active:scale-90"
                aria-label="Close zoomed view"
              >
                <X className="size-4" />
              </button>

              {renderZoomedCard ? (
                renderZoomedCard(activeZoomItem, () => setZoomItem(null))
              ) : activeZoomItem.content ? (
                <div className="relative flex h-full w-full flex-col">
                  {/* Card Main View */}
                  <div className="h-full w-full overflow-hidden">{activeZoomItem.content}</div>

                  {/* Extended details bottom drawer if description/href provided */}
                  {(activeZoomItem.description || activeZoomItem.href) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-5 text-white backdrop-blur-xs">
                      {activeZoomItem.title && (
                        <h3 className="text-base font-bold tracking-tight text-white mb-1">
                          {activeZoomItem.title}
                        </h3>
                      )}
                      {activeZoomItem.description && (
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {activeZoomItem.description}
                        </p>
                      )}
                      {activeZoomItem.href && (
                        <a
                          href={activeZoomItem.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                        >
                          Visit link <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-full w-full flex-col justify-between p-6">
                  {activeZoomItem.image && (
                    <img
                      src={activeZoomItem.image}
                      alt={activeZoomItem.title || "Zoomed card"}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  {activeZoomItem.image && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  )}
                  <div className="relative z-10 flex items-center justify-between">
                    {activeZoomItem.subtitle && (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                        {activeZoomItem.subtitle}
                      </span>
                    )}
                  </div>
                  <div className="relative z-10 mt-auto">
                    {activeZoomItem.title && (
                      <h3 className="text-xl font-bold tracking-tight text-white mb-2">
                        {activeZoomItem.title}
                      </h3>
                    )}
                    {activeZoomItem.description && (
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        {activeZoomItem.description}
                      </p>
                    )}
                    {activeZoomItem.href && (
                      <a
                        href={activeZoomItem.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:underline"
                      >
                        Explore link <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

export interface OrbitGlobeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: OrbitGlobeItem
}

export function OrbitGlobeCard({
  item,
  className,
  children,
  ...props
}: OrbitGlobeCardProps) {
  if (children) {
    return (
      <div
        data-slot="orbit-globe-card"
        className={cn("flex h-full w-full items-center justify-center bg-card p-3 text-card-foreground", className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  // Detect image-only card (no text overlays)
  const isOnlyImage = Boolean(item?.image && !item?.title && !item?.subtitle)

  return (
    <div
      data-slot="orbit-globe-card"
      className={cn(
        "relative flex h-full w-full flex-col justify-between overflow-hidden bg-zinc-900/90 text-zinc-100 backdrop-blur-md",
        isOnlyImage ? "p-0" : "p-3",
        className
      )}
      {...props}
    >
      {item?.image && (
        <img
          src={item.image}
          alt={item.title || "Globe card"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      )}

      {/* Dark gradient overlay for text readability ONLY when text is present */}
      {item?.image && (item?.title || item?.subtitle) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      )}

      {item?.subtitle && (
        <div className="relative z-10 flex w-full items-center justify-between">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-300 backdrop-blur-sm">
            {item.subtitle}
          </span>
        </div>
      )}

      {item?.title && (
        <div className="relative z-10 mt-auto">
          <h4 className="text-xs font-semibold leading-tight tracking-tight text-white drop-shadow-sm">
            {item.title}
          </h4>
        </div>
      )}
    </div>
  )
}

export function OrbitGlobeImage({
  src,
  alt = "",
  className,
  ...props
}: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="orbit-globe-image"
      src={src}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  )
}
