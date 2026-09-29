"use client"

import * as React from "react"
import {
  ScrollCardStack,
  defaultCardStackItems,
} from "@/components/ui/scroll-card-stack"
import { usePreviewContext } from "@/components/preview/preview-controls"
import { CanvasDock } from "@/components/preview/canvas-dock"

export default function ScrollCardStackDemo() {
  const { values } = usePreviewContext()

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ScrollCardStack
        items={defaultCardStackItems}
        scaleStep={values.scaleStep ?? 0.04}
        borderRadius={values.borderRadius ?? 24}
        springStiffness={values.springStiffness ?? 100}
        springDamping={values.springDamping ?? 30}
        shadowIntensity={values.shadowIntensity ?? 40}
        cardAspect={values.cardAspect ?? "16:9"}
        dimAmount={values.dimAmount ?? 0.15}
        sensitivity={values.sensitivity ?? 1.0}
        indicatorPosition="top"
        mode="interactive"
        wheelScrub={true}
        className="w-full h-full"
      />
      <CanvasDock />
    </div>
  )
}
