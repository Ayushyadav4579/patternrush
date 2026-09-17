"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Check, X } from "lucide-react"
import { DIFFICULTY_META, generateGame, type Difficulty, type GameMode } from "@/lib/patterns"
import { sound } from "@/lib/sound"
import { cn } from "@/lib/utils"
import { ConfettiBurst } from "./confetti-burst"
import { Hud } from "./hud"
import { PatternItem, describeItem } from "./pattern-item"
import { ComboMeter, JuiceText } from "./leaderboard-drawer"

const MAX_LIVES = 3
const CORRECT_BASE = 100
const SPEED_BONUS_MAX = 50

export interface GameResult {
  score: number
  correct: number
  totalRounds: number
  difficulty: Difficulty
}

type Phase = "countdown" | "question" | "feedback"

export function GameScreen({
  difficulty,
  mode = "classic",
  onFinish,
}: {
  difficulty: Difficulty
  mode?: GameMode
  onFinish: (result: GameResult) => void
}) {
  const questions = useMemo(() => generateGame(difficulty, mode === "time-attack" || mode === "endless" ? 50 : 10), [difficulty, mode])
  const totalRounds = mode === "classic" || mode === "campaign" ? 10 : questions.length
  const totalTime = mode === "time-attack" ? 60000 : DIFFICULTY_META[difficulty].time * 1000
  const maxLives = mode === "endless" ? 3 : MAX_LIVES

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [trackerScore, setTrackerScore] = useState(0)
  const [winStreak, setWinStreak] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [correctCount, setCorrectCount] = useState(0)
  const [phase, setPhase] = useState<Phase>("countdown")
  const [count, setCount] = useState(3)
  const [selected, setSelected] = useState<number | null>(null)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [gained, setGained] = useState(0)
  const [juice, setJuice] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [timeLeft, setTimeLeft] = useState(totalTime)

  const timeLeftRef = useRef(totalTime)
  const answeredRef = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const question = questions[index]

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
  }

  // Countdown phase -> reveal the question.
  useEffect(() => {
    if (phase !== "countdown") return
    setCount(3)
    let c = 3
    sound.tick()
    const iv = setInterval(() => {
      c -= 1
      if (c > 0) {
        setCount(c)
        sound.tick()
      } else {
        clearInterval(iv)
        answeredRef.current = false
        timeLeftRef.current = totalTime
        setTimeLeft(totalTime)
        setSelected(null)
        setPhase("question")
      }
    }, 450)
    return () => clearInterval(iv)
  }, [phase, totalTime])

  const settle = useCallback(
    (choiceIndex: number | null) => {
      if (answeredRef.current) return
      answeredRef.current = true

      const correct = choiceIndex !== null && choiceIndex === question.correctIndex
      let earned = 0
      if (correct) {
        const bonus = Math.round((timeLeftRef.current / totalTime) * SPEED_BONUS_MAX)
        earned = CORRECT_BASE + bonus
        setScore((s) => s + earned)
        setTrackerScore((s) => s + 1)
        setWinStreak((s) => s + 1)
        setJuice("PERFECT!")
        setShake(false)
        setCorrectCount((c) => c + 1)
        sound.correct()
      } else {
        setLives((l) => l - 1)
        setWinStreak(0)
        setJuice("COMBO BREAK")
        setShake(true)
        sound.wrong()
      }

      setSelected(choiceIndex)
      setGained(earned)
      setWasCorrect(correct)
      setPhase("feedback")

      const livesAfter = correct ? lives : lives - 1
      const isLastRound = index >= totalRounds - 1
      const gameEnds = livesAfter <= 0 || isLastRound

      later(
        () => {
          if (gameEnds) {
            onFinish({
              score: score + earned,
              correct: correctCount + (correct ? 1 : 0),
              totalRounds,
              difficulty,
            })
          } else {
            setIndex((i) => i + 1)
            setPhase("countdown")
          }
        },
        correct ? 1000 : 1350,
      )
    },
    [question, totalTime, lives, index, totalRounds, score, correctCount, difficulty, onFinish],
  )

  // Question timer.
  useEffect(() => {
    if (phase !== "question" || timeLeft > 5000) return
    sound.heartbeat()
    const pulse = setInterval(() => sound.heartbeat(), 700)
    return () => clearInterval(pulse)
  }, [phase, timeLeft])

  useEffect(() => {
    if (!shake) return
    const t = setTimeout(() => setShake(false), 450)
    return () => clearTimeout(t)
  }, [shake])

  useEffect(() => {
    if (!juice) return
    const t = setTimeout(() => setJuice(null), 850)
    return () => clearTimeout(t)
  }, [juice])

  useEffect(() => {
    if (phase !== "question") return
    const start = Date.now()
    const iv = setInterval(() => {
      const remaining = Math.max(0, totalTime - (Date.now() - start))
      timeLeftRef.current = remaining
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(iv)
        settle(null) // timed out
      }
    }, 50)
    return () => clearInterval(iv)
  }, [phase, totalTime, settle])

  useEffect(() => () => clearTimers(), [])

  const timePct = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100))
  const timeColor = timePct > 50 ? "bg-success" : timePct > 25 ? "bg-warning" : "bg-destructive"

  return (
    <div className={cn("mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-4 pb-6 pt-5", shake && "animate-screen-shake", timeLeft <= 5000 && phase === "question" && "near-miss-pulse")}>
      <Hud
        score={score}
        lives={lives}
        maxLives={MAX_LIVES}
        round={index + 1}
        totalRounds={totalRounds}
        trackerScore={trackerScore}
        winStreak={winStreak}
      />
      <div className="mt-3 flex justify-center"><ComboMeter streak={winStreak} /></div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 py-4">
        {juice && <JuiceText text={juice} tone={wasCorrect ? "success" : "danger"} />}
        {phase === "countdown" ? (
          <div key={count} className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Round {index + 1}
            </span>
            <span className="font-display text-8xl font-bold text-primary animate-count-pop">{count}</span>
          </div>
        ) : (
          <>
            {/* Category + prompt */}
            <div className="flex flex-col items-center gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {question.category}
              </span>
              <h2 className="font-display text-xl font-semibold text-foreground">What comes next?</h2>
            </div>

            {/* Sequence */}
            <div className="flex w-full flex-wrap items-center justify-center gap-2.5">
              {question.sequence.map((item, i) => (
                <div
                  key={i}
                  className="grid size-14 place-items-center rounded-2xl bg-card shadow-sm sm:size-16"
                >
                  <PatternItem item={item} size="md" />
                </div>
              ))}
              <div
                className={cn(
                  "relative grid size-14 place-items-center rounded-2xl border-2 border-dashed transition-colors sm:size-16",
                  phase === "feedback"
                    ? "border-solid border-success bg-success/15"
                    : "border-primary/60 bg-primary/5",
                )}
              >
                {phase === "feedback" ? (
                  <div className="animate-count-pop">
                    <PatternItem item={question.options[question.correctIndex]} size="md" />
                  </div>
                ) : (
                  <span className="font-display text-3xl font-bold text-primary/70">?</span>
                )}
              </div>
            </div>

            {/* Timer bar */}
            <div className="h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-secondary">
              <div
                className={cn("h-full rounded-full transition-[width] duration-75 ease-linear", timeColor)}
                style={{ width: `${timePct}%` }}
              />
            </div>

            {/* Answers */}
            <div className="grid w-full grid-cols-2 gap-3">
              {question.options.map((opt, i) => {
                const isCorrect = i === question.correctIndex
                const isChosen = i === selected
                const showState = phase === "feedback"
                return (
                  <button
                    key={i}
                    disabled={phase !== "question"}
                    aria-label={`Answer ${i + 1}: ${describeItem(opt)}`}
                    onClick={() => settle(i)}
                    className={cn(
                      "relative grid h-24 place-items-center rounded-3xl bg-card shadow-md transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40",
                      phase === "question" && "hover:-translate-y-0.5 hover:bg-secondary active:translate-y-0",
                      showState && isCorrect && "bg-success/20 ring-2 ring-success",
                      showState && isChosen && !isCorrect && "bg-destructive/20 ring-2 ring-destructive animate-shake",
                      showState && !isCorrect && !isChosen && "opacity-45",
                    )}
                  >
                    <PatternItem item={opt} size="lg" />
                    {showState && isCorrect && (
                      <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-success text-success-foreground">
                        <Check size={15} strokeWidth={3} />
                      </span>
                    )}
                    {showState && isChosen && !isCorrect && (
                      <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-destructive text-white">
                        <X size={15} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Feedback banner */}
            <div className="h-8">
              {phase === "feedback" &&
                (wasCorrect ? (
                  <p className="font-display text-lg font-bold text-success animate-pop-in">
                    Correct! +{gained}
                  </p>
                ) : (
                  <p className="font-display text-lg font-bold text-destructive animate-pop-in">
                    {selected === null ? "Time's up!" : "Not quite!"}
                  </p>
                ))}
            </div>

            {phase === "feedback" && wasCorrect && <ConfettiBurst />}
          </>
        )}
      </div>
    </div>
  )
}
