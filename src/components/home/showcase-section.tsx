"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Layers } from "lucide-react"
import {
  FocusSliderStage,
  OrbitGlobeStage,
  GridZoomStripStage,
  MobbinStatsRevealStage,
} from "./showcase-stages"

export function ShowcaseSection() {
  return (
    <section id="showcase" className="relative px-6 py-16 sm:py-24 max-w-6xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-12 border-b border-neutral-200/80 dark:border-white/[0.06] mb-12">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
              Live Showcase
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="font-mono text-[10px] text-neutral-400">4 Active Primitives</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
            Interactive Gallery
          </h2>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs font-normal leading-relaxed">
          Interact with each stage directly. Test dragging, 3D orbit, inertial spring snapping, and morph scrubbers.
        </p>
      </div>

      {/* Curated Grid of the 4 Real, Working Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
        {/* 01. Focus Slider */}
        <FocusSliderStage />

        {/* 02. Orbit Globe */}
        <OrbitGlobeStage />

        {/* 03. Grid Zoom Strip */}
        <GridZoomStripStage />

        {/* 04. Mobbin Stats Reveal */}
        <MobbinStatsRevealStage />
      </div>

      {/* Bottom Discovery Prompt */}
      <div className="mt-16 pt-10 border-t border-neutral-200/60 dark:border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-neutral-900 dark:text-neutral-200">
            Ready to configure and install?
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Open any component in the full playground with live prop controls and code exporter.
          </p>
        </div>

        <Link
          href="/components"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200/80 dark:border-white/[0.08] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
        >
          <Layers className="size-3.5" />
          <span>Open Full Playground</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </section>
  )
}
