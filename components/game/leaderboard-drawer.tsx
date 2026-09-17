"use client"

import { X, Trophy, Medal } from "lucide-react"
import { Button } from "@/components/ui/button"

const leaders = [
  ["NovaMind", "12,840"],
  ["PatternFox", "10,620"],
  ["RushPilot", "9,480"],
  ["You", "8,210"],
]

export function LeaderboardDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/45 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="leaderboard-title">
      <div className="animate-slide-in-right flex h-full w-full max-w-sm flex-col rounded-3xl border border-primary/25 bg-card/95 p-5 shadow-2xl shadow-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-2xl bg-warning/15 text-warning"><Trophy /></div><div><h2 id="leaderboard-title" className="font-display text-xl font-bold">Global Leaderboard</h2><p className="text-xs text-muted-foreground">This week&apos;s top pattern hunters</p></div></div>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close leaderboard"><X /></Button>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          {leaders.map(([name, score], i) => <div key={name} className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-3 py-3"><div className="grid size-9 place-items-center rounded-xl bg-background font-display font-bold text-muted-foreground">{i < 3 ? <Medal className={i === 0 ? "text-warning" : "text-primary"} /> : i + 1}</div><span className="flex-1 font-semibold">{name}</span><span className="font-display font-bold text-primary">{score}</span></div>)}
        </div>
        <p className="mt-auto rounded-2xl bg-primary/10 p-4 text-center text-sm text-muted-foreground">Keep playing to climb the ranks.</p>
      </div>
    </div>
  )
}

export function AmbientOrbs() { return <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true"><span className="ambient-orb ambient-orb-one" /><span className="ambient-orb ambient-orb-two" /><span className="ambient-grid" /></div> }

export function LeaderboardButton({ onClick }: { onClick: () => void }) { return <Button variant="secondary" size="icon" onClick={onClick} aria-label="Open global leaderboard" className="rounded-2xl"><Trophy /></Button> }

export function ShopCard() { return <div className="rounded-3xl border border-primary/15 bg-card/75 p-4 shadow-lg shadow-primary/5"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Rewards shop</p><h3 className="mt-1 font-display text-xl font-bold">Neon vault</h3></div><span className="rounded-full bg-warning/15 px-3 py-1 text-sm font-bold text-warning">420 stars</span></div><div className="mt-4 grid grid-cols-3 gap-2"><div className="rounded-2xl bg-secondary p-3 text-center"><span className="mx-auto block size-8 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/40" /><p className="mt-2 text-[11px] font-bold">Cyber</p></div><div className="rounded-2xl bg-secondary p-3 text-center"><span className="mx-auto block size-8 rounded-full bg-lime-300 shadow-lg shadow-lime-300/40" /><p className="mt-2 text-[11px] font-bold">Gameboy</p></div><div className="rounded-2xl bg-secondary p-3 text-center"><span className="mx-auto block size-8 rounded-full bg-pink-300 shadow-lg shadow-pink-300/40" /><p className="mt-2 text-[11px] font-bold">Pastel</p></div></div></div> }

export function QuestPanel({ xp = 68 }: { xp?: number }) { return <div className="rounded-3xl border border-accent/15 bg-card/75 p-4"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-accent">Level 12</p><h3 className="font-display text-xl font-bold">Daily quests</h3></div><span className="text-sm font-bold text-accent">{xp}/100 XP</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${xp}%` }} /></div><div className="mt-4 flex flex-col gap-2 text-sm"><div className="flex justify-between rounded-xl bg-secondary/70 px-3 py-2"><span>Complete 3 Classic rounds</span><span className="text-success">2/3</span></div><div className="flex justify-between rounded-xl bg-secondary/70 px-3 py-2"><span>Reach a 10x combo</span><span className="text-warning">0/1</span></div></div></div> }

export function CampaignMap() { return <div className="rounded-3xl border border-primary/15 bg-card/75 p-4"><div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Campaign</p><h3 className="font-display text-xl font-bold">Neon ascent</h3></div><span className="text-xs text-muted-foreground">4 / 50 unlocked</span></div><div className="grid grid-cols-10 gap-1.5">{Array.from({ length: 50 }, (_, i) => <span key={i} className={`grid aspect-square place-items-center rounded-lg text-[10px] font-bold ${i < 4 ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" : i === 4 ? "border border-primary/50 bg-primary/10 text-primary" : "bg-secondary text-muted-foreground/50"}`}>{i + 1}</span>)}</div></div> }

export function ComboMeter({ streak }: { streak: number }) { const multiplier = streak >= 20 ? 5 : streak >= 10 ? 3 : streak >= 5 ? 2 : 1; const fill = Math.min(100, (streak % 5) * 20 || (streak ? 100 : 0)); return <div className="w-full max-w-xs rounded-2xl border border-primary/20 bg-card/70 p-3"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Combo multiplier</span><span className={streak >= 5 ? "font-display text-lg font-bold text-warning" : "font-display text-lg font-bold text-primary"}>{multiplier}x</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-warning transition-all duration-300" style={{ width: `${fill}%` }} /></div>{streak >= 5 && <p className="mt-1 text-right text-[10px] font-bold uppercase tracking-widest text-warning">{streak} streak</p>}</div> }

export function JuiceText({ text, tone = "success" }: { text: string; tone?: "success" | "danger" }) { return <span className={`pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 font-display text-3xl font-bold ${tone === "success" ? "text-warning" : "text-destructive"} animate-float-up`}>{text}</span> }

export function useUnused() { return null }
