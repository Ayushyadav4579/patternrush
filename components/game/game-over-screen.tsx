"use client"

import { Home, RotateCcw, Sparkles, Target, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DIFFICULTY_META } from "@/lib/patterns"
import type { GameResult } from "./game-screen"

export function GameOverScreen({
  result,
  bestScore,
  isNewBest,
  onPlayAgain,
  onHome,
}: {
  result: GameResult
  bestScore: number
  isNewBest: boolean
  onPlayAgain: () => void
  onHome: () => void
}) {
  const meta = DIFFICULTY_META[result.difficulty]
  const accuracy = Math.round((result.correct / result.totalRounds) * 100)

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-5 py-10">
      <div className="flex flex-col items-center gap-2 text-center animate-pop-in">
        <span className="grid size-16 place-items-center rounded-2xl bg-primary/15 text-primary">
          {isNewBest ? <Sparkles size={32} /> : <Trophy size={32} />}
        </span>
        <h1 className="font-display text-4xl font-bold text-foreground">
          {isNewBest ? "New Best!" : "Game Over"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {meta.emoji} {meta.label} difficulty
        </p>
      </div>

      <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl animate-pop-in">
        <div className="flex flex-col items-center gap-1 border-b border-border pb-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Final Score</span>
          <span className="font-display text-6xl font-bold tabular-nums text-primary">{result.score}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-5">
          <Stat icon={<Target size={18} />} label="Correct" value={`${result.correct}/${result.totalRounds}`} />
          <Stat icon={<Sparkles size={18} />} label="Accuracy" value={`${accuracy}%`} />
          <Stat icon={<Trophy size={18} />} label="Best" value={`${bestScore}`} />
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Button
          onClick={onPlayAgain}
          className="h-16 rounded-2xl text-xl font-display font-bold shadow-xl transition-transform hover:scale-[1.02]"
        >
          <RotateCcw size={24} />
          Play Again
        </Button>
        <Button
          variant="secondary"
          onClick={onHome}
          className="h-13 rounded-2xl text-base font-display font-semibold"
        >
          <Home size={20} />
          Home
        </Button>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-secondary/60 py-3">
      <span className="text-primary">{icon}</span>
      <span className="font-display text-lg font-bold tabular-nums text-foreground">{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  )
}
