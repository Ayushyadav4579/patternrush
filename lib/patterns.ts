// Pattern Master — local, offline pattern generator.
// Every question has exactly ONE logically correct answer.

export type ItemKind = "number" | "color" | "shape" | "symbol" | "letter"

export interface Item {
  kind: ItemKind
  // number -> the numeric value
  // color  -> index into COLORS
  // shape  -> index into SHAPES
  // symbol -> index into SYMBOLS (arrow rotation, 0=up,1=right,2=down,3=left)
  // letter -> char code offset (A=0, B=1, ...)
  value: number
}

export interface Question {
  id: string
  kind: ItemKind
  category: string
  sequence: Item[]
  options: Item[]
  correctIndex: number
}

export type Difficulty = "easy" | "medium" | "hard"
export type GameMode = "classic" | "time-attack" | "endless" | "campaign"

// ----- Visual palettes (gameplay content, not UI theme) -----
export const COLORS = [
  { name: "Red", hex: "#ef4444" },
  { name: "Orange", hex: "#f97316" },
  { name: "Yellow", hex: "#facc15" },
  { name: "Green", hex: "#22c55e" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Purple", hex: "#a855f7" },
] as const

export const SHAPES = ["circle", "square", "triangle", "diamond", "star", "hexagon"] as const
export const SYMBOLS = ["up", "right", "down", "left"] as const

// ----- RNG helpers -----
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const choice = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// distinct sample of `n` indices from range [0, size)
function sampleIndices(size: number, n: number): number[] {
  return shuffle(Array.from({ length: size }, (_, i) => i)).slice(0, n)
}

const num = (value: number): Item => ({ kind: "number", value })

// Build plausible but wrong numeric distractors.
function numberDistractors(correct: number, unit: number, count: number, avoid: number[] = []): number[] {
  const used = new Set<number>([correct, ...avoid])
  const out: number[] = []
  const u = Math.max(1, Math.abs(unit))
  const deltas = shuffle([u, -u, 2 * u, -2 * u, u + 1, -(u + 1), 1, -1, 2, -2, 3, -3])
  for (const d of deltas) {
    if (out.length >= count) break
    const cand = correct + d
    if (cand < 0 || used.has(cand)) continue
    used.add(cand)
    out.push(cand)
  }
  // Fallback: fill with nearby unique values.
  let extra = 1
  while (out.length < count) {
    const cand = correct + extra
    if (!used.has(cand) && cand >= 0) {
      used.add(cand)
      out.push(cand)
    }
    extra++
    if (extra > 500) break
  }
  return out
}

// distinct "category index" distractors (colors / shapes / symbols)
function indexDistractors(size: number, correct: number, count: number): number[] {
  return shuffle(Array.from({ length: size }, (_, i) => i).filter((i) => i !== correct)).slice(0, count)
}

interface Raw {
  kind: ItemKind
  category: string
  sequence: Item[]
  correct: Item
  distractors: Item[]
}

// Effective tier 1..3 based on chosen difficulty and how far into the game we are.
function effectiveTier(diff: Difficulty, round: number): number {
  if (diff === "easy") return round <= 6 ? 1 : 2
  if (diff === "medium") return round <= 1 ? 1 : round <= 7 ? 2 : 3
  return round <= 1 ? 2 : 3 // hard
}

// ---------- Generators ----------
function genArithmetic(tier: number, round: number): Raw {
  const boost = Math.floor(round / 3)
  const length = tier === 1 ? 4 : tier === 2 ? 4 : 5
  const step = (tier === 1 ? randInt(1, 3) : tier === 2 ? randInt(2, 6) : randInt(3, 9)) + boost
  const decreasing = tier >= 2 && Math.random() < 0.4
  const sign = decreasing ? -1 : 1
  const start = decreasing
    ? step * (length + 1) + randInt(0, 8) // keep every value >= 0
    : tier === 1
      ? randInt(1, 9)
      : tier === 2
        ? randInt(2, 20)
        : randInt(8, 30)

  const seq: Item[] = []
  for (let i = 0; i < length; i++) seq.push(num(start + sign * step * i))
  const correctVal = start + sign * step * length
  return {
    kind: "number",
    category: decreasing ? "Decreasing" : "Numbers",
    sequence: seq,
    correct: num(correctVal),
    distractors: numberDistractors(correctVal, step, 3).map(num),
  }
}

function genGeometric(tier: number): Raw {
  const ratio = tier === 2 ? 2 : choice([2, 3])
  const start = randInt(1, 3)
  const length = 4
  const seq: Item[] = []
  for (let i = 0; i < length; i++) seq.push(num(start * ratio ** i))
  const correctVal = start * ratio ** length
  const avoid = seq.map((s) => s.value)
  const dists = numberDistractors(correctVal, correctVal - seq[length - 1].value, 3, avoid)
  return { kind: "number", category: "Multiply", sequence: seq, correct: num(correctVal), distractors: dists.map(num) }
}

function genFibonacci(): Raw {
  const a = randInt(1, 4)
  const b = randInt(2, 6)
  const seq: Item[] = [num(a), num(b)]
  for (let i = 2; i < 5; i++) seq.push(num(seq[i - 1].value + seq[i - 2].value))
  const correctVal = seq[4].value + seq[3].value
  return {
    kind: "number",
    category: "Add Prev Two",
    sequence: seq,
    correct: num(correctVal),
    distractors: numberDistractors(correctVal, seq[3].value, 3, seq.map((s) => s.value)).map(num),
  }
}

function genQuadratic(round: number): Raw {
  // Growing differences: e.g. 1,2,4,7,11 -> 16
  const start = randInt(1, 5)
  const d0 = randInt(1, 3)
  const inc = randInt(1, 3) + Math.floor(round / 5)
  const length = 5
  const seq: Item[] = [num(start)]
  let cur = start
  for (let i = 1; i < length; i++) {
    cur += d0 + inc * (i - 1)
    seq.push(num(cur))
  }
  const correctVal = cur + d0 + inc * (length - 1)
  return {
    kind: "number",
    category: "Growing Gaps",
    sequence: seq,
    correct: num(correctVal),
    distractors: numberDistractors(correctVal, inc, 3, seq.map((s) => s.value)).map(num),
  }
}

function genInterleave(tier: number, round: number): Raw {
  // Two clearly separated interleaved sequences; answer belongs to sequence A.
  const aStart = randInt(1, 5)
  const aStep = randInt(1, 3)
  const bStart = randInt(12, 30)
  const bStep = (tier >= 3 && Math.random() < 0.5 ? -1 : 1) * randInt(4, 9)
  // guard so B stays positive
  const bSafe = bStep < 0 ? bStart + Math.abs(bStep) * 4 : bStart
  const seq: Item[] = []
  for (let i = 0; i < 3; i++) {
    seq.push(num(aStart + aStep * i))
    seq.push(num(bSafe + bStep * i))
  }
  const correctVal = aStart + aStep * 3
  const avoid = [...seq.map((s) => s.value), bSafe + bStep * 3]
  return {
    kind: "number",
    category: "Interleaved",
    sequence: seq,
    correct: num(correctVal),
    distractors: numberDistractors(correctVal, aStep, 3, avoid).map(num),
  }
}

function genCycle(kind: "color" | "shape", tier: number): Raw {
  const size = kind === "color" ? COLORS.length : SHAPES.length
  const cycleLen = tier === 1 ? 2 : tier === 2 ? 3 : choice([3, 4])
  const showLen = tier === 1 ? 4 : tier === 2 ? 5 : 6
  const cycle = sampleIndices(size, cycleLen)
  const seq: Item[] = []
  for (let i = 0; i < showLen; i++) seq.push({ kind, value: cycle[i % cycleLen] })
  const correctVal = cycle[showLen % cycleLen]
  return {
    kind,
    category: kind === "color" ? "Colors" : "Shapes",
    sequence: seq,
    correct: { kind, value: correctVal },
    distractors: indexDistractors(size, correctVal, 3).map((v) => ({ kind, value: v })),
  }
}

function genSymbolRotation(tier: number): Raw {
  const dir = choice([1, -1])
  const start = randInt(0, 3)
  const showLen = tier === 1 ? 4 : tier === 2 ? 5 : 6
  const mod = (n: number) => ((n % 4) + 4) % 4
  const seq: Item[] = []
  for (let i = 0; i < showLen; i++) seq.push({ kind: "symbol", value: mod(start + dir * i) })
  const correctVal = mod(start + dir * showLen)
  return {
    kind: "symbol",
    category: "Rotation",
    sequence: seq,
    correct: { kind: "symbol", value: correctVal },
    distractors: indexDistractors(4, correctVal, 3).map((v) => ({ kind: "symbol" as const, value: v })),
  }
}

interface GenDef {
  tiers: number[]
  fn: (tier: number, round: number) => Raw
}

const GENERATORS: GenDef[] = [
  { tiers: [1, 2, 3], fn: (t, r) => genArithmetic(t, r) },
  { tiers: [1, 2, 3], fn: (t) => genCycle("color", t) },
  { tiers: [1, 2, 3], fn: (t) => genCycle("shape", t) },
  { tiers: [1, 2, 3], fn: (t) => genSymbolRotation(t) },
  { tiers: [2, 3], fn: (t) => genGeometric(t) },
  { tiers: [2, 3], fn: (t, r) => genInterleave(t, r) },
  { tiers: [3], fn: () => genFibonacci() },
  { tiers: [3], fn: (_t, r) => genQuadratic(r) },
]

function signature(raw: Raw): string {
  return `${raw.kind}:${raw.sequence.map((s) => s.value).join(",")}=>${raw.correct.value}`
}

function toQuestion(raw: Raw, index: number): Question {
  const options = shuffle([raw.correct, ...raw.distractors])
  const correctIndex = options.findIndex((o) => o.value === raw.correct.value)
  return {
    id: `q${index}-${Math.random().toString(36).slice(2, 8)}`,
    kind: raw.kind,
    category: raw.category,
    sequence: raw.sequence,
    options,
    correctIndex,
  }
}

// Build a full 10-round game with unique, valid questions.
export function generateGame(difficulty: Difficulty, rounds = 10): Question[] {
  const questions: Question[] = []
  const seen = new Set<string>()

  for (let round = 0; round < rounds; round++) {
    const tier = effectiveTier(difficulty, round)
    const pool = GENERATORS.filter((g) => g.tiers.includes(tier))
    let raw: Raw | null = null

    for (let attempt = 0; attempt < 40; attempt++) {
      const candidate = choice(pool).fn(tier, round)
      // valid = exactly 4 unique options (correct + 3 distinct distractors)
      const values = [candidate.correct.value, ...candidate.distractors.map((d) => d.value)]
      const unique = new Set(values).size === 4 && candidate.distractors.length === 3
      const sig = signature(candidate)
      if (unique && !seen.has(sig)) {
        seen.add(sig)
        raw = candidate
        break
      }
    }

    // Extremely unlikely fallback so a round is never empty.
    if (!raw) raw = genArithmetic(tier, round)
    questions.push(toQuestion(raw, round))
  }

  return questions
}

function genLetters(tier: number): Raw {
  const jumps = tier === 1 ? [1, 2] : tier === 2 ? [2, 3, 4] : [2, 3, 5]
  const start = randInt(0, 5)
  const jump = choice(jumps)
  const seq = Array.from({ length: 4 }, (_, i) => ({ kind: "letter" as const, value: start + jump * i }))
  const correct = start + jump * 4
  return { kind: "letter", category: "Letters", sequence: seq, correct: { kind: "letter", value: correct }, distractors: indexDistractors(26, correct, 3).map((value) => ({ kind: "letter" as const, value })) }
}

function genPrimes(): Raw {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
  const start = randInt(0, 5)
  const seq = primes.slice(start, start + 4).map(num)
  const correct = primes[start + 4]
  return { kind: "number", category: "Prime Numbers", sequence: seq, correct: num(correct), distractors: numberDistractors(correct, 2, 3, seq.map((s) => s.value)).map(num) }
}

export function generateCampaignLevel(level: number): Question[] {
  const difficulty: Difficulty = level < 17 ? "easy" : level < 34 ? "medium" : "hard"
  return generateGame(difficulty, 1)
}

export const DIFFICULTY_META: Record<Difficulty, { label: string; emoji: string; time: number; blurb: string }> = {
  easy: { label: "Easy", emoji: "🟢", time: 12, blurb: "Gentle patterns for warming up." },
  medium: { label: "Medium", emoji: "🟡", time: 9, blurb: "A balanced brain workout." },
  hard: { label: "Hard", emoji: "🔴", time: 7, blurb: "Real logic. Think fast." },
}
