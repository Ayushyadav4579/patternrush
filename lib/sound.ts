// Lightweight Web Audio blips — no files, works offline.
let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

function tone(freq: number, start: number, duration: number, type: OscillatorType, gain: number) {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, c.currentTime + start)
  g.gain.setValueAtTime(0.0001, c.currentTime + start)
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + start + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + duration)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(c.currentTime + start)
  osc.stop(c.currentTime + start + duration + 0.02)
}

export const sound = {
  enabled: true,
  resume() {
    const c = getCtx()
    if (c && c.state === "suspended") void c.resume()
  },
  correct() {
    if (!this.enabled) return
    tone(587.33, 0, 0.12, "sine", 0.18) // D5
    tone(880.0, 0.09, 0.16, "sine", 0.18) // A5
  },
  wrong() {
    if (!this.enabled) return
    tone(196.0, 0, 0.22, "sawtooth", 0.12) // G3
    tone(155.56, 0.08, 0.26, "sawtooth", 0.12) // Eb3
  },
  tick() {
    if (!this.enabled) return
    tone(440, 0, 0.05, "triangle", 0.06)
  },
  gameOver() {
    if (!this.enabled) return
    tone(523.25, 0, 0.18, "sine", 0.16)
    tone(392.0, 0.16, 0.18, "sine", 0.16)
    tone(261.63, 0.32, 0.3, "sine", 0.16)
  },
}
