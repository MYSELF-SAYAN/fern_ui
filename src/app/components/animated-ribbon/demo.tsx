"use client"

import * as React from "react"
import { AnimatedRibbon } from "@/components/ui/animated-ribbon"
import { usePreviewContext } from "@/components/preview/preview-controls"
import { CanvasDock } from "@/components/preview/canvas-dock"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

export default function AnimatedRibbonDemo() {
  const { values, setValue } = usePreviewContext()
  const currentZoom = Number(values.zoom ?? 1.3)

  const handleZoom = (delta: number) => {
    const next = Math.round(Math.max(0.6, Math.min(2.5, currentZoom + delta)) * 20) / 20
    setValue("zoom", next)
  }

  const handleResetZoom = () => {
    setValue("zoom", 1.3)
    setValue("panY", 0)
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      <AnimatedRibbon
        speed={values.speed ?? 40}
        fontSize={values.fontSize ?? 18}
        ribbonWidth={values.ribbonWidth ?? 50}
        loopTextOpacity={values.loopTextOpacity ?? 0.65}
        letterSpacing={values.letterSpacing ?? 0.5}
        paused={values.paused ?? false}
        direction={values.direction ?? "ltr"}
        textRepeat={values.textRepeat ?? 5}
        showCapsule={values.showCapsule ?? true}
        loopX={values.loopX ?? 22}
        loopY={values.loopY ?? 42}
        loopSize={values.loopSize ?? 45}
        ribbonAngle={values.ribbonAngle ?? 28}
        ribbonCurve={values.ribbonCurve ?? 0.4}
        capsuleAt={values.capsuleAt ?? 0.62}
        zoom={values.zoom ?? 1.3}
        panY={values.panY ?? 0}
        className="w-full h-full"
      />

      {/* Floating Canvas Quick Zoom Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-1 p-1 rounded-full border border-neutral-200/90 dark:border-white/[0.12] bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 select-none">
        <button
          type="button"
          onClick={() => handleZoom(-0.15)}
          className="size-7 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-white/[0.08] text-neutral-600 dark:text-zinc-300 transition-colors cursor-pointer"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={handleResetZoom}
          className="px-2 py-0.5 text-[11px] font-mono font-semibold text-neutral-800 dark:text-zinc-200 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer tracking-tight"
          title="Click to reset zoom to 130%"
        >
          {Math.round(currentZoom * 100)}%
        </button>

        <button
          type="button"
          onClick={() => handleZoom(0.15)}
          className="size-7 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-white/[0.08] text-neutral-600 dark:text-zinc-300 transition-colors cursor-pointer"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn className="size-3.5" />
        </button>
      </div>

      <CanvasDock />
    </div>
  )
}
