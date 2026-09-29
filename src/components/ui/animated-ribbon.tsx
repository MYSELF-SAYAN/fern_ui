"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  TYPES                                                                     */
/* ═══════════════════════════════════════════════════════════════════════════ */

export interface AnimatedRibbonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text content that flows along the ribbon path */
  text?: string
  /** Animation speed — pixels per second along the path */
  speed?: number
  /** Thickness of the solid ribbon band in SVG units */
  ribbonWidth?: number
  /** Font size of the flowing text */
  fontSize?: number
  /** Font family */
  fontFamily?: string
  /** Letter spacing in SVG units */
  letterSpacing?: number
  /** Opacity of text in the loop section (0–1) */
  loopTextOpacity?: number

  /* ── Theme-aware colors ─────────────────────────────────────────────── */
  /** Ribbon band color. Defaults to var(--foreground). */
  ribbonColor?: string
  /** Text color on the ribbon. Defaults to var(--background). */
  ribbonTextColor?: string
  /** Text color on the loop section. Defaults to var(--muted-foreground). */
  loopTextColor?: string

  /* ── Curve controls ─────────────────────────────────────────────────── */
  /** X-center of the spiral loop as % of width (0–100) */
  loopX?: number
  /** Y-center of the spiral loop as % of height (0–100) */
  loopY?: number
  /** Size of the spiral loop (10–80) */
  loopSize?: number
  /** Angle of the ribbon exit in degrees (0–60) */
  ribbonAngle?: number
  /** Curvature of the ribbon (0 = straight, 1 = very curved) */
  ribbonCurve?: number
  /** Where along the full path the capsule is placed (0–1) */
  capsuleAt?: number

  /* ── View & Zoom ─────────────────────────────────────────────────────── */
  /** Zoom scale of the ribbon view (0.5–2.5). Higher values zoom in closer on the ribbon and text. Default is 1.3. */
  zoom?: number
  /** Horizontal pan offset in SVG units (-400 to 400). Default is 0. */
  panX?: number
  /** Vertical pan offset in SVG units (-200 to 200). Default is 0. */
  panY?: number

  /* ── Capsule ────────────────────────────────────────────────────────── */
  /** Custom capsule content — receives no props, replaces default waveform */
  capsuleContent?: React.ReactNode
  /** Show or hide the capsule widget */
  showCapsule?: boolean

  /* ── Animation ──────────────────────────────────────────────────────── */
  /** Pause the animation */
  paused?: boolean
  /** Direction of text flow */
  direction?: "ltr" | "rtl"
  /** Number of text repetitions to ensure seamless coverage */
  textRepeat?: number
  /** Full custom SVG path `d` attribute — overrides loopX/Y/Size/ribbonAngle */
  customPath?: string
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  CONSTANTS                                                                 */
/* ═══════════════════════════════════════════════════════════════════════════ */

const VW = 1600
const VH = 800

const DEFAULT_TEXT =
  "notes from yesterday's meeting were sent out, or if they're still waiting? I think they're going to handle the first part of the project, but I'm not sure if the whole thing should be ready by Friday — although it might slip. The whole thing's been kind of chaotic, like nobody really knows what's going on so can you check in with them and see if the deadline is going to slip. There's been a lot of back and forth and honestly."

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PATH GENERATION                                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */

function buildRibbonPath(
  loopX: number,
  loopY: number,
  loopSize: number,
  ribbonAngle: number,
  ribbonCurve: number
) {
  const cx = (loopX / 100) * VW
  const cy = (loopY / 100) * VH
  const r = (loopSize / 100) * 300

  // Junction point — where loop meets ribbon, capsule sits here
  const jx = VW * 0.47
  const jy = VH * 0.76

  // Ribbon exit
  const ang = (ribbonAngle * Math.PI) / 180
  const exitX = VW + 200
  const exitY = Math.max(40, jy - Math.tan(ang) * (exitX - jx))

  // Bezier magic number for circular quarter-arcs
  const k = 0.5522847498

  // Ribbon curvature offset
  const rc = ribbonCurve * 120

  return [
    // ── Entry from off-screen bottom-left ──────────────────────
    `M ${-80} ${jy + 80}`,
    `C ${cx - r * 1.8} ${jy + 20}, ${cx - r * 1.4} ${cy + r * 1.1}, ${cx - r} ${cy}`,

    // ── Loop: left → top ───────────────────────────────────────
    `C ${cx - r} ${cy - r * k}, ${cx - r * k} ${cy - r}, ${cx} ${cy - r}`,

    // ── Loop: top → right ──────────────────────────────────────
    `C ${cx + r * k} ${cy - r}, ${cx + r} ${cy - r * k}, ${cx + r} ${cy}`,

    // ── Loop: right → bottom ───────────────────────────────────
    `C ${cx + r} ${cy + r * k}, ${cx + r * k} ${cy + r}, ${cx} ${cy + r}`,

    // ── Spiral inward from bottom ──────────────────────────────
    `C ${cx - r * 0.35} ${cy + r * 0.65}, ${cx - r * 0.15} ${cy - r * 0.05}, ${cx + r * 0.05} ${cy - r * 0.25}`,

    // ── Inner spiral exit to the right and down ────────────────
    `C ${cx + r * 0.25} ${cy - r * 0.5}, ${cx + r * 0.55} ${cy - r * 0.08}, ${cx + r * 0.55} ${cy + r * 0.4}`,

    // ── Down to capsule junction ───────────────────────────────
    `Q ${cx + r * 0.7} ${jy - 30}, ${jx} ${jy}`,

    // ── Through capsule → ribbon start ─────────────────────────
    `Q ${jx + 80} ${jy + 12}, ${jx + 200} ${jy - 25}`,

    // ── Ribbon sweep to exit ───────────────────────────────────
    `C ${jx + 420} ${jy - 90 - rc}, ${exitX - 380} ${exitY + 40 + rc}, ${exitX} ${exitY}`,
  ].join(" ")
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  DEFAULT CAPSULE                                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */

function WaveformBars() {
  const heights = React.useMemo(
    () =>
      Array.from(
        { length: 24 },
        (_, i) => 7 + Math.sin(i * 0.52) * 11 + Math.sin(i * 1.3) * 6
      ),
    []
  )

  return (
    <div className="flex items-center gap-[2.5px] h-7 px-1">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-[2.5px] rounded-full shrink-0"
          style={{
            backgroundColor: "var(--foreground, #18181b)",
            opacity: 0.85,
            animation: `arWave 0.55s ease-in-out ${i * 0.038}s infinite alternate`,
            height: `${Math.max(6, Math.min(26, h))}px`,
          }}
        />
      ))}
    </div>
  )
}

export function DefaultRibbonCapsule() {
  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Floating status tag */}
      <div
        className="absolute -top-10 left-1/2 whitespace-nowrap"
        style={{
          animation: "arFloat 5s ease-in-out 2s infinite",
          transform: "translateX(-50%)",
        }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-md"
          style={{ backgroundColor: "#15803d", color: "#ffffff" }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Saved name
        </div>
      </div>

      {/* Capsule body */}
      <div
        className="flex items-center justify-center px-6 py-3 rounded-full"
        style={{
          backgroundColor: "var(--background, #0c0c0e)",
          border: "2px solid var(--border, rgba(255,255,255,0.18))",
          boxShadow: "0 8px 30px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <WaveformBars />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  ANIMATED RIBBON                                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */

export function AnimatedRibbon({
  text = DEFAULT_TEXT,
  speed = 40,
  ribbonWidth = 50,
  fontSize = 18,
  fontFamily = "'Inter', system-ui, sans-serif",
  letterSpacing = 0.5,
  loopTextOpacity = 0.65,
  ribbonColor,
  ribbonTextColor,
  loopTextColor,
  loopX = 22,
  loopY = 42,
  loopSize = 45,
  ribbonAngle = 28,
  ribbonCurve = 0.4,
  capsuleAt = 0.62,
  capsuleContent,
  showCapsule = true,
  zoom = 1.3,
  panX = 0,
  panY = 0,
  paused = false,
  direction = "ltr",
  textRepeat = 5,
  customPath,
  className,
  ...rest
}: AnimatedRibbonProps) {
  /* ── Refs ──────────────────────────────────────────────────────────── */
  const svgRef = React.useRef<SVGSVGElement>(null)
  const tpARef = React.useRef<SVGTextPathElement | null>(null)
  const tpBRef = React.useRef<SVGTextPathElement | null>(null)
  const textARef = React.useRef<SVGTextElement | null>(null)
  const offsetRef = React.useRef(0)
  const prevTimeRef = React.useRef(0)
  const halfCycleRef = React.useRef(4000)

  /* ── State ─────────────────────────────────────────────────────────── */
  const [capsulePos, setCapsulePos] = React.useState({ x: 752, y: 608 })
  const [gradX, setGradX] = React.useState(700)

  /* ── Memoised path ─────────────────────────────────────────────────── */
  const pathD = React.useMemo(
    () =>
      customPath ??
      buildRibbonPath(loopX, loopY, loopSize, ribbonAngle, ribbonCurve),
    [customPath, loopX, loopY, loopSize, ribbonAngle, ribbonCurve]
  )

  /* ── Full text (repeated for seamless coverage) ────────────────────── */
  const sep = "  ·  "
  const fullText = React.useMemo(
    () => Array(textRepeat).fill(text).join(sep),
    [text, textRepeat]
  )

  /* ── Measure path, position capsule, compute gradient anchor ──────── */
  React.useEffect(() => {
    const pathEl = svgRef.current?.querySelector(
      "#ar-path"
    ) as SVGPathElement | null
    if (!pathEl) return

    const len = pathEl.getTotalLength()

    // Capsule position
    const pos = capsuleAt * len
    const pt = pathEl.getPointAtLength(pos)
    setCapsulePos({ x: pt.x, y: pt.y })
    setGradX(pt.x)

    // Measure actual rendered text length for seamless cycling
    if (textARef.current) {
      const measured = textARef.current.getComputedTextLength()
      if (measured > 0) halfCycleRef.current = measured / 2
    } else {
      // Fallback estimate
      halfCycleRef.current = fullText.length * fontSize * 0.52 / 2
    }
  }, [pathD, capsuleAt, fullText, fontSize])

  /* ── rAF animation loop ────────────────────────────────────────────── */
  React.useEffect(() => {
    let frameId: number

    const animate = (time: number) => {
      if (prevTimeRef.current === 0) prevTimeRef.current = time
      const dt = Math.min((time - prevTimeRef.current) / 1000, 0.1)
      prevTimeRef.current = time

      if (!paused) {
        const dir = direction === "ltr" ? -1 : 1
        offsetRef.current += speed * dt * dir

        // Wrap around at half cycle
        const hc = halfCycleRef.current
        if (offsetRef.current < -hc) offsetRef.current += hc
        if (offsetRef.current > hc) offsetRef.current -= hc
      }

      // Update both textPath startOffsets in the same frame
      const hc = halfCycleRef.current
      if (tpARef.current)
        tpARef.current.setAttribute("startOffset", `${offsetRef.current}`)
      if (tpBRef.current)
        tpBRef.current.setAttribute("startOffset", `${offsetRef.current + hc}`)

      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frameId)
      prevTimeRef.current = 0
    }
  }, [speed, paused, direction])

  /* ── Resolved theme colours ────────────────────────────────────────── */
  const rcRibbon = ribbonColor ?? "var(--foreground, #18181b)"
  const rcRibbonText = ribbonTextColor ?? "var(--background, #fafafa)"
  const rcLoopText = loopTextColor ?? "var(--muted-foreground, #78716c)"

  /* ── Dynamic viewBox based on zoom and pan ────────────────────────── */
  const zoomFactor = Math.max(0.4, Math.min(zoom ?? 1.3, 3))
  const vbW = VW / zoomFactor
  const vbH = VH / zoomFactor
  // Frame around the focal center of the ribbon action
  const focalX = VW * 0.48 + (panX ?? 0)
  const focalY = VH * 0.56 + (panY ?? 0)
  const vbX = focalX - vbW / 2
  const vbY = focalY - vbH / 2

  /* ── Gradient transition zone (SVG user-space x coords) ────────────── */
  // The ribbon band starts directly inside the capsule body
  const strokeX1 = gradX - 15
  const strokeX2 = gradX + 35
  const textX1 = gradX - 25
  const textX2 = gradX + 25

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", className)}
      {...rest}
    >
      {/* ── Keyframe animations ─────────────────────────────────────── */}
      <style>{`
        @keyframes arWave {
          0%   { transform: scaleY(0.35); }
          100% { transform: scaleY(1); }
        }
        @keyframes arFloat {
          0%, 100% { opacity: 0; transform: translateX(-50%) translateY(0); }
          12%      { opacity: 1; transform: translateX(-50%) translateY(-6px); }
          82%      { opacity: 1; transform: translateX(-50%) translateY(-6px); }
          94%      { opacity: 0; transform: translateX(-50%) translateY(-14px); }
        }
      `}</style>

      <svg
        ref={svgRef}
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Animated text ribbon"
      >
        <defs>
          {/* ── Master path ────────────────────────────────────────── */}
          <path id="ar-path" d={pathD} fill="none" />

          {/* ── Ribbon-stroke gradient: transparent left → opaque right */}
          <linearGradient
            id="ar-stroke-grad"
            gradientUnits="userSpaceOnUse"
            x1={strokeX1}
            y1={0}
            x2={strokeX2}
            y2={0}
          >
            <stop offset="0%" stopOpacity={0} style={{ stopColor: rcRibbon }} />
            <stop
              offset="100%"
              stopOpacity={1}
              style={{ stopColor: rcRibbon }}
            />
          </linearGradient>

          {/* ── Text-fill gradient: muted loop text → bright ribbon text */}
          <linearGradient
            id="ar-text-grad"
            gradientUnits="userSpaceOnUse"
            x1={textX1}
            y1={0}
            x2={textX2}
            y2={0}
          >
            <stop
              offset="0%"
              stopOpacity={loopTextOpacity}
              style={{ stopColor: rcLoopText }}
            />
            <stop
              offset="100%"
              stopOpacity={1}
              style={{ stopColor: rcRibbonText }}
            />
          </linearGradient>
        </defs>

        {/* ── Ribbon band (thick stroke, gradient-masked) ──────────── */}
        <use
          href="#ar-path"
          stroke="url(#ar-stroke-grad)"
          strokeWidth={ribbonWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── Text copy A ──────────────────────────────────────────── */}
        <text
          ref={textARef}
          fill="url(#ar-text-grad)"
          fontSize={fontSize}
          fontFamily={fontFamily}
          letterSpacing={letterSpacing}
          style={{ fontWeight: 420 }}
        >
          <textPath
            ref={(el) => {
              tpARef.current = el
            }}
            href="#ar-path"
            startOffset="0"
          >
            {fullText}
          </textPath>
        </text>

        {/* ── Text copy B (offset half-cycle for seamless loop) ─────── */}
        <text
          fill="url(#ar-text-grad)"
          fontSize={fontSize}
          fontFamily={fontFamily}
          letterSpacing={letterSpacing}
          style={{ fontWeight: 420 }}
        >
          <textPath
            ref={(el) => {
              tpBRef.current = el
            }}
            href="#ar-path"
            startOffset="0"
          >
            {fullText}
          </textPath>
        </text>

        {/* ── Capsule (foreignObject positioned on path) ───────────── */}
        {showCapsule && (
          <foreignObject
            x={capsulePos.x - 160}
            y={capsulePos.y - 65}
            width={320}
            height={130}
            style={{ overflow: "visible" }}
          >
            <div className="flex items-center justify-center w-full h-full">
              {capsuleContent ?? <DefaultRibbonCapsule />}
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  )
}

export default AnimatedRibbon
