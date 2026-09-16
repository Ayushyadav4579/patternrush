import type { Difficulty } from "./patterns"

const KEY = "pattern-master:best"

type BestScores = Partial<Record<Difficulty, number>>

function read(): BestScores {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as BestScores) : {}
  } catch {
    return {}
  }
}

export function getBestScore(difficulty: Difficulty): number {
  return read()[difficulty] ?? 0
}

export function getOverallBest(): number {
  const all = read()
  return Math.max(0, ...Object.values(all))
}

// Returns true if a new record was set.
export function saveBestScore(difficulty: Difficulty, score: number): boolean {
  const all = read()
  if (score > (all[difficulty] ?? 0)) {
    all[difficulty] = score
    try {
      window.localStorage.setItem(KEY, JSON.stringify(all))
    } catch {
      /* ignore */
    }
    return true
  }
  return false
}
