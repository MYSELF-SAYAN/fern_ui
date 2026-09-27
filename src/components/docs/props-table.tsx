"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { ComponentProp } from "@/lib/components"

interface PropsTableProps {
  props: ComponentProp[]
  className?: string
}

export function PropsTable({ props, className }: PropsTableProps) {
  if (!props.length) return null

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h4 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold">
          PROPS
        </h4>
        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-normal">
          Options you can pass to customize this component.
        </p>
      </div>

      <div className="w-full overflow-x-auto -mx-1 px-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              <th className="py-2.5 pr-4 font-medium w-[26%]">Prop</th>
              <th className="py-2.5 pr-4 font-medium w-[24%]">Type</th>
              <th className="py-2.5 font-medium w-[50%]">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
            {props.map((prop) => (
              <tr
                key={prop.name}
                className="group transition-colors hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40"
              >
                {/* Prop Name */}
                <td className="py-3.5 pr-4 align-top">
                  <div className="flex flex-col items-start gap-1">
                    <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-mono font-medium bg-neutral-100 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/60">
                      {prop.name}
                      {prop.required && (
                        <span className="text-amber-500 text-[10px]" title="Required">*</span>
                      )}
                    </span>
                    {prop.default && (
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                        ={prop.default}
                      </span>
                    )}
                  </div>
                </td>

                {/* Prop Type */}
                <td className="py-3.5 pr-4 align-top">
                  <span className="font-mono text-xs text-neutral-600 dark:text-neutral-400 break-words leading-relaxed">
                    {prop.type}
                  </span>
                </td>

                {/* Description */}
                <td className="py-3.5 align-top">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                    {prop.description}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
