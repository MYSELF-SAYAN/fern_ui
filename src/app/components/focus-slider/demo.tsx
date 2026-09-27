"use client"

import * as React from "react"
import {
  FocusSlider,
  type FocusSliderItem,
} from "@/components/ui/focus-slider"
import { usePreviewContext } from "@/components/preview/preview-controls"
import { CanvasDock } from "@/components/preview/canvas-dock"

const demoItems: FocusSliderItem[] = [
  {
    id: 1,
    title: "north ave",
    subtitle: "STUDIO",
    color: "#545b41",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between p-4 sm:p-6 bg-[#545b41] text-white select-none">
        <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#e4e5dc] text-[#282d1c] shadow-sm overflow-hidden">
          <div className="relative w-[78%] sm:w-[72%] aspect-[4/3] overflow-hidden rounded-md border-4 border-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=800&auto=format&fit=crop"
              alt="Meadow Flowers"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          <div className="mt-auto flex justify-end items-end pt-3">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#282d1c] font-sans">
              north ave
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Make things with love",
    subtitle: "CREATIVE",
    color: "#ebe8de",
    content: (
      <div className="relative flex h-full w-full flex-col items-center justify-center p-6 bg-[#ebe8de] text-[#292d1c] select-none text-center">
        <div className="size-20 sm:size-24 rounded-full overflow-hidden shadow-md mb-4 border-2 border-white shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
            alt="Studio Portrait"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        <p className="text-xl sm:text-2xl font-bold tracking-tight text-[#292d1c] leading-tight max-w-[170px]">
          Make things with love
        </p>
      </div>
    ),
  },
  {
    id: 3,
    title: "0316 AVE",
    subtitle: "THU",
    color: "#1e201c",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden p-5 bg-zinc-900 text-white select-none">
        <img
          src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop"
          alt="Field"
          className="absolute inset-0 w-full h-full object-cover opacity-85"
          draggable={false}
        />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white/95">
            THU
          </h2>
        </div>
        <div className="relative z-10 mt-auto">
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white/90">
            0316 AVE
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "MADRID",
    subtitle: "BARCELONA",
    color: "#161618",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between p-5 bg-[#161618] text-zinc-100 select-none border border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            ATELIER
          </span>
          <span className="text-xs font-mono text-zinc-500">2026</span>
        </div>
        <div className="mt-auto">
          <h2 className="text-3xl sm:text-4xl font-black tracking-widest uppercase">
            MADRID
          </h2>
        </div>
      </div>
    ),
  },
]

export default function FocusSliderDemo() {
  const { values } = usePreviewContext()

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <FocusSlider
        items={demoItems}
        cardWidth={values.cardWidth ?? 320}
        cardAspect={values.cardAspect ?? "3:4"}
        sideScale={values.sideScale ?? 0.88}
        gap={values.gap ?? 24}
        sideOpacity={values.sideOpacity ?? 0.7}
        speed={values.springStiffness ? 300 / values.springStiffness : 0.75}
        direction={values.orientation === "vertical" ? "vertical" : "horizontal"}
        loop={values.loop ?? true}
        draggable={values.dragEnabled ?? true}
        mouseWheel={values.mouseWheelScroll ?? true}
        className="h-full w-full"
      />
      <CanvasDock />
    </div>
  )
}
