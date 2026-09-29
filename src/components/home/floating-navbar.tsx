"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useTheme } from "next-themes"
import { ArrowRight, Moon, Sun } from "lucide-react"
import { SITE_NAME, SITE_REPO } from "@/lib/site"
import { cn } from "@/lib/utils"

export function FloatingNavbar() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [starCount, setStarCount] = React.useState<string>("1.2k")

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 28)
  })

  React.useEffect(() => {
    setMounted(true)

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
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none px-4 sm:px-6 pt-3 sm:pt-4">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "pointer-events-auto relative flex items-center justify-between rounded-2xl transition-all duration-500 ease-out select-none w-full max-w-3xl",
          scrolled
            ? "px-4 py-2 bg-white/70 dark:bg-[#0a0a0c]/80 backdrop-blur-2xl border border-neutral-200/70 dark:border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "px-4 py-2.5 bg-transparent border border-transparent"
        )}
      >
        {/* Left: Brand */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="group flex items-center gap-2 text-neutral-900 dark:text-neutral-100 focus:outline-none"
          >
            <div className={cn(
              "flex size-7 items-center justify-center rounded-lg transition-all",
              scrolled
                ? "bg-neutral-100 dark:bg-white/[0.06] border border-neutral-200/80 dark:border-white/[0.08]"
                : "bg-neutral-100/80 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06]"
            )}>
              <svg
                className="size-4 fill-none stroke-neutral-600 dark:stroke-neutral-400 stroke-[2]"
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

            <span className="font-semibold tracking-tight text-[13px] text-neutral-900 dark:text-white">
              {SITE_NAME}
            </span>
          </Link>
        </div>

        {/* Right: GitHub + Theme + CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* GitHub Stars */}
          <a
            href={SITE_REPO}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Star on GitHub"
          >
            <svg
              className="size-3.5 fill-neutral-700 dark:fill-neutral-300"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <svg
              className="size-2.5 fill-amber-400 stroke-amber-400"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
            <span className="font-mono text-[11px] font-semibold">
              {starCount}
            </span>
          </a>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex size-7 items-center justify-center rounded-lg text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle color theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>

          {/* CTA */}
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <span>Explore</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </motion.header>
    </div>
  )
}
