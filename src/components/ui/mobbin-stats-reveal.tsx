"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useInView,
} from "framer-motion"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MobbinAppIcon {
  id: string
  name: string
  screens?: string
  flows?: string
  bgColor: string
  textColor?: string
  icon: React.ReactNode
  /** Initial resting coords [x, y] in px from container center on standard 1200x650 viewport */
  initialCoords: [number, number]
  /** Dispersion multiplier on scroll [xFactor, yFactor] */
  dispersion: [number, number]
  /** Randomized base float duration in seconds */
  speed?: number
  /** Randomized multi-axis float displacement [xDelta, yDelta, rotDelta] */
  floatDelta?: [number, number, number]
}

export interface MobbinStatItem {
  value: string
  label: string
}

export interface MobbinStatsRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Top subtitle text */
  title?: string
  /** The 3 stat lines to reveal */
  stats?: MobbinStatItem[]
  /** Array of floating app icons */
  apps?: MobbinAppIcon[]
  /** Number of floating icons to show (default: 12) */
  iconCount?: number
  /** Size of app icon squircles in px (default: 54) */
  iconSize?: number
  /** Overall spread multiplier for floating icon orbit (default: 1.15) */
  iconSpread?: number
  /** Speed multiplier for floating icon oscillation (default: 1.0) */
  iconSpeed?: number
  /** Whether icons use randomized multi-axis wandering motion (default: true) */
  randomMovement?: boolean
  /** Parallax expansion multiplier for icons on scroll (default: 1.0) */
  iconParallax?: number
  /** Distance in px that text travels from bottom side of container. If undefined, computed dynamically from container height */
  textEntryDistance?: number
  /** Controlled progress (0 to 1). If provided, overrides internal progress */
  progress?: number
  /** Callback when progress changes */
  onProgressChange?: (progress: number) => void
  /** Enable gentle ambient floating oscillation (default: true) */
  floatAnimation?: boolean
  /** Enable interactive mouse parallax tilt (default: true) */
  mouseParallax?: boolean
  /** Show animated scroll indicator mouse (default: true) */
  showScrollIndicator?: boolean
  /** Whether the floating icons entrance triggers only once when in view (default: true) */
  triggerOnce?: boolean
  /** Theme styling: "system" | "light" | "dark" (default: "system") */
  themeMode?: "system" | "light" | "dark"
  /** Enable mouse wheel / trackpad scrubbing (default: true) */
  wheelScrub?: boolean
  /** Enable pointer drag scrubbing (default: true) */
  draggable?: boolean
  /** Display mode: "interactive" (embedded/wheel) or "sticky" (full page scroll) */
  mode?: "interactive" | "sticky"
}

// ─── Default Brand SVG Logos ─────────────────────────────────────────────────

function AppleTvIcon() {
  return (
    <div className="flex items-center justify-center font-sans font-bold tracking-tight text-white text-[15px] sm:text-[16px] leading-none select-none">
      <svg className="size-3.5 sm:size-4 fill-current mr-0.5" viewBox="0 0 170 170">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.71-7.94-12.04-14.58-6.19-9.5-11.08-20.2-14.67-32.1-3.6-11.9-5.4-23.01-5.4-33.32 0-14.35 3.59-26.2 10.77-35.56 7.18-9.36 16.14-14.18 26.89-14.46 4.79 0 10.37 1.25 16.74 3.75 6.37 2.5 10.23 3.82 11.58 3.96 1.13-.14 5.25-1.57 12.38-4.29 7.13-2.72 13.06-3.95 17.79-3.7 13.23.82 23.6 5.86 31.11 15.13-11.64 7.03-17.36 16.63-17.15 28.8.21 9.58 3.89 17.65 11.04 24.21 7.15 6.56 15.61 10.35 25.38 11.38-2.18 6.53-4.8 13.03-7.86 19.5zM119.22 31.84c0-7.39 2.68-14.4 8.04-21.03 5.36-6.63 11.96-10.4 19.8-11.31.22 1.3.33 2.5.33 3.6 0 7.32-2.83 14.41-8.49 21.27-5.66 6.86-12.35 10.63-20.08 11.31-.22-1.3-.33-2.5-.33-3.6z" />
      </svg>
      <span>tv</span>
    </div>
  )
}

function TwitchIcon() {
  return (
    <svg className="size-4.5 sm:size-5.5 fill-white" viewBox="0 0 24 24">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  )
}

function AirbnbIcon() {
  return (
    <svg className="size-5 sm:size-6 fill-white" viewBox="0 0 32 32">
      <path d="M16 1c-4.4 0-8 3.6-8 8 0 4.9 5.8 12.8 7.3 14.8.4.5 1 .5 1.4 0 1.5-2 7.3-9.9 7.3-14.8 0-4.4-3.6-8-8-8zm0 11.5c-2 0-3.5-1.5-3.5-3.5S14 5.5 16 5.5s3.5 1.5 3.5 3.5-1.5 3.5-3.5 3.5z" />
    </svg>
  )
}

function DropboxIcon() {
  return (
    <svg className="size-4.5 sm:size-5.5 fill-white" viewBox="0 0 24 24">
      <path d="M6 2l6 3.9L6 9.8 0 5.9 6 2zm12 0l6 3.9-6 3.9-6-3.9 6-3.9zM0 13.7l6-3.9 6 3.9-6 3.9-6-3.9zm24 0l-6-3.9-6 3.9 6 3.9 6-3.9zM6 19.1l6-3.9 6 3.9-6 3.9-6-3.9z" />
    </svg>
  )
}

function NikeIcon() {
  return (
    <svg className="size-5.5 sm:size-6.5 fill-neutral-900" viewBox="0 0 24 24">
      <path d="M21.707 5.293c-2.457 1.96-6.425 4.698-10.967 7.502-3.132 1.933-5.26 2.898-6.383 2.898-.823 0-1.412-.416-1.767-1.248-.372-.871-.168-1.996.611-3.376 1.487-2.634 3.738-4.819 6.753-6.555-5.32 1.956-9.14 5.378-9.957 8.283-.497 1.767-.184 3.23.938 4.39.992 1.026 2.45 1.54 4.373 1.54 1.758 0 4.14-.852 7.146-2.556 4.97-2.819 9.388-6.592 12.353-10.928-.707-.014-1.74.02-3.1.05z" />
    </svg>
  )
}

function WiseIcon() {
  return (
    <svg className="size-4.5 sm:size-5.5 fill-black" viewBox="0 0 24 24">
      <path d="M3.5 3h16.2l-6.8 18h-4.8l4.4-11.6H7.8l-1.6 4.2H2.6L5.5 6.6H3.5V3z" />
    </svg>
  )
}

function ChatGptIcon() {
  return (
    <svg className="size-4.5 sm:size-5.5 fill-neutral-900" viewBox="0 0 24 24">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.771-4.205 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.746-7.074zM13.26 22.63a4.678 4.678 0 0 1-2.946-1.047l.142-.08 4.926-2.844a.684.684 0 0 0 .342-.593v-6.953l2.091 1.207a.066.066 0 0 1 .035.05v5.748a4.708 4.708 0 0 1-4.59 4.512zM3.82 17.652a4.654 4.654 0 0 1-.57-3.076l.141.085 4.926 2.844a.688.688 0 0 0 .684 0l6.02-3.476v2.414a.067.067 0 0 1-.027.054l-4.978 2.874a4.708 4.708 0 0 1-6.196-1.72zM2.87 8.79a4.683 4.683 0 0 1 2.37-2.028l-.004.164v5.688a.684.684 0 0 0 .342.593l6.02 3.476-2.091 1.207a.066.066 0 0 1-.061 0L4.47 15.015a4.708 4.708 0 0 1-1.6-6.225zm14.733 3.476l-6.02-3.476 2.091-1.207a.066.066 0 0 1 .061 0l4.977 2.874a4.708 4.708 0 0 1-.417 8.257v-5.855a.684.684 0 0 0-.342-.593l-.35-.2zM19.98 9.387l-.141-.085-4.926-2.844a.688.688 0 0 0-.684 0L8.21 9.934V7.52a.067.067 0 0 1 .027-.054l4.978-2.874a4.708 4.708 0 0 1 6.765 4.795zm-9.24-2.017a4.678 4.678 0 0 1 2.946 1.047l-.142.08-4.926 2.844a.684.684 0 0 0-.342.593v6.953l-2.091-1.207a.066.066 0 0 1-.035-.05V11.88a4.708 4.708 0 0 1 4.59-4.51z" />
    </svg>
  )
}

function MailchimpIcon() {
  return (
    <svg className="size-5.5 sm:size-6.5 fill-neutral-900" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2.5-5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7 0c-.83 0-1.5-.67-1.5-1.5S7.67 8 8.5 8s1.5.67 1.5 1.5S9.33 11 8.5 11z" />
    </svg>
  )
}

function RevolutIcon() {
  return (
    <div className="flex items-center justify-center font-black text-white text-base sm:text-lg font-sans select-none">
      R
    </div>
  )
}

function CremeIcon() {
  return (
    <div className="flex flex-col items-center justify-center font-black text-white text-[8px] sm:text-[9px] leading-tight tracking-tighter uppercase font-mono select-none">
      <span>CRÈ</span>
      <span>ME</span>
    </div>
  )
}

function HeadspaceIcon() {
  return <div className="size-4.5 sm:size-5.5 rounded-full bg-[#f47d31]" />
}

function LinearIcon() {
  return (
    <svg className="size-4.5 sm:size-5.5 fill-white" viewBox="0 0 24 24">
      <path d="M3.24 3.24a1.5 1.5 0 0 1 2.12 0l15.4 15.4a1.5 1.5 0 0 1-2.12 2.12L3.24 5.36a1.5 1.5 0 0 1 0-2.12z" />
      <path d="M8.5 3.5a1.5 1.5 0 0 1 2.12 0l9.88 9.88a1.5 1.5 0 0 1-2.12 2.12L8.5 5.62a1.5 1.5 0 0 1 0-2.12z" opacity="0.6" />
    </svg>
  )
}

// ─── Default Calibrated Perimeter Coordinates (Safe Distance from Central Text) ─

export const defaultMobbinApps: MobbinAppIcon[] = [
  {
    id: "mailchimp",
    name: "Mailchimp",
    screens: "510 screens",
    flows: "26 flows",
    bgColor: "#ffe01b",
    textColor: "#000000",
    icon: <MailchimpIcon />,
    initialCoords: [-480, -180],
    dispersion: [-0.6, -0.4],
    speed: 4.8,
  },
  {
    id: "linear",
    name: "Linear",
    screens: "680 screens",
    flows: "35 flows",
    bgColor: "#000000",
    textColor: "#ffffff",
    icon: <LinearIcon />,
    initialCoords: [-240, -220],
    dispersion: [-0.3, -0.6],
    speed: 3.6,
  },
  {
    id: "apple-tv",
    name: "Apple TV",
    screens: "540 screens",
    flows: "28 flows",
    bgColor: "#141414",
    textColor: "#ffffff",
    icon: <AppleTvIcon />,
    initialCoords: [250, -220],
    dispersion: [0.3, -0.6],
    speed: 5.4,
  },
  {
    id: "twitch",
    name: "Twitch",
    screens: "820 screens",
    flows: "42 flows",
    bgColor: "#9146ff",
    textColor: "#ffffff",
    icon: <TwitchIcon />,
    initialCoords: [480, -190],
    dispersion: [0.6, -0.5],
    speed: 4.2,
  },
  {
    id: "headspace",
    name: "Headspace",
    screens: "390 screens",
    flows: "19 flows",
    bgColor: "#ffffff",
    textColor: "#111111",
    icon: <HeadspaceIcon />,
    initialCoords: [490, -15],
    dispersion: [0.7, -0.1],
    speed: 6.2,
  },
  {
    id: "creme",
    name: "Crème",
    screens: "210 screens",
    flows: "14 flows",
    bgColor: "#171717",
    textColor: "#ffffff",
    icon: <CremeIcon />,
    initialCoords: [-490, -15],
    dispersion: [-0.7, 0],
    speed: 3.9,
  },
  {
    id: "revolut",
    name: "Revolut",
    screens: "940 screens",
    flows: "49 flows",
    bgColor: "#191c24",
    textColor: "#ffffff",
    icon: <RevolutIcon />,
    initialCoords: [-430, 110],
    dispersion: [-0.6, 0.2],
    speed: 5.8,
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    screens: "360 screens",
    flows: "18 flows",
    bgColor: "#ffffff",
    textColor: "#111111",
    icon: <ChatGptIcon />,
    initialCoords: [-380, 220],
    dispersion: [-0.6, 0.5],
    speed: 4.5,
  },
  {
    id: "wise",
    name: "Wise",
    screens: "480 screens",
    flows: "24 flows",
    bgColor: "#9fe870",
    textColor: "#000000",
    icon: <WiseIcon />,
    initialCoords: [-190, 230],
    dispersion: [-0.3, 0.6],
    speed: 6.6,
  },
  {
    id: "dropbox",
    name: "Dropbox",
    screens: "630 screens",
    flows: "31 flows",
    bgColor: "#0061fe",
    textColor: "#ffffff",
    icon: <DropboxIcon />,
    initialCoords: [120, 240],
    dispersion: [0.2, 0.7],
    speed: 3.4,
  },
  {
    id: "airbnb",
    name: "Airbnb",
    screens: "1,120 screens",
    flows: "58 flows",
    bgColor: "#ff385c",
    textColor: "#ffffff",
    icon: <AirbnbIcon />,
    initialCoords: [340, 210],
    dispersion: [0.5, 0.6],
    speed: 5.1,
  },
  {
    id: "nike",
    name: "Nike",
    screens: "740 screens",
    flows: "36 flows",
    bgColor: "#ffffff",
    textColor: "#111111",
    icon: <NikeIcon />,
    initialCoords: [470, 160],
    dispersion: [0.7, 0.4],
    speed: 4.7,
  },
]

export const defaultMobbinStats: MobbinStatItem[] = [
  { value: "1,428", label: "apps" },
  { value: "621,500+", label: "screens" },
  { value: "323,900", label: "flows" },
]

// ─── Component Implementation ────────────────────────────────────────────────

function getRevealProps(
  progress: number,
  start: number,
  end: number,
  options: { yOffset: number; blur?: number; minScale?: number }
) {
  const { yOffset, blur = 8, minScale = 0.94 } = options
  if (progress <= start) {
    return {
      opacity: 0,
      y: yOffset,
      scale: minScale,
      filter: `blur(${blur}px)`,
      pointerEvents: "none" as const,
      isFixed: false,
    }
  }
  if (progress >= end) {
    return {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      pointerEvents: "auto" as const,
      isFixed: true,
    }
  }
  const t = Math.min(1, Math.max(0, (progress - start) / (end - start)))
  // Smooth quartic deceleration: glides up swiftly from the bottom and locks softly into position
  const eased = 1 - Math.pow(1 - t, 4)
  return {
    opacity: Math.min(1, t * 1.6),
    y: (1 - eased) * yOffset,
    scale: minScale + eased * (1 - minScale),
    filter: t >= 0.92 ? "blur(0px)" : `blur(${((1 - eased) * blur).toFixed(1)}px)`,
    pointerEvents: eased > 0.85 ? ("auto" as const) : ("none" as const),
    isFixed: false,
  }
}

// ─── Individual Floating Icon with Organic Non-Pendulum 2D Orbit ────────────

interface FloatingIconItemProps {
  app: MobbinAppIcon
  index: number
  hasEntered: boolean
  iconSize: number
  iconSpread: number
  iconSpeed: number
  randomMovement: boolean
  floatAnimation: boolean
  widthRatio: number
  heightRatio: number
  containerWidth: number
  containerHeight: number
  activeProgress: number
  iconParallax: number
  hoveredApp: MobbinAppIcon | null
  onHover: (app: MobbinAppIcon | null) => void
}

function FloatingIconItem({
  app,
  index,
  hasEntered,
  iconSize,
  iconSpread,
  iconSpeed,
  randomMovement,
  floatAnimation,
  widthRatio,
  heightRatio,
  containerWidth,
  containerHeight,
  activeProgress,
  iconParallax,
  hoveredApp,
  onHover,
}: FloatingIconItemProps) {
  // Deterministic seed generation for unique float traits per icon
  const floatConfig = React.useMemo(() => {
    const s1 = (index * 7 + 13) % 17
    const s2 = (index * 11 + 5) % 19
    const s3 = (index * 13 + 3) % 23

    // Varied random wandering radii (Mobbin style Lissajous orbit)
    const radiusX = 18 + (s1 / 17) * 28 // 18px to 46px
    const radiusY = 12 + (s2 / 19) * 22 // 12px to 34px
    // Varied random base duration (individual organic speeds)
    const duration = 7.5 + (s3 / 23) * 9.5 // 7.5s to 17s
    const phaseX = (s1 / 17) * Math.PI * 2
    const phaseY = ((s2 + 4) / 19) * Math.PI * 2
    const phaseRot = (s3 / 23) * Math.PI * 2
    const rotRadius = 2 + (s1 / 17) * 4

    return {
      radiusX,
      radiusY,
      duration,
      phaseX,
      phaseY,
      phaseRot,
      rotRadius,
    }
  }, [index])

  const floatX = useMotionValue(0)
  const floatY = useMotionValue(0)
  const floatRot = useMotionValue(0)

  // Continuous organic 2D drift using harmonic trigonometric oscillation (NO pendulum reversal!)
  React.useEffect(() => {
    if (!floatAnimation || !hasEntered) {
      floatX.set(0)
      floatY.set(0)
      floatRot.set(0)
      return
    }

    let rafId: number
    const startTime = performance.now()
    const speedFactor = Math.max(0.2, iconSpeed)
    const effectiveDuration = floatConfig.duration / speedFactor

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000
      const angle = (elapsed / effectiveDuration) * Math.PI * 2

      if (randomMovement) {
        // Continuous non-reversing 2D Lissajous orbit with asymmetric phase offsets
        const curX = Math.sin(angle + floatConfig.phaseX) * floatConfig.radiusX * Math.min(1.3, iconSpread)
        const curY = Math.cos(angle + floatConfig.phaseY) * floatConfig.radiusY * Math.min(1.3, iconSpread)
        const curRot = Math.sin(angle * 0.75 + floatConfig.phaseRot) * floatConfig.rotRadius
        floatX.set(curX)
        floatY.set(curY)
        floatRot.set(curRot)
      } else {
        // Simple uniform float
        const curY = Math.sin(angle) * 8
        floatX.set(0)
        floatY.set(curY)
        floatRot.set(0)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [floatAnimation, hasEntered, iconSpeed, iconSpread, randomMovement, floatConfig, floatX, floatY, floatRot])

  // Responsive scaled resting coordinates outside central text boundary
  const [baseX, baseY] = app.initialCoords
  const [dispX, dispY] = app.dispersion

  const scaledX = baseX * iconSpread * widthRatio
  const scaledY = baseY * iconSpread * heightRatio

  const scrollParallaxX = dispX * activeProgress * 24 * iconParallax
  const scrollParallaxY = dispY * activeProgress * 24 * iconParallax

  const targetX = scaledX + scrollParallaxX
  const targetY = scaledY + scrollParallaxY

  // Ensure icons NEVER clip outside the container bounds on any screen size
  const halfW = containerWidth > 0 ? containerWidth / 2 : 500
  const halfH = containerHeight > 0 ? containerHeight / 2 : 250
  const margin = iconSize / 2 + 8
  const maxX = Math.max(20, halfW - margin)
  const maxY = Math.max(20, halfH - margin)
  const boundedX = Math.max(-maxX, Math.min(maxX, targetX))
  const boundedY = Math.max(-maxY, Math.min(maxY, targetY))

  const isHovered = hoveredApp?.id === app.id

  return (
    <motion.div
      className="absolute pointer-events-auto"
      style={{
        zIndex: isHovered ? 40 : 10,
      }}
      initial={{
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
      }}
      animate={
        hasEntered
          ? {
              x: boundedX,
              y: boundedY,
              scale: 1,
              opacity: 1,
            }
          : {
              x: 0,
              y: 0,
              scale: 0,
              opacity: 0,
            }
      }
      transition={{
        type: "spring",
        stiffness: 85,
        damping: 18,
        mass: 0.6,
        delay: hasEntered ? index * 0.04 : 0,
      }}
      onMouseEnter={() => hasEntered && onHover(app)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ scale: 1.15, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Motion values apply float offset without React re-renders */}
      <motion.div
        style={{
          x: floatX,
          y: floatY,
          rotate: floatRot,
        }}
      >
        {/* App Icon Squircle */}
        <div
          className="relative flex items-center justify-center cursor-pointer transition-shadow duration-300"
          style={{
            width: iconSize,
            height: iconSize,
            backgroundColor: app.bgColor,
            borderRadius: Math.round(iconSize * 0.32),
            boxShadow: isHovered
              ? "0 18px 40px -8px rgba(0,0,0,0.4), 0 6px 14px rgba(0,0,0,0.2)"
              : "0 8px 22px -6px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {app.icon}
        </div>

        {/* Hover Details Floating Badge */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.92 }}
              animate={{ opacity: 1, y: -6, scale: 1 }}
              exit={{ opacity: 0, y: 2, scale: 0.95 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-50 px-2.5 py-1 rounded-full bg-neutral-900/90 dark:bg-white/95 text-white dark:text-neutral-950 backdrop-blur-md text-[11px] font-medium shadow-xl border border-white/10 dark:border-black/10 flex items-center gap-1.5"
            >
              <span className="font-semibold">{app.name}</span>
              {app.screens && (
                <>
                  <span className="opacity-40">•</span>
                  <span className="opacity-80 font-mono text-[10px]">{app.screens}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Main MobbinStatsReveal Component ───────────────────────────────────────

export function MobbinStatsReveal({
  title = "A growing library of",
  stats = defaultMobbinStats,
  apps = defaultMobbinApps,
  iconCount = 12,
  iconSize = 54,
  iconSpread = 1.15,
  iconSpeed = 1.0,
  randomMovement = true,
  iconParallax = 1.0,
  textEntryDistance,
  progress: controlledProgress,
  onProgressChange,
  wheelScrub = true,
  draggable = true,
  floatAnimation = true,
  mouseParallax = true,
  showScrollIndicator = true,
  triggerOnce = true,
  themeMode = "system",
  mode = "interactive",
  className,
  style,
  ...rest
}: MobbinStatsRevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: triggerOnce, amount: 0.15 })
  const [hasEntered, setHasEntered] = React.useState(false)
  const [internalProgress, setInternalProgress] = React.useState(0)
  const [hoveredApp, setHoveredApp] = React.useState<MobbinAppIcon | null>(null)
  const [containerSize, setContainerSize] = React.useState({ width: 1200, height: 600 })
  const touchStartY = React.useRef<number>(0)

  // Trigger icon entrance bloom once when in view
  React.useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setHasEntered(true), 60)
      return () => clearTimeout(timer)
    } else if (!triggerOnce) {
      setHasEntered(false)
    }
  }, [isInView, triggerOnce])

  // Measure container dimensions continuously for responsive scaling & entry calculation
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Active progress: controlled or internal (drives text reveals)
  const activeProgress = controlledProgress !== undefined ? controlledProgress : internalProgress

  const setProgress = React.useCallback(
    (val: number) => {
      const clamped = Math.max(0, Math.min(1, val))
      if (controlledProgress === undefined) {
        setInternalProgress(clamped)
      }
      onProgressChange?.(clamped)
    },
    [controlledProgress, onProgressChange]
  )

  // ─── Non-Passive Native Mouse Wheel / Trackpad Scrubbing ─────────────────
  React.useEffect(() => {
    const el = containerRef.current
    if (!el || mode !== "interactive" || !wheelScrub) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.0016, 0.07)
      const current = controlledProgress !== undefined ? controlledProgress : internalProgress
      const next = Math.max(0, Math.min(1, current + delta))
      setProgress(next)
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel)
    }
  }, [mode, wheelScrub, controlledProgress, internalProgress, setProgress])

  // ─── Pointer Drag Scrubbing ──────────────────────────────────────────────
  const isDraggingRef = React.useRef(false)
  const dragStartYRef = React.useRef(0)
  const dragStartProgressRef = React.useRef(0)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== "interactive" || !draggable) return
    if ((e.target as HTMLElement).closest("input, button, a")) return
    isDraggingRef.current = true
    dragStartYRef.current = e.clientY
    dragStartProgressRef.current = controlledProgress !== undefined ? controlledProgress : internalProgress
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    const deltaY = dragStartYRef.current - e.clientY
    const deltaProgress = deltaY * 0.0028
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

  // ─── Touch Scrubbing for Mobile ──────────────────────────────────────────
  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      if (mode !== "interactive" || !draggable) return
      const currentY = e.touches[0].clientY
      const delta = (touchStartY.current - currentY) * 0.003
      touchStartY.current = currentY
      const current = controlledProgress !== undefined ? controlledProgress : internalProgress
      setProgress(current + delta)
    },
    [mode, draggable, controlledProgress, internalProgress, setProgress]
  )

  // ─── Mouse Tilt Parallax ─────────────────────────────────────────────────
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 90, damping: 22 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 90, damping: 22 })

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mouseParallax || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
      mouseX.set(x * 14)
      mouseY.set(y * 14)
    },
    [mouseParallax, mouseX, mouseY]
  )

  const handleMouseLeave = React.useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Container dimensions with sensible responsive fallbacks
  const cWidth = containerSize.width > 0 ? containerSize.width : 600
  const cHeight = containerSize.height > 0 ? containerSize.height : 400

  // Visible icons slice (adapts smoothly for small screens)
  const maxIconsForViewport = cWidth < 450 ? Math.min(iconCount, 4) : cWidth < 650 ? Math.min(iconCount, 7) : iconCount
  const visibleApps = React.useMemo(() => {
    return apps.slice(0, Math.min(apps.length, maxIconsForViewport))
  }, [apps, maxIconsForViewport])

  // Scale icon distribution smoothly with container width and height
  const widthRatio = Math.min(1.15, Math.max(0.28, cWidth / 1150))
  const heightRatio = Math.min(1.15, Math.max(0.35, cHeight / 600))

  const responsiveIconSize = Math.max(
    28,
    Math.min(iconSize, Math.round(iconSize * Math.min(widthRatio * 1.05, heightRatio * 1.05)))
  )

  // Find longest stat string to ensure every possible text combination fits without clipping
  const maxStatChars = React.useMemo(() => {
    let maxLen = 16 // default for "621,500+ screens"
    for (const s of stats) {
      const len = (s.value?.length || 0) + (s.label?.length || 0) + 1
      if (len > maxLen) maxLen = len
    }
    return maxLen
  }, [stats])

  // Calculate safe proportional font sizes so text NEVER clips regardless of container size:
  // In bold/black sans, 1 character is ~0.62 * fontSize. We want total width <= 84% of container width.
  const widthBasedFontSize = (cWidth * 0.84) / (maxStatChars * 0.62)
  // Vertically, 3 stats lines + subtitle + gaps must comfortably fit within 60% of container height.
  const heightBasedFontSize = (cHeight * 0.58) / 3.8

  const dynamicNumberSize = Math.max(
    18,
    Math.min(72, Math.round(Math.min(widthBasedFontSize, heightBasedFontSize)))
  )
  const dynamicLabelSize = Math.max(15, Math.round(dynamicNumberSize * 0.84))
  const dynamicTitleSize = Math.max(11, Math.min(16, Math.round(dynamicNumberSize * 0.28)))
  const dynamicLineGap = Math.max(4, Math.min(14, Math.round(dynamicNumberSize * 0.22)))
  const dynamicLineMinHeight = Math.round(dynamicNumberSize * 1.1)

  // Calculate dynamic entry distance: GUARANTEES text emerges from beyond the bottom boundary of the container/viewport
  const dynamicEntryY = containerSize.height > 0 ? Math.round(containerSize.height / 2 + 50) : 260
  const effectiveEntryDistance = textEntryDistance ?? dynamicEntryY

  // Color theme logic
  const isLight = themeMode === "light"
  const isDark = themeMode === "dark"

  const numberColor = isLight
    ? "text-neutral-950"
    : isDark
    ? "text-white"
    : "text-neutral-950 dark:text-white"

  const labelColor = isLight
    ? "text-neutral-800"
    : isDark
    ? "text-neutral-200"
    : "text-neutral-800 dark:text-neutral-200"

  const titleColor = isLight
    ? "text-neutral-500"
    : isDark
    ? "text-neutral-400"
    : "text-neutral-500 dark:text-neutral-400"

  // ─── Choreographed Scroll-Based Reveal Ranges: Arise from bottom and lock into fixed position ──
  // Subtitle emerges first from lower-mid zone (0.02 -> 0.16)
  const titleReveal = getRevealProps(activeProgress, 0.02, 0.16, {
    yOffset: Math.min(80, effectiveEntryDistance * 0.35),
    blur: 6,
    minScale: 0.95,
  })

  // Stat 1: "1,428 apps" glides from bottom of viewport and locks into fixed slot (0.12 -> 0.38)
  const stat1Reveal = getRevealProps(activeProgress, 0.12, 0.38, {
    yOffset: effectiveEntryDistance,
    blur: 8,
    minScale: 0.93,
  })

  // Stat 2: "621,500+ screens" glides from bottom of viewport and locks into fixed slot (0.38 -> 0.66)
  const stat2Reveal = getRevealProps(activeProgress, 0.38, 0.66, {
    yOffset: effectiveEntryDistance + 30,
    blur: 8,
    minScale: 0.93,
  })

  // Stat 3: "323,900 flows" glides from bottom of viewport and locks into fixed slot (0.66 -> 0.94)
  const stat3Reveal = getRevealProps(activeProgress, 0.66, 0.94, {
    yOffset: effectiveEntryDistance + 60,
    blur: 8,
    minScale: 0.93,
  })

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={mode === "interactive" ? handleTouchStart : undefined}
      onTouchMove={mode === "interactive" ? handleTouchMove : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative isolate w-full h-full min-h-[260px] flex flex-col items-center justify-center overflow-hidden select-none outline-none @container",
        mode === "interactive" && draggable && "cursor-grab active:cursor-grabbing",
        isLight
          ? "bg-[#f7f7f8]"
          : isDark
          ? "bg-[#0c0c0e]"
          : "bg-[#f7f7f8] dark:bg-[#0c0c0e]",
        className
      )}
      style={style}
      role="region"
      aria-label="Mobbin Stats Reveal section"
      tabIndex={0}
      {...rest}
    >
      {/* ─── Ambient Glow / Mesh Backdrop ──────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[440px] rounded-full blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, #a855f7 50%, transparent 70%)",
          }}
          animate={{
            opacity: hasEntered ? (isLight ? 0.08 : 0.05) : 0,
            scale: hasEntered ? 1.0 + activeProgress * 0.2 : 0.8,
          }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* ─── Floating App Icons: Trigger Once On View & Wander with Organic 2D Orbits ────────── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {visibleApps.map((app, index) => (
          <FloatingIconItem
            key={app.id}
            app={app}
            index={index}
            hasEntered={hasEntered}
            iconSize={responsiveIconSize}
            iconSpread={iconSpread}
            iconSpeed={iconSpeed}
            randomMovement={randomMovement}
            floatAnimation={floatAnimation}
            widthRatio={widthRatio}
            heightRatio={heightRatio}
            containerWidth={containerSize.width}
            containerHeight={containerSize.height}
            activeProgress={activeProgress}
            iconParallax={iconParallax}
            hoveredApp={hoveredApp}
            onHover={setHoveredApp}
          />
        ))}
      </div>

      {/* ─── Central Reveal Text Block ─────────────────────────────── */}
      {/* 
        NO overflow-hidden on internal line wrappers!
        This allows the text lines to visibly travel all the way from the container bottom into position.
        The outer parent container handles overflow containment.
      */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center text-center px-2 sm:px-4 w-full max-w-full pointer-events-none"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          gap: `${dynamicLineGap}px`,
        }}
      >
        {/* Subtitle Header Slot */}
        <div className="relative flex items-center justify-center min-h-[18px]">
          <motion.p
            className={cn(
              "font-medium tracking-tight whitespace-nowrap select-none",
              titleColor
            )}
            style={{
              fontSize: `${dynamicTitleSize}px`,
              lineHeight: 1.2,
            }}
            animate={{
              opacity: titleReveal.opacity,
              y: titleReveal.y,
              scale: titleReveal.scale,
              filter: titleReveal.filter,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
          >
            {title}
          </motion.p>
        </div>

        {/* ─── Stat 1: "1,428 apps" (comes from container bottom and gets fixed) ─── */}
        {stats[0] && (
          <div
            className="relative flex items-center justify-center w-full"
            style={{ minHeight: `${dynamicLineMinHeight}px` }}
          >
            <motion.div
              className="flex items-baseline justify-center gap-1.5 sm:gap-3 whitespace-nowrap max-w-full"
              animate={{
                opacity: stat1Reveal.opacity,
                y: stat1Reveal.y,
                scale: stat1Reveal.scale,
                filter: stat1Reveal.filter,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
            >
              <h2
                className={cn("font-black tracking-tight font-sans leading-none select-none", numberColor)}
                style={{
                  fontSize: `${dynamicNumberSize}px`,
                  lineHeight: 1.05,
                }}
              >
                {stats[0].value}
              </h2>
              <span
                className={cn("font-bold tracking-tight leading-none select-none", labelColor)}
                style={{
                  fontSize: `${dynamicLabelSize}px`,
                  lineHeight: 1.05,
                }}
              >
                {stats[0].label}
              </span>
            </motion.div>
          </div>
        )}

        {/* ─── Stat 2: "621,500+ screens" (comes from container bottom and gets fixed) ─── */}
        {stats[1] && (
          <div
            className="relative flex items-center justify-center w-full"
            style={{ minHeight: `${dynamicLineMinHeight}px` }}
          >
            <motion.div
              className="flex items-baseline justify-center gap-1.5 sm:gap-3 whitespace-nowrap max-w-full"
              animate={{
                opacity: stat2Reveal.opacity,
                y: stat2Reveal.y,
                scale: stat2Reveal.scale,
                filter: stat2Reveal.filter,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
            >
              <h2
                className={cn("font-black tracking-tight font-sans leading-none select-none", numberColor)}
                style={{
                  fontSize: `${dynamicNumberSize}px`,
                  lineHeight: 1.05,
                }}
              >
                {stats[1].value}
              </h2>
              <span
                className={cn("font-bold tracking-tight leading-none select-none", labelColor)}
                style={{
                  fontSize: `${dynamicLabelSize}px`,
                  lineHeight: 1.05,
                }}
              >
                {stats[1].label}
              </span>
            </motion.div>
          </div>
        )}

        {/* ─── Stat 3: "323,900 flows" (comes from container bottom and gets fixed) ─── */}
        {stats[2] && (
          <div
            className="relative flex items-center justify-center w-full"
            style={{ minHeight: `${dynamicLineMinHeight}px` }}
          >
            <motion.div
              className="flex items-baseline justify-center gap-1.5 sm:gap-3 whitespace-nowrap max-w-full"
              animate={{
                opacity: stat3Reveal.opacity,
                y: stat3Reveal.y,
                scale: stat3Reveal.scale,
                filter: stat3Reveal.filter,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
            >
              <h2
                className={cn("font-black tracking-tight font-sans leading-none select-none", numberColor)}
                style={{
                  fontSize: `${dynamicNumberSize}px`,
                  lineHeight: 1.05,
                }}
              >
                {stats[2].value}
              </h2>
              <span
                className={cn("font-bold tracking-tight leading-none select-none", labelColor)}
                style={{
                  fontSize: `${dynamicLabelSize}px`,
                  lineHeight: 1.05,
                }}
              >
                {stats[2].label}
              </span>
            </motion.div>
          </div>
        )}

        {/* ─── Scroll Indicator Mouse Icon (Visible at 0% to invite scroll) ─── */}
        {showScrollIndicator && (
          <motion.div
            className="mt-2 sm:mt-3 flex flex-col items-center gap-1"
            animate={{
              opacity: activeProgress <= 0.12 ? 1 - activeProgress * 7 : 0,
              y: [0, 4, 0],
            }}
            transition={{
              y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.25 },
            }}
            style={{
              pointerEvents: activeProgress <= 0.12 ? "auto" : "none",
            }}
          >
            <div className="w-4 h-6 sm:w-5 sm:h-7 rounded-full border-2 border-neutral-400 dark:border-neutral-500 flex items-start justify-center p-0.5 sm:p-1">
              <motion.div
                className="w-1 h-1.5 rounded-full bg-neutral-600 dark:bg-neutral-300"
                animate={{ y: [0, 2.5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
              Scroll or scrub to explore
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* ─── Interactive Scrubbing Slider Control Pill (Bottom) ───── */}
      {mode === "interactive" && controlledProgress === undefined && (
        <div className="absolute bottom-5 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl border border-neutral-300/60 dark:border-white/[0.08] shadow-lg text-xs">
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              Scrub
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={activeProgress}
              onChange={(e) => setProgress(parseFloat(e.target.value))}
              className="w-24 sm:w-32 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-white"
              aria-label="Reveal progress slider"
            />
            <span className="font-mono text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 w-8 text-right">
              {Math.round(activeProgress * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
