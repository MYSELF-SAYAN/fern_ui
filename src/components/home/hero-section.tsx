"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Copy } from "lucide-react"

export function HeroSection() {
  const [copied, setCopied] = React.useState(false)

  const copyCommand = () => {
    navigator.clipboard?.writeText("npx shadcn add fern-ui")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-24 sm:pt-44 sm:pb-36 text-center overflow-hidden">
      {/* Subtle ambient gradient — matte warm feel */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gradient-to-b from-neutral-200/40 via-transparent to-transparent dark:from-white/[0.03] dark:via-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Headline — massive scale, tight tracking */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(2.8rem,7vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-neutral-900 dark:text-neutral-50"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Components that{" "}
          <span className="font-serif italic font-normal text-neutral-600 dark:text-neutral-400">
            move.
          </span>
        </motion.h1>

        {/* Supporting — single line, muted */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 max-w-md text-[15px] sm:text-base text-neutral-500 dark:text-neutral-500 leading-relaxed font-normal tracking-[-0.01em]"
        >
          Animated React primitives. Tailwind CSS + Framer Motion.
          <br className="hidden sm:block" />
          Copy, paste, ship.
        </motion.p>

        {/* CTAs — two buttons, tight row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/components"
            className="group inline-flex items-center gap-2 h-11 px-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13px] font-medium tracking-[-0.01em] hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm cursor-pointer"
          >
            <span>Browse components</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <button
            type="button"
            onClick={copyCommand}
            className="inline-flex items-center gap-2.5 h-11 px-5 rounded-full border border-neutral-200 dark:border-white/[0.1] bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm text-[13px] font-mono text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all cursor-pointer"
            title="Copy install command"
          >
            <span className="text-neutral-300 dark:text-neutral-600">$</span>
            <span className="truncate max-w-[180px] sm:max-w-none">npx shadcn add fern-ui</span>
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
                  className="text-neutral-400"
                >
                  <Copy className="size-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

        {/* Stat bar — quiet, monospaced */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex items-center gap-8 text-[11px] font-mono tracking-wide text-neutral-400 dark:text-neutral-600"
        >
          <span>7 primitives</span>
          <span className="size-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <span>MIT licensed</span>
          <span className="size-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <span>open source</span>
        </motion.div>
      </div>
    </section>
  )
}
