"use client"

import * as React from "react"
import { Check, Copy, Download } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  className?: string
  showLineNumbers?: boolean
  maxHeight?: string
  downloadFilename?: string
}

export function CodeBlock({
  code,
  language = "tsx",
  title,
  className,
  showLineNumbers = true,
  maxHeight,
  downloadFilename,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const handleDownload = React.useCallback(() => {
    if (!downloadFilename) return
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = downloadFilename
    link.click()
    URL.revokeObjectURL(url)
  }, [code, downloadFilename])

  const lines = React.useMemo(() => code.split("\n"), [code])

  return (
    <div
      data-slot="code-block"
      className={cn(
        "group relative rounded-2xl border border-white/[0.08] bg-[#0c0c0e] overflow-hidden shadow-xl",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="size-2.5 rounded-full bg-white/[0.12]" />
            <div className="size-2.5 rounded-full bg-white/[0.12]" />
            <div className="size-2.5 rounded-full bg-white/[0.12]" />
          </div>
          {title ? (
            <span className="text-xs font-mono font-medium text-zinc-300">
              {title}
            </span>
          ) : (
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              {language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {downloadFilename && (
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Download file"
            >
              <Download className="size-3" />
              <span>Download</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer border border-white/[0.06]",
              copied
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                : "bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08]"
            )}
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5 text-zinc-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div
        className="overflow-x-auto p-4 text-[13px] font-mono leading-relaxed"
        style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
      >
        <pre className="m-0 p-0">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex hover:bg-white/[0.02] py-0.5">
                {showLineNumbers && (
                  <span className="inline-block w-10 shrink-0 text-right pr-4 text-neutral-600 select-none text-xs">
                    {i + 1}
                  </span>
                )}
                <span className="text-neutral-200 whitespace-pre">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
