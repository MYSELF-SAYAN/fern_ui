"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Copy, Terminal } from "lucide-react"
import { CodeBlock } from "./code-block"
import { usePreviewContext } from "@/components/preview/preview-controls"
import { installCommand } from "@/lib/components"

export function CodeView() {
  const { activeItem, setViewMode } = usePreviewContext()
  const [sourceCode, setSourceCode] = React.useState<string>("// Loading component source...")
  const [copiedInstall, setCopiedInstall] = React.useState(false)

  React.useEffect(() => {
    if (!activeItem) return
    let cancelled = false
    setSourceCode("// Loading component source...")

    fetch(`/api/source?name=${encodeURIComponent(activeItem.slug)}`)
      .then((res) => (res.ok ? res.text() : "// Source code unavailable."))
      .then((text) => {
        if (!cancelled) setSourceCode(text)
      })
      .catch(() => {
        if (!cancelled) setSourceCode("// Unable to load source code.")
      })

    return () => {
      cancelled = true
    }
  }, [activeItem])

  if (!activeItem) return null

  const cmd = installCommand(activeItem)

  const copyInstall = () => {
    navigator.clipboard.writeText(cmd)
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2000)
  }

  return (
    <motion.div
      key="code-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex-1 w-full rounded-3xl border border-neutral-200/80 dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-[#0c0c0e] overflow-y-auto p-6 sm:p-10 space-y-10"
    >
      {/* Header Info */}
      <div className="space-y-3 border-b border-neutral-200 dark:border-white/[0.06] pb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <span className="uppercase tracking-widest text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
              {activeItem.category}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
              {activeItem.filePath}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 text-xs font-medium text-neutral-700 dark:text-zinc-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft className="size-3" />
            <span>Preview</span>
          </button>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-zinc-100 tracking-tight">
          {activeItem.name} Implementation
        </h2>
        <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed">
          Installation CLI command, required packages, and complete source code.
        </p>
      </div>

      {/* 1. CLI Installation Command */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-neutral-500 dark:text-zinc-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-zinc-400 font-medium">
            Component Installation
          </h3>
        </div>
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-zinc-900/30">
          <code className="text-xs font-mono text-neutral-800 dark:text-zinc-200 truncate select-all">
            {cmd}
          </code>
          <button
            type="button"
            onClick={copyInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors shrink-0 cursor-pointer border border-neutral-200 dark:border-white/[0.06]"
          >
            {copiedInstall ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Full Component Source Code */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-zinc-400 font-medium">
            Full Component Source Code
          </h3>
          <span className="text-xs text-neutral-400 dark:text-zinc-500 font-mono">
            {activeItem.slug}.tsx
          </span>
        </div>
        <CodeBlock
          code={sourceCode}
          language="tsx"
          title={`${activeItem.slug}.tsx`}
          downloadFilename={`${activeItem.slug}.tsx`}
          showLineNumbers
        />
      </div>
    </motion.div>
  )
}
