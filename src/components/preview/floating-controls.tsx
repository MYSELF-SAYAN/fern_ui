"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  Check,
  Code2,
  Maximize2,
  Minimize2,
  Moon,
  PanelRightClose,
  PanelRightOpen,
  Terminal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePreviewContext } from "./preview-controls"
import { installCommand } from "@/lib/components"

export function FloatingControls({
  className,
}: {
  className?: string
} = {}) {
  const {
    activeItem,
    viewMode,
    setViewMode,
    isFullscreen,
    setIsFullscreen,
    rightCollapsed,
    setRightCollapsed,
  } = usePreviewContext()

  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [copiedInstall, setCopiedInstall] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? (resolvedTheme === "dark" || theme === "dark") : true

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

  const copyInstall = React.useCallback(() => {
    if (!activeItem) return
    const cmd = installCommand(activeItem)
    navigator.clipboard.writeText(cmd)
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2000)
  }, [activeItem])

  return (
    <aside
      aria-label="Floating controls"
      className={cn(
        "fixed top-4 right-6 z-50 flex items-center gap-1.5 p-1 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/90 dark:border-white/[0.08] shadow-lg shadow-neutral-500/5 dark:shadow-black/40 select-none",
        className
      )}
    >
      {/* Install Button Pill */}
      {activeItem && (
        <button
          type="button"
          onClick={copyInstall}
          className={cn(
            "flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
            copiedInstall
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
              : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          )}
          title="Copy install command"
        >
          {copiedInstall ? (
            <>
              <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Terminal className="size-3.5 text-neutral-500 dark:text-neutral-400" />
              <span>Install</span>
            </>
          )}
        </button>
      )}

      {activeItem && <div className="h-3.5 w-px bg-neutral-200 dark:bg-neutral-800 mx-0.5" />}

      {/* Fullscreen Canvas Toggle */}
      <button
        type="button"
        onClick={() => setIsFullscreen(!isFullscreen)}
        className={cn(
          "flex size-7 items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer",
          isFullscreen && "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white"
        )}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Canvas"}
      >
        {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
      </button>

      {/* Code / Preview Switch */}
      {activeItem && (
        <button
          type="button"
          onClick={() => setViewMode(viewMode === "preview" ? "code" : "preview")}
          className={cn(
            "flex size-7 items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer",
            viewMode === "code" && "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white"
          )}
          title={viewMode === "preview" ? "View Full Code" : "Back to Preview"}
        >
          <Code2 className="size-3.5" />
        </button>
      )}

      {/* Theme Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="flex size-7 items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {mounted ? (
          isDark ? (
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" />
            </svg>
          ) : (
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
            </svg>
          )
        ) : (
          <Moon className="size-3.5" />
        )}
      </button>

      {/* Drawer Toggle */}
      {activeItem && (
        <button
          type="button"
          onClick={() => setRightCollapsed(!rightCollapsed)}
          className={cn(
            "flex size-7 items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer",
            rightCollapsed && "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white"
          )}
          title={rightCollapsed ? "Open Documentation Drawer" : "Close Drawer"}
        >
          {rightCollapsed ? (
            <PanelRightOpen className="size-3.5" />
          ) : (
            <PanelRightClose className="size-3.5" />
          )}
        </button>
      )}
    </aside>
  )
}
