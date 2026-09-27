"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { PanelLeftOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sidebar as ComponentListSidebar } from "@/components/sidebar/sidebar"
import { DescriptionPanel } from "@/components/docs/description-panel"
import { CodeView } from "@/components/docs/code-view"
import { FloatingControls } from "@/components/preview/floating-controls"
import {
  PreviewControlsProvider,
  usePreviewContext,
} from "@/components/preview/preview-controls"

function ComponentsShell({ children }: { children: React.ReactNode }) {
  const [leftCollapsed, setLeftCollapsed] = React.useState(false)
  const { viewMode, isFullscreen, activeItem } = usePreviewContext()
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#000000] text-neutral-900 dark:text-neutral-100 antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-200">
      {/* ─── Left Sidebar: Components Navigation ─── */}
      <ComponentListSidebar
        collapsed={leftCollapsed || isFullscreen}
        onToggle={() => setLeftCollapsed(!leftCollapsed)}
      />

      {/* Floating Re-open Button when Left Sidebar is Collapsed */}
      {leftCollapsed && !isFullscreen && (
        <button
          type="button"
          onClick={() => setLeftCollapsed(false)}
          className="absolute left-4 top-4 z-40 flex size-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-white/[0.08] bg-white/90 dark:bg-zinc-900/90 text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all shadow-md cursor-pointer backdrop-blur-md"
          aria-label="Open components sidebar"
        >
          <PanelLeftOpen className="size-4" />
        </button>
      )}

      {/* ─── Floating Top Controls (Install, Fullscreen, Code View, Theme, Drawer) ─── */}
      <FloatingControls />

      {/* ─── Center Canvas / Content Area ─── */}
      <main
        className={cn(
          "flex flex-1 flex-col h-full overflow-hidden transition-all duration-300 relative bg-white dark:bg-[#000000]",
          isFullscreen ? "fixed inset-0 z-50 p-4 sm:p-6" : "p-3 sm:p-5",
          leftCollapsed && !isFullscreen && "pl-12"
        )}
      >

        {/* Viewport: Live Preview Canvas OR Code Documentation */}
        {viewMode === "preview" ? (
          <div className="relative flex-1 w-full rounded-3xl border border-neutral-200/80 dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-[#0c0c0e] overflow-hidden flex flex-col items-center justify-center select-none shadow-sm transition-colors duration-200">
            {/* Subtle ambient light gradient */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 0%, transparent 65%)`,
              }}
            />
            {children}
          </div>
        ) : (
          <CodeView />
        )}
      </main>

      {/* ─── Right Documentation Drawer ─── */}
      {!isFullscreen && <DescriptionPanel />}
    </div>
  )
}

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PreviewControlsProvider>
      <ComponentsShell>{children}</ComponentsShell>
    </PreviewControlsProvider>
  )
}
