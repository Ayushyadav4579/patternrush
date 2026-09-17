"use client"

import { useEffect, useState } from "react"
import { GameOverScreen } from "@/components/game/game-over-screen"
import { GameScreen, type GameResult } from "@/components/game/game-screen"
import { HomeScreen } from "@/components/game/home-screen"
import type { Difficulty, GameMode } from "@/lib/patterns"
import { sound } from "@/lib/sound"
import { getBestScore, getOverallBest, saveBestScore } from "@/lib/storage"

type Screen = "home" | "playing" | "over"

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [mode, setMode] = useState<GameMode>("classic")
  const [gameKey, setGameKey] = useState(0)
  const [result, setResult] = useState<GameResult | null>(null)
  const [isNewBest, setIsNewBest] = useState(false)
  const [overallBest, setOverallBest] = useState(0)
  const [soundOn, setSoundOn] = useState(true)

  // Load persisted best score + sound preference on mount.
  useEffect(() => {
    setOverallBest(getOverallBest())
    try {
      const saved = window.localStorage.getItem("pattern-master:sound")
      if (saved === "off") {
        setSoundOn(false)
        sound.enabled = false
      }
    } catch {
      /* ignore */
    }
  }, [])

  const startGame = () => {
    sound.resume()
    setResult(null)
    setIsNewBest(false)
    setGameKey((k) => k + 1)
    setScreen("playing")
  }

  const handleFinish = (r: GameResult) => {
    sound.gameOver()
    const newBest = saveBestScore(r.difficulty, r.score)
    setIsNewBest(newBest)
    setResult(r)
    setOverallBest(getOverallBest())
    setScreen("over")
  }

  const toggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev
      sound.enabled = next
      if (next) sound.resume()
      try {
        window.localStorage.setItem("pattern-master:sound", next ? "on" : "off")
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      {screen === "home" && (
        <HomeScreen
          bestScore={overallBest}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          mode={mode}
          onModeChange={setMode}
          onPlay={startGame}
          soundOn={soundOn}
          onToggleSound={toggleSound}
        />
      )}

      {screen === "playing" && (
        <GameScreen key={gameKey} difficulty={difficulty} mode={mode} onFinish={handleFinish} />
      )}

      {screen === "over" && result && (
        <GameOverScreen
          result={result}
          bestScore={getBestScore(result.difficulty)}
          isNewBest={isNewBest}
          onPlayAgain={startGame}
          onHome={() => setScreen("home")}
        />
      )}
    </main>
  )
}
