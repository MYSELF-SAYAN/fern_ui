"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RotateCcw, Sliders } from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  ControlsSchema,
  ControlDef,
  NumberControlDef,
  BooleanControlDef,
  SelectControlDef,
  StringControlDef,
  ColorControlDef,
  CustomizationSidebarProps,
} from "./types"

export function CustomizationSidebar<S extends ControlsSchema>({
  controls,
  values,
  onChange,
  presets = [],
  onSelectPreset,
  onReset,
  title,
  className,
}: CustomizationSidebarProps<S>) {
  // Group controls by category (or "General")
  const categories = React.useMemo(() => {
    const map = new Map<string, { key: string; def: ControlDef }[]>()
    for (const [key, def] of Object.entries(controls)) {
      const cat = def.category || "General"
      if (!map.has(cat)) {
        map.set(cat, [])
      }
      map.get(cat)!.push({ key, def })
    }
    return Array.from(map.entries())
  }, [controls])

  return (
    <div
      data-slot="customization-sidebar"
      className={cn(
        "flex flex-col gap-4 text-neutral-800 dark:text-zinc-200 select-text",
        className
      )}
    >
      {/* Top Header - only rendered if title is provided */}
      {Boolean(title) && (
        <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-neutral-100 dark:bg-white/[0.06] text-neutral-700 dark:text-zinc-300 border border-neutral-200/80 dark:border-white/[0.08]">
              <Sliders className="size-3" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-zinc-100 tracking-tight">{title}</h3>
            </div>
          </div>

          {onReset && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onReset}
              title="Reset all properties to defaults"
              className="text-neutral-400 dark:text-zinc-500 hover:text-neutral-900 dark:hover:text-white"
            >
              <RotateCcw className="size-3" />
            </Button>
          )}
        </div>
      )}

      {/* Presets Quick Selector */}
      {presets.length > 0 && onSelectPreset && (
        <div className="space-y-2 pb-2 border-b border-neutral-200/60 dark:border-white/[0.06]">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-neutral-400 dark:text-zinc-500 font-semibold select-text">
            PRESETS
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => {
              const isActive = Object.entries(preset.values).every(
                ([k, v]) => values[k] === v
              )
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  className={cn(
                    "text-[11px] px-2.5 py-1 rounded-md border font-medium transition-all cursor-pointer select-text",
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-xs font-semibold"
                      : "bg-white/70 dark:bg-white/[0.04] text-neutral-600 dark:text-zinc-400 border-neutral-200/80 dark:border-white/[0.08] hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.08]"
                  )}
                  title={preset.description}
                >
                  {preset.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Render Control Categories */}
      <div className="space-y-5">
        {categories.map(([category, items]) => (
          <div key={category} className="space-y-3">
            {categories.length > 1 && category !== "General" && (
              <div className="flex items-center gap-2 pt-1 pb-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-neutral-400 dark:text-zinc-500 font-semibold select-text">
                  {category}
                </span>
                <div className="flex-1 h-px bg-neutral-200/60 dark:bg-white/[0.06]" />
              </div>
            )}

            <div className="space-y-3">
              {items.map(({ key, def }) => (
                <ControlField
                  key={key}
                  propKey={key}
                  def={def}
                  value={values[key] ?? def.defaultValue}
                  onChange={(val) => onChange(key, val)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Individual Control Field Renderer ───────────────────────────────────────

interface ControlFieldProps {
  propKey: string
  def: ControlDef
  value: any
  onChange: (val: any) => void
}

function ControlField({ propKey, def, value, onChange }: ControlFieldProps) {
  switch (def.type) {
    case "number":
      return <NumberControl def={def} value={value} onChange={onChange} />
    case "boolean":
      return <BooleanControl def={def} value={value} onChange={onChange} />
    case "select":
      return <SelectControl def={def} value={value} onChange={onChange} />
    case "string":
      return <StringControl def={def} value={value} onChange={onChange} />
    case "color":
      return <ColorControl def={def} value={value} onChange={onChange} />
    default:
      return null
  }
}

// ─── Number Slider Control ──────────────────────────────────────────────────

function NumberControl({
  def,
  value,
  onChange,
}: {
  def: NumberControlDef
  value: number
  onChange: (val: number) => void
}) {
  const min = def.min ?? 0
  const max = def.max ?? 100
  const step = def.step ?? 1
  const unit = def.unit ?? ""
  const currentVal = typeof value === "number" && !isNaN(value) ? value : (def.defaultValue ?? min)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span
          className="font-medium text-neutral-700 dark:text-zinc-300 tracking-tight select-text"
          title={def.description}
        >
          {def.label}
        </span>
        <span className="font-mono text-[11px] font-medium text-neutral-600 dark:text-zinc-400 bg-neutral-200/50 dark:bg-white/[0.05] px-1.5 py-0.5 rounded border border-neutral-300/40 dark:border-white/[0.06] select-text">
          {currentVal}
          {unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[currentVal]}
        onValueChange={(val) => {
          const num = Array.isArray(val) ? val[0] : val
          onChange(num)
        }}
        className="py-1"
      />
    </div>
  )
}

// ─── Boolean Switch Control ─────────────────────────────────────────────────

function BooleanControl({
  def,
  value,
  onChange,
}: {
  def: BooleanControlDef
  value: boolean
  onChange: (val: boolean) => void
}) {
  const id = React.useId()

  return (
    <div className="flex items-center justify-between py-1 transition-colors">
      <label
        htmlFor={id}
        className="text-xs font-medium text-neutral-700 dark:text-zinc-300 cursor-pointer select-text tracking-tight"
        title={def.description}
      >
        {def.label}
      </label>
      <Switch
        id={id}
        checked={Boolean(value)}
        onCheckedChange={(checked) => onChange(Boolean(checked))}
      />
    </div>
  )
}

// ─── Select / Segmented Control ─────────────────────────────────────────────

function SelectControl({
  def,
  value,
  onChange,
}: {
  def: SelectControlDef
  value: any
  onChange: (val: any) => void
}) {
  const normalizedOptions = React.useMemo(() => {
    return def.options.map((opt) => {
      if (typeof opt === "object" && opt !== null && "value" in opt) {
        return opt
      }
      return { label: String(opt), value: opt }
    })
  }, [def.options])

  const isSegmented =
    def.display === "segmented" ||
    (def.display === undefined && normalizedOptions.length <= 4)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span
          className="font-medium text-neutral-700 dark:text-zinc-300 tracking-tight select-text"
          title={def.description}
        >
          {def.label}
        </span>
      </div>

      {isSegmented ? (
        <div
          className={cn(
            "grid gap-1 p-0.5 rounded-lg bg-neutral-200/60 dark:bg-zinc-900/60 border border-neutral-300/40 dark:border-white/[0.06]",
            normalizedOptions.length === 2 && "grid-cols-2",
            normalizedOptions.length === 3 && "grid-cols-3",
            normalizedOptions.length === 4 && "grid-cols-4",
            normalizedOptions.length > 4 && "grid-cols-2 sm:grid-cols-3"
          )}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = String(value) === String(opt.value)
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => onChange(opt.value)}
                className={cn(
                  "flex items-center justify-center gap-1 rounded-md py-1 px-2 text-[11px] font-medium transition-all cursor-pointer truncate select-text",
                  isSelected
                    ? "bg-white dark:bg-zinc-800 text-neutral-950 dark:text-zinc-100 font-semibold shadow-xs border border-black/5 dark:border-white/10"
                    : "text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white"
                )}
                title={opt.label}
              >
                {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                <span className="truncate">{opt.label}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <select
          value={String(value)}
          onChange={(e) => {
            const targetVal = e.target.value
            const matched = normalizedOptions.find((opt) => String(opt.value) === targetVal)
            onChange(matched ? matched.value : targetVal)
          }}
          className="w-full rounded-lg border border-neutral-300/60 dark:border-white/[0.08] bg-white dark:bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-neutral-800 dark:text-zinc-200 outline-none focus:border-neutral-400 dark:focus:border-zinc-500 transition-colors cursor-pointer select-text"
        >
          {normalizedOptions.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

// ─── String Text Control ────────────────────────────────────────────────────

function StringControl({
  def,
  value,
  onChange,
}: {
  def: StringControlDef
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs">
        <span
          className="font-medium text-neutral-700 dark:text-zinc-300 tracking-tight"
          title={def.description}
        >
          {def.label}
        </span>
      </div>
      <Input
        value={value ?? ""}
        placeholder={def.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 text-xs border-neutral-300/60 dark:border-white/10 bg-neutral-50/80 dark:bg-white/5 text-neutral-900 dark:text-white"
      />
    </div>
  )
}

// ─── Color Control ──────────────────────────────────────────────────────────

function ColorControl({
  def,
  value,
  onChange,
}: {
  def: ColorControlDef
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span
          className="font-medium text-neutral-700 dark:text-zinc-300 tracking-tight"
          title={def.description}
        >
          {def.label}
        </span>
        <div className="flex items-center gap-1.5">
          <div
            className="size-3.5 rounded-full border border-neutral-300 dark:border-white/20"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-[10px] text-neutral-500 dark:text-zinc-400">{value}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-7 cursor-pointer rounded-md border border-neutral-300 dark:border-white/10 bg-transparent p-0"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 flex-1 font-mono text-xs border-neutral-300/60 dark:border-white/10 bg-neutral-50/80 dark:bg-white/5 text-neutral-900 dark:text-white"
        />
      </div>
    </div>
  )
}
