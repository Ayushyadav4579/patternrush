"use client"

import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export function Hud({
  score,
  lives,
  maxLives,
  round,
  totalRounds,
  trackerScore,
  winStreak,
}: {
  score: number
  lives: number
  maxLives: number
  round: number
  totalRounds: number
  trackerScore: number
  winStreak: number
}) {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Game score</span>
          <span className="font-display text-2xl font-bold tabular-nums leading-none text-foreground">{score}</span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-primary/15 px-3 py-2 ring-1 ring-primary/25">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Score</span>
            <span className="font-display text-xl font-bold tabular-nums text-foreground">{trackerScore}</span>
          </div>
          <div className="h-8 w-px bg-primary/25" aria-hidden="true" />
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Win streak</span>
            <span className="font-display text-xl font-bold tabular-nums text-foreground">{winStreak}</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Round</span>
          <span className="font-display text-2xl font-bold tabular-nums leading-none text-foreground">
            {round}
            <span className="text-base text-muted-foreground">/{totalRounds}</span>
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Lives</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: maxLives }).map((_, i) => (
              <Heart
                key={i}
                size={20}
                className={cn(
                  "transition-all duration-300",
                  i < lives ? "text-destructive scale-100" : "text-muted-foreground/30 scale-90",
                )}
                fill="currentColor"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(round / totalRounds) * 100}%` }}
        />
      </div>
    </div>
  )
}
