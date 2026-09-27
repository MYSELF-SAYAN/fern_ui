"use client"

import * as React from "react"
import Link from "next/link"
import { Leaf } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="border-t border-neutral-200/80 dark:border-white/[0.06] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 text-neutral-600 dark:text-neutral-400 text-xs">
        {/* Brand Lockup */}
        <div className="space-y-1.5">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="size-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf className="size-3.5" />
            </div>
            <span className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
              Fern UI
            </span>
          </Link>
          <p className="text-neutral-400 dark:text-neutral-500 text-[11px]">
            Animated React components for tactile, modern interfaces.
          </p>
        </div>

        {/* Minimal Navigation Links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <Link
            href="/components"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Components
          </Link>
          <Link
            href="/components/orbit-globe"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Orbit Globe
          </Link>
          <Link
            href="/components/focus-slider"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Focus Slider
          </Link>
          <Link
            href="/components/grid-zoom-strip"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Grid Zoom Strip
          </Link>
          <Link
            href="/components/mobbin-stats-reveal"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Stats Reveal
          </Link>
          <Link
            href="/docs"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Docs
          </Link>
          <a
            href="https://github.com/fern-ui/fern-ui"
            target="_blank"
            rel="noreferrer"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="max-w-6xl mx-auto px-6 pb-12 pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-400 dark:text-neutral-600">
        <span>© 2026 Fern UI</span>
        <span>MIT License</span>
      </div>
    </footer>
  )
}
