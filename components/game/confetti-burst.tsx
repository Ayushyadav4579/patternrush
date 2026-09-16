"use client"

import { useMemo } from "react"

const PIECE_COLORS = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#a855f7", "#ffffff"]

// A short, GPU-friendly confetti pop. Rendered only while a correct answer shows.
export function ConfettiBurst({ count = 18 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
        const distance = 70 + Math.random() * 90
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 30,
          rotate: Math.random() * 540 - 270,
          delay: Math.random() * 0.06,
          color: PIECE_COLORS[i % PIECE_COLORS.length],
          size: 7 + Math.random() * 7,
          round: Math.random() > 0.5,
        }
      }),
    [count],
  )

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-visible" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute animate-confetti"
          style={
            {
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.round ? "9999px" : "2px",
              animationDelay: `${p.delay}s`,
              "--x": `${p.x}px`,
              "--y": `${p.y}px`,
              "--r": `${p.rotate}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
