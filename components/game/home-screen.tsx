"use client"

import { useState } from "react"
import { Brain, Calculator, Check, CircleDot, Focus, Gamepad2, HelpCircle, MemoryStick, Play, Trophy, Volume2, VolumeX } from "lucide-react"
import { CampaignMap, LeaderboardButton, LeaderboardDrawer, QuestPanel, ShopCard } from "./leaderboard-drawer"
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
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const games = [
    { value: "classic" as GameMode, title: "Daily Pattern", instruction: "Find what comes next in the sequence.", category: "FOCUS", icon: Brain, tone: "from-cyan-400/30 to-teal-400/10" },
    { value: "time-attack" as GameMode, title: "Quick Count", instruction: "Solve as many patterns as you can in 60 seconds.", category: "SPEED", icon: Calculator, tone: "from-emerald-400/30 to-cyan-400/10" },
    { value: "endless" as GameMode, title: "Memory Path", instruction: "Keep going until you make three mistakes.", category: "MEMORY", icon: MemoryStick, tone: "from-blue-400/30 to-cyan-400/10" },
    { value: "campaign" as GameMode, title: "Number Steps", instruction: "Complete a clear path through 50 levels.", category: "CALC", icon: CircleDot, tone: "from-teal-400/30 to-emerald-400/10" },
  ]

  return (
    <div className="relative min-h-[100dvh] px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-7">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-accent/15 text-accent ring-1 ring-accent/25"><Gamepad2 /></div>
            <div><p className="text-lg font-bold tracking-tight text-foreground">Pattern<span className="text-accent">Rush</span></p><p className="text-sm text-muted-foreground">Brain training, made simple</p></div>
          </div>
          <div className="flex items-center gap-2">
            <LeaderboardButton onClick={() => setShowLeaderboard(true)} />
            <button onClick={onToggleSound} aria-label={soundOn ? "Mute sound" : "Unmute sound"} className="grid size-12 place-items-center rounded-2xl bg-card text-muted-foreground ring-1 ring-border transition hover:text-foreground hover:ring-accent/60">{soundOn ? <Volume2 /> : <VolumeX />}</button>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 p-6 shadow-2xl shadow-cyan-950/40 sm:p-9" aria-labelledby="welcome-title">
          <div className="hero-glow absolute -right-16 -top-20 size-64 rounded-full bg-white/20 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl"><p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-50/80">Today&apos;s brain warm-up</p><h1 id="welcome-title" className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">Ready to play?</h1><p className="mt-3 text-lg leading-relaxed text-cyan-50">New puzzle today <span aria-hidden="true">•</span> Complete the path 1 <span aria-hidden="true">→</span> 5</p></div>
            <Button onClick={onPlay} className="h-16 shrink-0 rounded-2xl bg-white px-7 text-xl font-bold text-slate-900 shadow-xl transition hover:scale-[1.03] hover:bg-cyan-50 active:scale-95"><Play fill="currentColor" data-icon="inline-start" /> Start</Button>
          </div>
        </section>

        <section aria-labelledby="games-title"><div className="mb-4 flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">Choose an activity</p><h2 id="games-title" className="mt-1 font-display text-3xl font-bold text-foreground">Play a game</h2></div><div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex"><Trophy className="text-warning" /> Best {bestScore}</div></div>
          <div className="grid gap-5 sm:grid-cols-2">
            {games.map((game) => { const Icon = game.icon; const active = mode === game.value; return <button key={game.value} onClick={() => { onModeChange(game.value); onPlay() }} className={cn("group flex min-h-56 flex-col justify-between rounded-3xl border p-6 text-left shadow-lg transition duration-200 hover:-translate-y-1 hover:scale-[1.015] active:scale-[.98]", active ? "border-accent/70 bg-card shadow-accent/10" : "border-border/80 bg-card/80 hover:border-accent/50")}><div><div className={cn("mb-6 grid size-14 place-items-center rounded-2xl bg-gradient-to-br ring-1 ring-white/10", game.tone)}><Icon className="text-accent" size={28} /></div><div className="flex items-center gap-2"><h3 className="font-display text-2xl font-bold text-foreground">{game.title}</h3>{game.value === "classic" && <span className="text-warning" aria-label="Daily challenge complete"><Check size={20} /></span>}</div><p className="mt-2 max-w-xs text-base leading-relaxed text-muted-foreground">{game.instruction}</p></div><div className="mt-7 flex items-center justify-between"><span className="text-xs font-bold tracking-[0.18em] text-muted-foreground">{game.category}</span><span className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-4 font-bold text-accent-foreground shadow-lg shadow-accent/20 transition group-hover:shadow-accent/40">Play <Play size={16} fill="currentColor" /></span></div></button> })}
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2"><div className="rounded-3xl border border-border/80 bg-card/80 p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-display text-xl font-bold">Difficulty</h2><p className="mt-1 text-sm text-muted-foreground">Choose a comfortable pace.</p></div><Focus className="text-accent" /></div><div className="grid grid-cols-3 gap-3">{ORDER.map((d) => { const meta = DIFFICULTY_META[d]; const active = difficulty === d; return <button key={d} onClick={() => onDifficultyChange(d)} aria-pressed={active} className={cn("min-h-16 rounded-2xl border px-2 py-3 text-center transition hover:-translate-y-0.5", active ? "border-accent bg-accent/15 text-accent shadow-[0_0_24px_rgba(34,211,238,.14)]" : "border-border/70 bg-secondary/50 text-muted-foreground hover:border-accent/50")}><span className="block font-bold text-base">{meta.label}</span><span className="text-xs">{meta.blurb}</span></button> })}</div></div><div className="rounded-3xl border border-border/80 bg-card/80 p-6"><div className="mb-4 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-warning/15 text-warning"><Trophy /></div><div><h2 className="font-display text-xl font-bold">Your progress</h2><p className="text-sm text-muted-foreground">Keep your mind active today.</p></div></div><div className="h-3 overflow-hidden rounded-full bg-secondary"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-accent to-success" /></div><p className="mt-3 text-sm text-muted-foreground">Best score <span className="font-bold text-foreground">{bestScore}</span> <span className="text-accent">•</span> Daily goal 3 games</p></div></section>

        <div className="grid gap-5 sm:grid-cols-2">{mode === "campaign" && <CampaignMap />}<QuestPanel /><ShopCard /></div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5"><button onClick={() => setShowHelp(true)} className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 text-base font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground"><HelpCircle /> How to play</button><p className="text-sm text-muted-foreground">Free brain training for every day.</p></div>
      </div>
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
      {showLeaderboard && <LeaderboardDrawer onClose={() => setShowLeaderboard(false)} />}
    </div>
  )
}
