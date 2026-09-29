"use client"

import * as React from "react"
import {
  MobbinStatsReveal,
  defaultMobbinStats,
  defaultMobbinApps,
} from "@/components/ui/mobbin-stats-reveal"
import { usePreviewContext } from "@/components/preview/preview-controls"
import { CanvasDock } from "@/components/preview/canvas-dock"

export default function MobbinStatsRevealDemo() {
  const { values } = usePreviewContext()

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <MobbinStatsReveal
        title={values.title ?? "A growing library of"}
        stats={defaultMobbinStats}
        apps={defaultMobbinApps.slice(0, values.iconCount ?? 12)}
        iconSize={values.iconSize ?? 56}
        iconSpread={values.iconSpread ?? 1.0}
        iconSpeed={values.iconSpeed ?? 1.0}
        randomMovement={values.randomMovement ?? true}
        iconParallax={values.iconParallax ?? 1.0}
        floatAnimation={values.iconWiggle ?? true}
        mouseParallax={true}
        className="h-full w-full"
      />
      <CanvasDock />
    </div>
  )
}
