"use client"

import * as React from "react"
import {
  OrbitGlobe,
  OrbitGlobeImage,
  type OrbitGlobeItem,
} from "@/components/ui/orbit-globe"
import { usePreviewContext } from "@/components/preview/preview-controls"
import { CanvasDock } from "@/components/preview/canvas-dock"

const demoItems: OrbitGlobeItem[] = [
  {
    id: 1,
    title: "12K Downloads",
    subtitle: "Metrics",
    description: "Milestone reached with over 12,000 developer installations worldwide.",
    href: "https://github.com",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-3.5 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md">
            Metrics
          </span>
          <span className="text-[10px] opacity-80">2026</span>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-black tracking-tight leading-none truncate">12K</p>
          <p className="mt-1 text-[11px] font-medium text-purple-100 truncate">Active installs</p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Minimalist Architecture",
    subtitle: "Architecture",
    description: "Contemporary glass and concrete pavilion with natural pine wood accents.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    content: (
      <OrbitGlobeImage
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
        alt="Minimalist Architecture"
      />
    ),
  },
  {
    id: 3,
    title: "MADRID España",
    subtitle: "Studio",
    description: "Spatial motion and typography atelier based in Madrid.",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-3.5 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md">
            Spain
          </span>
        </div>
        <div className="mt-auto">
          <p className="text-xl font-black tracking-widest uppercase leading-tight truncate">Madrid</p>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Neon Fluid Dynamics",
    subtitle: "3D Artwork",
    description: "Generative fluid physics render exploring luminescence and volumetric curves.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    content: (
      <OrbitGlobeImage
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
        alt="Neon Fluid Dynamics"
      />
    ),
  },
  {
    id: 5,
    title: "Quantum Processor",
    subtitle: "Hardware",
    description: "Cryogenic superconducting qubit array operating at near absolute zero.",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 p-3.5 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md">
            Hardware
          </span>
          <span className="text-[10px] opacity-80">128-Q</span>
        </div>
        <div className="mt-auto">
          <p className="text-xl font-black tracking-tight leading-tight truncate">Quantum</p>
          <p className="text-[10px] text-teal-100 opacity-90 truncate">Superconducting lattice</p>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Editorial Typography",
    subtitle: "Publication",
    description: "Swiss grid layout and typographic experimentation for independent press.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    content: (
      <OrbitGlobeImage
        src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop"
        alt="Editorial Typography"
      />
    ),
  },
  {
    id: 7,
    title: "Aero Concept 01",
    subtitle: "Industrial",
    description: "Ultra-low-drag aerodynamic hypercar chassis developed in wind tunnels.",
    content: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 p-3.5 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase">
            Aero
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">0.19 Cd</span>
        </div>
        <div className="mt-auto">
          <p className="text-lg font-black tracking-wider uppercase leading-tight truncate">Concept 01</p>
          <p className="text-[10px] text-zinc-400 truncate">Wind tunnel validated</p>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: "Nordic Fjord Atelier",
    subtitle: "Living",
    description: "Off-grid architectural studio nestled in the Lofoten archipelago.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
    content: (
      <OrbitGlobeImage
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop"
        alt="Nordic Fjord"
      />
    ),
  },
]

export default function OrbitGlobeDemo() {
  const { values } = usePreviewContext()

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <OrbitGlobe
        items={demoItems}
        globeSize={values.globeSize ?? 50}
        cardSize={values.cardSize ?? 24}
        cardAspect={values.cardAspect ?? "3:4"}
        tilt={values.tilt ?? 27}
        backFade={values.backFade ?? 55}
        gap={values.gap ?? 2.5}
        duration={values.duration ?? 20}
        direction={values.direction ?? "left"}
        playing={values.playing ?? true}
        pauseOnHover={values.pauseOnHover ?? true}
        draggable={values.draggable ?? true}
        zoomOnClick={values.zoomOnClick ?? true}
        wheelZoom={values.wheelZoom ?? true}
        className="h-full w-full"
      />
      <CanvasDock />
    </div>
  )
}
