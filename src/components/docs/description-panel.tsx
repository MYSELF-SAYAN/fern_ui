"use client"

import * as React from "react"
import { Copy, Check, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePreviewContext } from "@/components/preview/preview-controls"
import { CustomizationSidebar } from "@/components/playground/customization-sidebar"
import { PropsTable } from "./props-table"
import { CodeBlock } from "./code-block"
import { installCommand, PACKAGE_MANAGERS, type PackageManager } from "@/lib/components"

export function DescriptionPanel() {
  const {
    activeItem,
    values,
    setValue,
    resetToDefaults,
    selectPreset,
    rightCollapsed,
  } = usePreviewContext()

  const [copiedInstall, setCopiedInstall] = React.useState(false)
  const [copiedSnippet, setCopiedSnippet] = React.useState(false)
  const [pkgManager, setPkgManager] = React.useState<PackageManager>("npm")

  if (!activeItem) return null

  const {
    name,
    badge,
    description,
    dependencies,
    controls,
    presets,
    props: propsDocs,
    codeExample,
    filePath,
  } = activeItem

  const currentInstallCmd = installCommand(activeItem, pkgManager)

  const copyInstall = () => {
    navigator.clipboard.writeText(currentInstallCmd)
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2000)
  }

  const copySnippet = () => {
    navigator.clipboard.writeText(codeExample)
    setCopiedSnippet(true)
    setTimeout(() => setCopiedSnippet(false), 2000)
  }

  return (
    <aside
      data-slot="documentation-drawer"
      className={cn(
        "flex flex-col border-l border-neutral-200/80 dark:border-white/[0.06] bg-white dark:bg-[#000000] transition-all duration-300 ease-in-out shrink-0 overflow-y-auto select-text",
        rightCollapsed ? "w-0 border-l-0 overflow-hidden" : "w-[380px] xl:w-[420px]"
      )}
    >
      <div className="px-6 sm:px-7 py-8 pt-20 space-y-8 w-[380px] xl:w-[420px]">
        {/* 1. Header & Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              {name}
            </h1>
            {badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 border border-neutral-200/80 dark:border-white/[0.08]">
                {badge}
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* 2. DEPENDENCIES */}
        {dependencies.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold">
              DEPENDENCIES
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {dependencies.map((dep) => (
                <span
                  key={dep}
                  className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200/80 dark:border-white/[0.08]"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 3. CONTROLS (Live parameter customizer) */}
        {Object.keys(controls).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold">
                CONTROLS
              </h4>
              <button
                type="button"
                onClick={resetToDefaults}
                className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30">
              <CustomizationSidebar
                controls={controls}
                values={values}
                onChange={setValue}
                presets={presets}
                onSelectPreset={selectPreset}
                onReset={resetToDefaults}
                title=""
              />
            </div>
          </div>
        )}

        {/* 5. PROPS (Tabular layout) */}
        {propsDocs.length > 0 && (
          <div className="space-y-3">
            <PropsTable props={propsDocs} />
          </div>
        )}

        {/* 6. INSTALLATION */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold">
              INSTALLATION
            </h4>

            {/* Package Manager Selector: radio tabs */}
            <div className="flex items-center gap-2">
              {PACKAGE_MANAGERS.map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPkgManager(pm)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer",
                    pkgManager === pm
                      ? "text-neutral-900 dark:text-neutral-100 font-semibold"
                      : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  )}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50/80 dark:bg-zinc-900/40">
            <code className="text-xs font-mono text-neutral-800 dark:text-zinc-200 truncate select-all">
              {currentInstallCmd}
            </code>
            <button
              type="button"
              onClick={copyInstall}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-white/[0.08] transition-colors shrink-0 cursor-pointer border border-neutral-200 dark:border-white/[0.06]"
              title="Copy install command"
            >
              {copiedInstall ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 7. HOW TO USE */}
        {codeExample && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold">
                HOW TO USE
              </h4>
              <button
                type="button"
                onClick={copySnippet}
                className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer"
              >
                {copiedSnippet ? "Copied" : "Copy"}
              </button>
            </div>
            <CodeBlock code={codeExample} language="tsx" />
          </div>
        )}

        {/* 8. SOURCE LINK */}
        <div className="pt-2 border-t border-neutral-200/80 dark:border-white/[0.06] text-xs text-neutral-400 dark:text-neutral-500">
          Source: <span className="font-mono text-neutral-600 dark:text-neutral-400">{filePath}</span>
        </div>
      </div>
    </aside>
  )
}
