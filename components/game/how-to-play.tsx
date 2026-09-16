"use client"

import { useEffect } from "react"
import { Heart, Timer, Trophy, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const RULES = [
  { icon: Zap, title: "Find the pattern", text: "A sequence of numbers, colors, shapes or arrows appears with a missing last slot." },
  { icon: Trophy, title: "Pick what's next", text: "Tap one of the four answers. Only one is logically correct. Correct = +100 points." },
  { icon: Timer, title: "Be quick", text: "Answer fast for a speed bonus. The timer bar shows how long you have left." },
  { icon: Heart, title: "Guard your lives", text: "You have 3 lives. A wrong answer or running out of time costs one. Survive all 10 rounds!" },
]

export function HowToPlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-4 backdrop-blur-sm sm:items-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="How to play"
    >
      <div
        className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-foreground">How to Play</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <ul className="flex flex-col gap-4">
          {RULES.map((r) => (
            <li key={r.title} className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <r.icon size={20} />
              </span>
              <div>
                <p className="font-display font-semibold text-foreground">{r.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <Button onClick={onClose} className="mt-6 h-12 w-full rounded-2xl font-display text-base font-semibold">
          Got it!
        </Button>
      </div>
    </div>
  )
}
