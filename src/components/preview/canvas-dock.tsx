"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { usePreviewContext } from "./preview-controls"
import type { Preset } from "@/components/playground/types"

export function CanvasDock() {
  const { activeItem, activePresetName, selectPreset, values, setValue } = usePreviewContext()

  if (!activeItem || !activeItem.presets || activeItem.presets.length === 0) {
    return null
  }

  const presets = activeItem.presets
  const hasPlayControl =
    "playing" in activeItem.controls && activeItem.controls["playing"].type === "boolean"
  const isPlaying = hasPlayControl ? Boolean(values.playing) : false

  const togglePlay = () => {
    if (hasPlayControl) setValue("playing", !isPlaying)
  }

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] max-w-[94%] pointer-events-auto select-none">
      <div className="flex items-center gap-1 p-1 rounded-full border border-neutral-200/90 dark:border-white/[0.12] bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl shadow-xl dark:shadow-2xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ring-1 ring-black/5 dark:ring-white/10">
        {presets.map((preset: Preset) => {
          const isCurrent = activePresetName === preset.name
          const label =
            preset.name.includes("Mobbin") ? "Mobbin" :
            preset.name.includes("Auto-Play") ? "Auto-Play" :
            preset.name.includes("Mid-Reveal") ? "Mid-Reveal" :
            preset.name.includes("Initial Step") ? "Initial" :
            preset.name.includes("Dark Tech") ? "Dark Tech" :
            preset.name.includes("1 Full") ? "1 Full + 2 Cut" :
            preset.name.includes("Multi-Card") ? "Multi-Card" :
            preset.name.includes("Initial Grid") ? "3×3 Grid" :
            preset.name.includes("Morphing") ? "Morph" :
            preset.name.includes("In-Line") ? "Strip" :
            preset.name.includes("Vertical") ? "Vertical" :
            preset.name.includes("Looping") ? "Loop" :
            preset.name.includes("Classic") ? "Classic" :
            preset.name.includes("Velocity") ? "Velocity" :
            preset.name.includes("Spotlight") ? "Spotlight" :
            preset.name.split(" ").slice(0, 2).join(" ")

          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => selectPreset(preset)}
              className={cn(
                "relative z-10 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 pointer-events-auto",
                isCurrent
                  ? "text-neutral-900 dark:text-neutral-100 font-semibold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              )}
            >
              {isCurrent && (
                <motion.div
                  layoutId="activeCanvasPreset"
                  className="absolute inset-0 bg-neutral-200/80 dark:bg-white/[0.1] rounded-full border border-neutral-300/60 dark:border-white/[0.08] shadow-xs"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          )
        })}

        {/* Play / Pause Toggle Pill if component supports animation */}
        {hasPlayControl && (
          <button
            type="button"
            onClick={togglePlay}
            className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border-l border-neutral-200 dark:border-white/[0.08] pl-2.5 ml-0.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shrink-0 pointer-events-auto"
            title={isPlaying ? "Pause animation" : "Play animation"}
          >
            <span
              className={cn(
                "size-1.5 rounded-full transition-colors",
                isPlaying
                  ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                  : "bg-neutral-400 dark:bg-neutral-600"
              )}
            />
            <span>{isPlaying ? "Playing" : "Paused"}</span>
          </button>
        )}
      </div>
    </div>
  )
}
