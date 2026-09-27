"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Leaf, PanelLeftClose, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCategories } from "@/lib/components"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}



export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const registryCategories = React.useMemo(() => getCategories(), [])
  const [search, setSearch] = React.useState("")

  const activeSlug = pathname.split("/").pop() ?? ""

  const filteredCategories = React.useMemo(() => {
    if (!search.trim()) return registryCategories
    const q = search.toLowerCase()
    return registryCategories
      .map(({ category, components }) => ({
        category,
        components: components.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.slug.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
        ),
      }))
      .filter(({ components }) => components.length > 0)
  }, [registryCategories, search])

  const totalCount = React.useMemo(() => {
    return registryCategories.reduce((acc, cat) => acc + cat.components.length, 0)
  }, [registryCategories])

  return (
    <aside
      data-slot="components-sidebar"
      className={cn(
        "relative flex flex-col border-r border-neutral-200/80 dark:border-white/[0.06] bg-white dark:bg-[#000000] text-neutral-600 dark:text-zinc-300 transition-all duration-300 ease-in-out shrink-0 select-none",
        collapsed ? "w-0 border-r-0 overflow-hidden" : "w-64"
      )}
    >
      <div className="flex flex-col h-full w-64">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2.5">
          <Link
            href="/"
            className="flex items-center gap-2 px-1.5 py-1 -ml-1 rounded-md hover:bg-neutral-100 dark:hover:bg-zinc-900/80 transition-colors group"
            title="Fern UI Home"
          >
            <div className="size-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Leaf className="size-3.5" />
            </div>
            <span className="text-sm font-bold text-neutral-900 dark:text-zinc-100 tracking-tight">
              Fern UI
            </span>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-zinc-800/80 text-neutral-600 dark:text-zinc-400 border border-neutral-200 dark:border-white/[0.06]">
              {totalCount}
            </span>
          </Link>

          <button
            type="button"
            onClick={onToggle}
            className="flex size-7 items-center justify-center rounded-md border border-neutral-200 dark:border-white/[0.08] bg-neutral-100/80 dark:bg-zinc-900/60 text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="size-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 dark:text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search components..."
              className="w-full h-8 pl-8 pr-7 text-xs rounded-lg bg-neutral-100/70 dark:bg-zinc-900/40 border border-neutral-200 dark:border-white/[0.06] text-neutral-900 dark:text-zinc-200 placeholder:text-neutral-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-neutral-400 dark:focus:border-zinc-500 focus:bg-white dark:focus:bg-zinc-900/80 transition-all"
            />
            {!search && (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-400 dark:text-zinc-500 border border-neutral-200 dark:border-white/[0.06] bg-neutral-100 dark:bg-zinc-800/40 px-1 py-0.2 rounded pointer-events-none">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Categories & Navigation List */}
        <ScrollArea className="flex-1 px-3 py-3">
          <nav className="space-y-6">
            {/* Active Registry Categories */}
            {filteredCategories.map(({ category, components }) => (
              <div key={category} className="space-y-1">
                <div className="px-3 py-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-zinc-500 font-medium">
                    {category}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {components.map((c) => {
                    const isActive = activeSlug === c.slug
                    return (
                      <Link
                        key={c.slug}
                        href={`/components/${c.slug}`}
                        className={cn(
                          "group relative flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-all duration-150",
                          isActive
                            ? "text-neutral-900 dark:text-zinc-100 font-medium bg-neutral-100 dark:bg-white/[0.07] shadow-xs"
                            : "text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-200 hover:bg-neutral-100/50 dark:hover:bg-white/[0.03]"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              "size-1.5 rounded-full shrink-0 transition-all",
                              isActive
                                ? "bg-neutral-900 dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.25)] dark:shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                                : "bg-transparent group-hover:bg-neutral-400 dark:group-hover:bg-zinc-600"
                            )}
                          />
                          <span className="truncate">{c.name}</span>
                        </div>
                        {c.badge && (
                          <span className="text-[10px] font-mono text-neutral-400 dark:text-zinc-500 group-hover:text-neutral-600 dark:group-hover:text-zinc-400">
                            {c.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}


          </nav>
        </ScrollArea>

        {/* Minimalist Library Info Card at Bottom */}
        <div className="p-3.5 border-t border-neutral-200/80 dark:border-white/[0.06] shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 p-2.5 rounded-xl border border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/80 dark:bg-zinc-900/40 hover:bg-neutral-100 dark:hover:bg-zinc-900/70 transition-colors group"
          >
            <div className="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <Leaf className="size-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-900 dark:text-zinc-200 truncate">
                  Fern UI
                </p>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-zinc-500 truncate font-mono mt-0.5">
                Tailwind & Motion
              </p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  )
}
