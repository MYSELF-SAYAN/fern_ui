"use client"

import * as React from "react"
import { OrbitCardReel, defaultOrbitCards } from "@/components/ui/orbit-card-reel"
import { usePreviewContext } from "@/components/preview/preview-controls"
import { CanvasDock } from "@/components/preview/canvas-dock"

export default function OrbitCardReelDemo() {
  const { values } = usePreviewContext()

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      <OrbitCardReel
        items={defaultOrbitCards}
        maxRotation={values.maxRotation ?? 48}
        perspective={values.perspective ?? 1250}
        orbitRatio={values.orbitRatio ?? 0.65}
        cardScale={values.cardScale ?? 1.0}
        cardGap={values.cardGap ?? 44}
        wheelScrub={values.wheelScrub ?? true}
        dragScrub={values.dragScrub ?? true}
        mode="interactive"
        className="w-full h-full"
      />
      <CanvasDock />
    </div>
  )
}
