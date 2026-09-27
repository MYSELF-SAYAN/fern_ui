"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Copy, Sparkles, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

const featuredComponents = [
  { id: "stage-focus-slider", label: "Focus Slider", desc: "Inertial spring carousel with center focus" },
  { id: "stage-orbit-globe", label: "Orbit Globe", desc: "360° spherical 3D card projection" },
  { id: "stage-grid-zoom-strip", label: "Grid Zoom", desc: "3×3 gallery morphing into horizontal reel" },
  { id: "stage-mobbin-stats", label: "Stats Reveal", desc: "Kinetic counters with ambient app logos" },
]

export function HeroSection() {
  const [copied, setCopied] = React.useState(false)
  const [activeItem, setActiveItem] = React.useState(featuredComponents[0].id)

  const copyCommand = () => {
    navigator.clipboard?.writeText("npx shadcn add fern-ui/orbit-globe")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToStage = (id: string) => {
    setActiveItem(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-16 sm:pt-36 sm:pb-24 text-center overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        {/* Subtle Category Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 dark:border-white/[0.08] bg-neutral-100/60 dark:bg-white/[0.03] px-3.5 py-1 text-[11px] font-mono tracking-wider text-neutral-600 dark:text-neutral-400 mb-6"
        >
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>FERN UI · 4 CORE MOTION PRIMITIVES</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100 leading-[1.08]"
        >
          Crafted for{" "}
          <span className="font-serif italic font-normal text-neutral-900 dark:text-white">
            movement.
          </span>
        </motion.h1>

        {/* Supporting Sentence */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-lg text-base sm:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal"
        >
          A curated collection of animated, copy-paste React primitives built with Tailwind CSS and Framer Motion.
        </motion.p>

        {/* Minimal CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/components"
            className="group inline-flex items-center gap-2 h-10 px-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <span>Browse Components</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Quick CLI Copy Trigger */}
          <button
            type="button"
            onClick={copyCommand}
            className="inline-flex items-center gap-2.5 h-10 px-4 rounded-full border border-neutral-200/90 dark:border-white/[0.1] bg-white dark:bg-zinc-900/60 text-xs font-mono text-neutral-600 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-white/20 transition-all cursor-pointer"
            title="Copy install command"
          >
            <span className="text-neutral-400">$</span>
            <span className="truncate max-w-[200px] sm:max-w-none">npx shadcn add fern-ui</span>
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="text-emerald-500"
                >
                  <Check className="size-3.5" />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                >
                  <Copy className="size-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

        {/* Hero Interactive Quick Jump Dock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 w-full max-w-lg rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/50 dark:bg-zinc-900/30 p-2 sm:p-2.5 shadow-xs"
        >
          <div className="flex items-center justify-between p-1 rounded-xl bg-neutral-200/60 dark:bg-white/[0.05] gap-1">
            {featuredComponents.map((item) => {
              const isActive = activeItem === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToStage(item.id)}
                  className={cn(
                    "relative flex-1 py-1.5 px-2 text-[11px] sm:text-xs font-medium transition-colors cursor-pointer select-none truncate",
                    isActive
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="hero-component-indicator"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-800 shadow-xs border border-black/[0.04] dark:border-white/[0.08]"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              )
            })}
          </div>

          <div className="py-2.5 px-3 flex items-center justify-between text-left">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {featuredComponents.find((m) => m.id === activeItem)?.desc}
            </p>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium shrink-0 ml-3">
              Click to jump ↓
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
