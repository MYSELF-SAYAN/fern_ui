"use client"

import * as React from "react"
import Link from "next/link"

export function FooterSection() {
  return (
    <footer className="border-t border-neutral-200/60 dark:border-white/[0.05]">
      <div className="max-w-[1280px] mx-auto px-6 py-14 sm:py-20">
        {/* Top row — brand + nav */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-neutral-100 dark:bg-white/[0.06] border border-neutral-200/80 dark:border-white/[0.08] flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg
                className="size-4 fill-none stroke-neutral-500 dark:stroke-neutral-400 stroke-[2]"
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
            <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Fern UI
            </span>
          </Link>

          {/* Minimal nav */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-neutral-500 dark:text-neutral-500">
            <Link href="/components" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Components
            </Link>
            <Link href="/docs" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
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
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-10 pt-6 border-t border-neutral-200/40 dark:border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-neutral-400 dark:text-neutral-600 tracking-wide">
          <span>© 2026 Fern UI</span>
          <span>MIT</span>
        </div>
      </div>
    </footer>
  )
}
