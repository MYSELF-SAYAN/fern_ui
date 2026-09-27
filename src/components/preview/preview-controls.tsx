"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { activeComponent, type ComponentItem } from "@/lib/components"
import type { Preset } from "@/components/playground/types"

interface PreviewControlsContextValue {
  values: Record<string, any>
  setValue: (key: string, value: any) => void
  setValues: React.Dispatch<React.SetStateAction<Record<string, any>>>
  activeItem?: ComponentItem
  activePresetName: string | null
  selectPreset: (preset: Preset) => void
  resetToDefaults: () => void
  viewMode: "preview" | "code"
  setViewMode: React.Dispatch<React.SetStateAction<"preview" | "code">>
  isFullscreen: boolean
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>
  rightCollapsed: boolean
  setRightCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const PreviewControlsContext = React.createContext<PreviewControlsContextValue | null>(null)

export function PreviewControlsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeItem = React.useMemo(() => activeComponent(pathname), [pathname])

  // Compute default values from active component's controls
  const defaultValues = React.useMemo(() => {
    const defaults: Record<string, any> = {}
    if (activeItem?.controls) {
      for (const [key, def] of Object.entries(activeItem.controls)) {
        defaults[key] = def.defaultValue
      }
    }
    return defaults
  }, [activeItem])

  const [values, setValues] = React.useState<Record<string, any>>(defaultValues)
  const [viewMode, setViewMode] = React.useState<"preview" | "code">("preview")
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [rightCollapsed, setRightCollapsed] = React.useState(false)

  // Reset values when switching component
  React.useEffect(() => {
    setValues(defaultValues)
    setViewMode("preview")
    setIsFullscreen(false)
  }, [defaultValues])

  const setValue = React.useCallback((key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetToDefaults = React.useCallback(() => {
    setValues(defaultValues)
  }, [defaultValues])

  const selectPreset = React.useCallback((preset: Preset) => {
    setValues((prev) => ({ ...prev, ...preset.values }))
  }, [])

  const activePresetName = React.useMemo(() => {
    if (!activeItem?.presets) return null
    for (const preset of activeItem.presets) {
      const match = Object.entries(preset.values).every(([k, v]) => values[k] === v)
      if (match) return preset.name
    }
    return null
  }, [activeItem, values])

  const contextValue = React.useMemo<PreviewControlsContextValue>(
    () => ({
      values,
      setValue,
      setValues,
      activeItem,
      activePresetName,
      selectPreset,
      resetToDefaults,
      viewMode,
      setViewMode,
      isFullscreen,
      setIsFullscreen,
      rightCollapsed,
      setRightCollapsed,
    }),
    [
      values,
      setValue,
      activeItem,
      activePresetName,
      selectPreset,
      resetToDefaults,
      viewMode,
      isFullscreen,
      rightCollapsed,
    ]
  )

  return (
    <PreviewControlsContext.Provider value={contextValue}>
      {children}
    </PreviewControlsContext.Provider>
  )
}

export function usePreviewContext() {
  const ctx = React.useContext(PreviewControlsContext)
  if (!ctx) {
    throw new Error("usePreviewContext must be used within a PreviewControlsProvider")
  }
  return ctx
}

export function usePreviewControl<T = any>(key: string, fallback: T): [T, (next: T) => void] {
  const ctx = React.useContext(PreviewControlsContext)
  const val = ctx ? (ctx.values[key] ?? fallback) : fallback
  const set = (next: T) => {
    ctx?.setValue(key, next)
  }
  return [val, set]
}
