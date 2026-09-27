import * as React from "react"

export type ControlType = "number" | "boolean" | "select" | "string" | "color"

export interface BaseControlDef<T = any> {
  label: string
  description?: string
  category?: string
  defaultValue: T
}

export interface NumberControlDef extends BaseControlDef<number> {
  type: "number"
  min?: number
  max?: number
  step?: number
  unit?: string
}

export interface BooleanControlDef extends BaseControlDef<boolean> {
  type: "boolean"
}

export interface SelectOption<T = string | number> {
  label: string
  value: T
  icon?: React.ReactNode
}

export interface SelectControlDef<T = string | number> extends BaseControlDef<T> {
  type: "select"
  options: (T | SelectOption<T>)[]
  display?: "segmented" | "select"
}

export interface StringControlDef extends BaseControlDef<string> {
  type: "string"
  placeholder?: string
}

export interface ColorControlDef extends BaseControlDef<string> {
  type: "color"
}

export type ControlDef =
  | NumberControlDef
  | BooleanControlDef
  | SelectControlDef<any>
  | StringControlDef
  | ColorControlDef

export type ControlsSchema = Record<string, ControlDef>

export type InferControlValues<S extends ControlsSchema> = {
  [K in keyof S]: S[K]["defaultValue"]
}

export interface Preset<T = Record<string, any>> {
  name: string
  description?: string
  values: Partial<T>
}

export interface CustomizationSidebarProps<S extends ControlsSchema = ControlsSchema> {
  controls: S
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  presets?: Preset<any>[]
  onSelectPreset?: (preset: Preset<any>) => void
  onReset?: () => void
  title?: string
  className?: string
}

export interface ComponentPlaygroundProps<S extends ControlsSchema = ControlsSchema> {
  title: string
  description?: string
  badge?: string
  icon?: React.ReactNode
  installCommand?: string
  controls: S
  presets?: Preset<InferControlValues<S>>[]
  initialValues?: Partial<InferControlValues<S>>
  className?: string
  canvasClassName?: string
  sidebarClassName?: string
  hint?: React.ReactNode
  stats?: (values: InferControlValues<S>) => React.ReactNode
  children: (
    props: InferControlValues<S>,
    setProp: <K extends keyof S>(key: K, value: S[K]["defaultValue"]) => void
  ) => React.ReactNode
}
