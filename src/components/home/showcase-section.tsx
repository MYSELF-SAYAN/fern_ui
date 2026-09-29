"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Layers, Orbit, MoveHorizontal, BarChart3, Check, Copy } from "lucide-react"
import {
  OrbitCardReelStage,
  AnimatedRibbonStage,
  ScrollCardStackStage,
  FocusSliderStage,
  OrbitGlobeStage,
  GridZoomStripStage,
  MobbinStatsRevealStage,
} from "./showcase-stages"

type CategoryFilter = "all" | "3d" | "scroll" | "data"

interface CategoryTab {
  id: CategoryFilter
  label: string
  count: number
  icon: React.ComponentType<{ className?: string }>
}

const CATEGORY_TABS: CategoryTab[] = [
  { id: "all", label: "All Components", count: 7, icon: Sparkles },
  { id: "3d", label: "3D & Motion", count: 3, icon: Orbit },
  { id: "scroll", label: "Scroll & Stacking", count: 3, icon: Layers },
  { id: "data", label: "Data & Metrics", count: 1, icon: BarChart3 },
]

export function ShowcaseSection() {
  const [activeTab, setActiveTab] = React.useState<CategoryFilter>("all")
  const [copied, setCopied] = React.useState(false)

  const copyCommand = () => {
    navigator.clipboard?.writeText("npx shadcn add fern-ui")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="showcase" className="relative px-4 sm:px-6 pb-28 sm:pb-36 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto">

        {/* Section Header — Editorial & High-Contrast */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-14 border-b border-neutral-200/70 dark:border-white/[0.06]">
          <div className="max-w-2xl">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200/80 dark:border-white/[0.08] mb-4">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-600 dark:text-neutral-400 font-medium">
                Live Interactive Showcase
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.03em] text-neutral-900 dark:text-neutral-50 leading-[1.05]">
              Crafted for motion.{" "}
              <span className="font-serif italic font-normal text-neutral-500 dark:text-neutral-400">
                Designed to ship.
              </span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-xl font-normal leading-relaxed">
              Seven production-ready React primitives built with Tailwind CSS and Framer Motion.
              Scrub, drag, and interact directly on each stage.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center flex-wrap gap-1.5 p-1 rounded-2xl bg-neutral-100/90 dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/[0.06] backdrop-blur-md self-start md:self-auto">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-tight transition-all cursor-pointer ${
                    isActive
                      ? "text-neutral-900 dark:text-white shadow-xs"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterBg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-xl bg-white dark:bg-neutral-800 border border-black/5 dark:border-white/10 shadow-xs"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="size-3.5 opacity-70 group-hover:opacity-100" />
                    <span>{tab.label}</span>
                    <span className="text-[10px] font-mono opacity-50 px-1 py-0.2 rounded-md bg-black/5 dark:bg-white/10">
                      {tab.count}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bento Grid — Dynamic Layout based on Active Filter */}
        <div className="mt-8 sm:mt-10">
          <AnimatePresence mode="wait">
            {activeTab === "all" && (
              <motion.div
                key="all"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5"
              >
                {/* 1. SPOTLIGHT: Orbit Card Reel (Wispr Flow 3D Perspective) — 12 cols */}
                <div className="md:col-span-12">
                  <OrbitCardReelStage />
                </div>

                {/* 2. Animated Ribbon (7 cols) + Scroll Card Stack (5 cols) */}
                <div className="md:col-span-12 lg:col-span-7">
                  <AnimatedRibbonStage />
                </div>
                <div className="md:col-span-12 lg:col-span-5">
                  <ScrollCardStackStage />
                </div>

                {/* 3. Focus Slider (7 cols) + Orbit Globe (5 cols) */}
                <div className="md:col-span-12 lg:col-span-7">
                  <FocusSliderStage />
                </div>
                <div className="md:col-span-12 lg:col-span-5">
                  <OrbitGlobeStage />
                </div>

                {/* 4. Grid Zoom Strip (6 cols) + Mobbin Stats (6 cols) */}
                <div className="md:col-span-12 lg:col-span-6">
                  <GridZoomStripStage />
                </div>
                <div className="md:col-span-12 lg:col-span-6">
                  <MobbinStatsRevealStage />
                </div>
              </motion.div>
            )}

            {activeTab === "3d" && (
              <motion.div
                key="3d"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5"
              >
                <div className="md:col-span-12">
                  <OrbitCardReelStage />
                </div>
                <div className="md:col-span-12 lg:col-span-7">
                  <AnimatedRibbonStage />
                </div>
                <div className="md:col-span-12 lg:col-span-5">
                  <OrbitGlobeStage />
                </div>
              </motion.div>
            )}

            {activeTab === "scroll" && (
              <motion.div
                key="scroll"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5"
              >
                <div className="md:col-span-12 lg:col-span-6">
                  <ScrollCardStackStage />
                </div>
                <div className="md:col-span-12 lg:col-span-6">
                  <GridZoomStripStage />
                </div>
                <div className="md:col-span-12">
                  <FocusSliderStage />
                </div>
              </motion.div>
            )}

            {activeTab === "data" && (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5"
              >
                <div className="md:col-span-12">
                  <MobbinStatsRevealStage />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Hardware Banner — Quick Installation & Playground Gateway */}
        <div className="mt-16 sm:mt-20 rounded-3xl p-1 bg-neutral-200/60 dark:bg-white/[0.04] border border-neutral-300/60 dark:border-white/[0.08] shadow-sm">
          <div className="rounded-[calc(1.5rem-2px)] sm:rounded-[calc(1.5rem-4px)] bg-[#fcfcfc] dark:bg-[#0c0c0e] px-6 sm:px-8 py-8 sm:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-black/[0.04] dark:border-white/[0.04]">
            <div className="max-w-lg">
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                Customize every spring & parameter.
              </h3>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                Open the interactive component playground to tune springs, switch presets, and copy clean TypeScript code directly to your clipboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={copyCommand}
                className="inline-flex items-center gap-2.5 h-11 px-4 sm:px-5 rounded-full border border-neutral-300 dark:border-white/[0.12] bg-neutral-100/80 dark:bg-white/[0.05] text-[13px] font-mono text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-white/20 transition-all cursor-pointer select-none"
                title="Copy installation CLI command"
              >
                <span className="text-neutral-400 dark:text-neutral-600">$</span>
                <span>npx shadcn add fern-ui</span>
                {copied ? (
                  <Check className="size-3.5 text-emerald-500 ml-1" />
                ) : (
                  <Copy className="size-3.5 text-neutral-400 ml-1" />
                )}
              </button>

              <Link
                href="/components"
                className="group/btn inline-flex items-center gap-2.5 h-11 px-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-[13px] font-medium tracking-tight hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <span>Launch Playground</span>
                <span className="size-5 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center transition-transform group-hover/btn:translate-x-0.5">
                  <ArrowRight className="size-3" />
                </span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
