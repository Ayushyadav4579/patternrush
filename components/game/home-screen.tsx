"use client"

import { useState } from "react"
import { HelpCircle, Play, Trophy, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DIFFICULTY_META, type Difficulty, type GameMode } from "@/lib/patterns"
import { cn } from "@/lib/utils"
import { HowToPlay } from "./how-to-play"

const ORDER: Difficulty[] = ["easy", "medium", "hard"]

export function HomeScreen({
  bestScore,
  difficulty,
  onDifficultyChange,
  mode,
  onModeChange,
  onPlay,
  soundOn,
  onToggleSound,
}: {
  bestScore: number
  difficulty: Difficulty
  onDifficultyChange: (d: Difficulty) => void
  mode: GameMode
  onModeChange: (mode: GameMode) => void
  onPlay: () => void
  soundOn: boolean
  onToggleSound: () => void
}) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-5 py-10">
      <button
        onClick={onToggleSound}
        aria-label={soundOn ? "Mute sound" : "Unmute sound"}
        className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-card text-muted-foreground shadow-md transition-colors hover:text-foreground"
      >
        {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      <div className="flex flex-col items-center gap-3 text-center animate-pop-in">
        <div className="flex items-center gap-1.5 rounded-full bg-primary/15 px-4 py-1.5 text-sm font-semibold text-primary">
          <Trophy size={16} />
          <span>Best Score: {bestScore}</span>
        </div>
        <h1 className="font-display text-6xl font-bold leading-none tracking-tight text-foreground text-balance sm:text-7xl">
          Pattern
          <br />
          <span className="text-primary">Master</span>
        </h1>
        <p className="max-w-xs text-pretty text-base leading-relaxed text-muted-foreground">
          Spot the pattern. Pick what comes next. Race the clock and keep your streak alive.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Game mode
        </p>
        <div className="grid grid-cols-2 gap-2">
          {([
            ["classic", "Classic", "10 rounds"],
            ["time-attack", "Time Attack", "60 seconds"],
            ["endless", "Endless", "3 hearts"],
            ["campaign", "Campaign", "Levels 1–50"],
          ] as const).map(([value, label, detail]) => (
            <button key={value} onClick={() => onModeChange(value)} aria-pressed={mode === value}
              className={cn("rounded-2xl border-2 px-3 py-2 text-left transition-all", mode === value ? "border-primary bg-primary/15 shadow-lg" : "border-transparent bg-card hover:bg-secondary")}>
              <span className="block font-display text-sm font-bold text-foreground">{label}</span>
              <span className="text-[11px] text-muted-foreground">{detail}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Difficulty
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {ORDER.map((d) => {
            const meta = DIFFICULTY_META[d]
            const active = difficulty === d
            return (
              <button
                key={d}
                onClick={() => onDifficultyChange(d)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 transition-all",
                  active
                    ? "border-primary bg-primary/15 scale-[1.03] shadow-lg"
                    : "border-transparent bg-card hover:bg-secondary",
                )}
              >
                <span className="text-2xl">{meta.emoji}</span>
                <span className="font-display text-sm font-semibold text-foreground">{meta.label}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-2 h-4 text-center text-xs text-muted-foreground">{DIFFICULTY_META[difficulty].blurb}</p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Button
          onClick={onPlay}
          className="h-16 rounded-2xl text-xl font-display font-bold shadow-xl transition-transform hover:scale-[1.02]"
        >
          <Play size={26} fill="currentColor" />
          Play
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowHelp(true)}
          className="h-13 rounded-2xl text-base font-display font-semibold"
        >
          <HelpCircle size={20} />
          How to Play
        </Button>
      </div>

      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
    </div>
  )
}
