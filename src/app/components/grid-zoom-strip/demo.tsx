"use client"

import * as React from "react"
import {
  GridZoomStrip,
  GridZoomStripImage,
  type GridZoomStripItem,
} from "@/components/ui/grid-zoom-strip"
import { usePreviewContext } from "@/components/preview/preview-controls"
import { CanvasDock } from "@/components/preview/canvas-dock"

const demoItems: GridZoomStripItem[] = [
  {
    id: 1,
    title: "Minimal Concrete Pavilion",
    subtitle: "Architecture",
    badge: "01",
    description: "Contemporary glass and concrete pavilion with natural pine wood accents.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "12,400 Global Installs",
    subtitle: "Milestone",
    badge: "02",
    description: "Milestone reached with over 12,000 developer installations across 45 countries.",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md">
            Metrics
          </span>
          <span className="text-[10px] opacity-80">2026</span>
        </div>
        <div className="mt-auto">
          <p className="text-3xl font-black tracking-tight leading-none">12.4K</p>
          <p className="mt-1 text-xs font-medium text-purple-100">Global Installs</p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Generative Luminescence",
    subtitle: "3D Artwork",
    badge: "03",
    description: "Generative fluid physics render exploring luminescence and volumetric curves.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "MADRID Spatial Atelier",
    subtitle: "Editorial",
    badge: "04",
    description: "Spatial motion and typography atelier based in the historical heart of Madrid.",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md">
            Studio
          </span>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-black tracking-widest uppercase">Madrid</p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Cryogenic Quantum Qubit",
    subtitle: "Hardware",
    badge: "05",
    description: "Cryogenic superconducting qubit array operating at near absolute zero in dilution fridge.",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md">
            Hardware
          </span>
          <span className="text-[10px] opacity-80">128-Q</span>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-black tracking-tight leading-tight">Quantum</p>
          <p className="text-xs text-teal-100 opacity-90">Superconducting lattice</p>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Swiss Typographic Press",
    subtitle: "Publication",
    badge: "06",
    description: "Rigid grid experimentation and high-contrast typography for architectural zines.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Aerodynamic Hypercar 01",
    subtitle: "Engineering",
    badge: "07",
    description: "Ultra-low-drag hypercar carbon tub developed with wind-tunnel CFD simulation.",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase">
            Aero
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">0.19 Cd</span>
        </div>
        <div className="mt-auto">
          <p className="text-xl font-black tracking-wider uppercase">Concept 01</p>
          <p className="text-xs text-zinc-400">Wind tunnel validated</p>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: "Lofoten Archipelago Living",
    subtitle: "Retreat",
    badge: "08",
    description: "Autonomous solar cabin perched on arctic sea cliffs in northern Norway.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 9,
    title: "Autonomous Orbit Probe",
    subtitle: "Aerospace",
    badge: "09",
    description: "Deep space autonomous relay satellite navigating solar radiation pressure.",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-900 to-black p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-500/30 px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase text-blue-200">
            Relay
          </span>
          <span className="text-[10px] text-blue-300 font-mono">Deep-09</span>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-black tracking-tight leading-tight">Solar Probe</p>
          <p className="text-xs text-blue-200 opacity-80">Telemetry active</p>
        </div>
      </div>
    ),
  },
]

export default function GridZoomStripDemo() {
  const { values } = usePreviewContext()

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <GridZoomStrip
        items={demoItems}
        zoom={values.itemScale ? values.itemScale * 2.2 : 2.2}
        gap={values.gap ? values.gap / 8 : 2.0}
        wheelScrub={values.allowManualScroll ?? true}
        draggable={values.allowManualScroll ?? true}
        className="h-full w-full"
      />
      <CanvasDock />
    </div>
  )
}
