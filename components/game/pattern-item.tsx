"use client"

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Circle,
  Diamond,
  Hexagon,
  Square,
  Star,
  Triangle,
  type LucideIcon,
} from "lucide-react"
import { COLORS, SHAPES, SYMBOLS, type Item } from "@/lib/patterns"
import { cn } from "@/lib/utils"

const SHAPE_ICONS: Record<(typeof SHAPES)[number], LucideIcon> = {
  circle: Circle,
  square: Square,
  triangle: Triangle,
  diamond: Diamond,
  star: Star,
  hexagon: Hexagon,
}

const SYMBOL_ICONS: Record<(typeof SYMBOLS)[number], LucideIcon> = {
  up: ArrowUp,
  right: ArrowRight,
  down: ArrowDown,
  left: ArrowLeft,
}

export function describeItem(item: Item): string {
  if (item.kind === "number") return `Number ${item.value}`
  if (item.kind === "color") return `${COLORS[item.value].name} circle`
  if (item.kind === "shape") return `${SHAPES[item.value]} shape`
  if (item.kind === "letter") return `Letter ${String.fromCharCode(65 + item.value)}`
  return `Arrow pointing ${SYMBOLS[item.value]}`
}

export function PatternItem({ item, size = "md" }: { item: Item; size?: "sm" | "md" | "lg" }) {
  const iconSize = size === "lg" ? 40 : size === "md" ? 32 : 24
  const textClass = size === "lg" ? "text-4xl" : size === "md" ? "text-3xl" : "text-2xl"

  if (item.kind === "number") {
    return <span className={cn("font-display font-bold tabular-nums text-foreground", textClass)}>{item.value}</span>
  }

  if (item.kind === "color") {
    const color = COLORS[item.value]
    return (
      <span
        aria-label={color.name}
        className="block rounded-full ring-2 ring-white/25 shadow-lg"
        style={{
          backgroundColor: color.hex,
          width: iconSize + 6,
          height: iconSize + 6,
        }}
      />
    )
  }

  if (item.kind === "shape") {
    const Icon = SHAPE_ICONS[SHAPES[item.value]]
    return <Icon size={iconSize} className="text-accent" strokeWidth={2.25} fill="currentColor" fillOpacity={0.25} />
  }

  if (item.kind === "letter") {
    return <span className={cn("font-display font-bold uppercase text-accent", textClass)}>{String.fromCharCode(65 + item.value)}</span>
  }

  const Icon = SYMBOL_ICONS[SYMBOLS[item.value]]
  return <Icon size={iconSize} className="text-accent" strokeWidth={3} />
}
