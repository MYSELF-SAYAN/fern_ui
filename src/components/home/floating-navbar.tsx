"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion"
import { useTheme } from "next-themes"
import { ArrowRight, Moon, Sun } from "lucide-react"
import { SITE_NAME, SITE_REPO } from "@/lib/site"
import { cn } from "@/lib/utils"

export function FloatingNavbar() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [starCount, setStarCount] = React.useState<string>("1.2k")

  const { scrollY, scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  })

  // Detect scroll state for fluid sticky transformation
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 28)
  })

  React.useEffect(() => {
    setMounted(true)

    // Optional: fetch real GitHub stars if available, with graceful fallback
    fetch("https://api.github.com/repos/fern-ui/fern-ui")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.stargazers_count !== undefined) {
          const count = data.stargazers_count
          if (count >= 1000) {
            setStarCount(`${(count / 1000).toFixed(1)}k`)
          } else {
            setStarCount(String(count))
          }
        }
      })
      .catch(() => {
        // Fallback to static stylish star count
        setStarCount("1.2k")
      })
  }, [])

  const isDark = mounted ? resolvedTheme === "dark" || theme === "dark" : true

  const toggleTheme = React.useCallback(() => {
    const next = isDark ? "light" : "dark"
    setTheme(next)
    if (next === "dark") {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark, setTheme])

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none px-3.5 sm:px-6 pt-3 sm:pt-4 transition-all duration-300">
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "pointer-events-auto relative flex items-center justify-between rounded-full transition-all duration-300 ease-out select-none",
          scrolled
            ? "w-full max-w-3xl px-3.5 sm:px-4 py-2 bg-white/80 dark:bg-[#0a0a0c]/85 backdrop-blur-xl border border-neutral-200/90 dark:border-white/[0.12] shadow-[0_12px_36px_-10px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]"
            : "w-full max-w-4xl px-4 sm:px-5 py-2.5 sm:py-3 bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border border-neutral-200/60 dark:border-white/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        )}
      >
        {/* ─── Left: Brand Logo & Title ────────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-full"
          >
            {/* Custom Minimalist Fern Icon */}
            <div className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <svg
                className="size-4 fill-none stroke-current stroke-[2.2]"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9S3 7.03 3 12a9 9 0 0 0 9 9Z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c2.5 0 4.5 1 5 3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 13c-2.5 0-4.5 1-5 3" />
              </svg>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-semibold tracking-tight text-sm text-neutral-900 dark:text-white">
                {SITE_NAME}
              </span>
            </div>
          </Link>

          {/* Minimal Active Primitives Badge */}
          <Link
            href="/components"
            className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide text-neutral-600 dark:text-neutral-400 bg-neutral-100/80 dark:bg-white/[0.05] border border-neutral-200/60 dark:border-white/[0.06] hover:border-emerald-500/30 transition-colors"
          >
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>4 primitives</span>
          </Link>
        </div>

        {/* ─── Center: Minimal Quick Anchors ────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-1 text-xs">
          <Link
            href="/components"
            className="px-2.5 py-1 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-white/[0.05] transition-colors font-medium"
          >
            Components
          </Link>
          <a
            href="#showcase"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="px-2.5 py-1 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-white/[0.05] transition-colors font-medium"
          >
            Showcase
          </a>
        </nav>

        {/* ─── Right: GitHub Stars, Theme Toggle, Explore ────────────────────── */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* GitHub Stars Button */}
          <a
            href={SITE_REPO}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 rounded-full border border-neutral-200/90 dark:border-white/[0.1] bg-white/80 dark:bg-white/[0.04] text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-white/25 hover:text-neutral-900 dark:hover:text-white transition-all shadow-xs cursor-pointer"
            aria-label="Star Fern UI on GitHub"
            title="View on GitHub"
          >
            {/* GitHub Octocat SVG */}
            <svg
              className="size-3.5 fill-neutral-800 dark:fill-neutral-200 group-hover:scale-105 transition-transform"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="hidden sm:inline font-mono text-[11px] text-neutral-300 dark:text-neutral-700">
              ·
            </span>
            {/* Star Icon */}
            <svg
              className="size-3 fill-amber-400 stroke-amber-400 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
            <span className="font-mono text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
              {starCount}
            </span>
          </a>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex size-7 sm:size-8 items-center justify-center rounded-full border border-neutral-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle color theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>

          {/* Explore / Components Direct CTA */}
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 h-7 sm:h-8 px-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer"
          >
            <span>Explore</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ─── Micro Hairline Scroll Progress Indicator ─────────────────────── */}
        <motion.div
          className="pointer-events-none absolute -bottom-px left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent transition-opacity duration-300"
          style={{
            scaleX,
            opacity: scrolled ? 1 : 0,
            transformOrigin: "center",
          }}
        />
      </motion.header>
    </div>
  )
}
