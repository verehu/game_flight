export class SynthAudio {
  constructor() {
    this.ctx = null
    this.master = null
    this.isUnlocked = false
    this.isMuted = false
    this.musicTimer = null
    this.musicStep = 0
    this.beatIntervalMs = 280
    this.musicPattern = [
      { root: 220, notes: [0, 4, 7], dur: 0.28 },
      { root: 247, notes: [0, 3, 7], dur: 0.28 },
      { root: 196, notes: [0, 5, 9], dur: 0.28 },
      { root: 220, notes: [0, 4, 9], dur: 0.28 }
    ]
    this.leadSteps = [12, 7, 9, 4, 12, 16, 14, 9]
  }

  init() {
    if (this.ctx) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.2
    this.master.connect(this.ctx.destination)
  }

  unlock() {
    this.init()
    if (!this.ctx) return
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    this.isUnlocked = true
  }

  setMuted(muted) {
    this.isMuted = muted
    if (!this.master) return
    this.master.gain.cancelScheduledValues(this.ctx.currentTime)
    this.master.gain.linearRampToValueAtTime(muted ? 0 : 0.2, this.ctx.currentTime + 0.03)
  }

  startMusic() {
    if (!this.isUnlocked || this.musicTimer) return
    this.musicStep = 0
    this.musicTimer = window.setInterval(() => {
      this.tickMusic()
    }, this.beatIntervalMs)
  }

  stopMusic() {
    if (!this.musicTimer) return
    window.clearInterval(this.musicTimer)
    this.musicTimer = null
  }

  tickMusic() {
    if (!this.ctx || this.isMuted || !this.isUnlocked) return

    const beat = this.musicPattern[this.musicStep % this.musicPattern.length]
    const now = this.ctx.currentTime
    const chordGain = this.ctx.createGain()
    chordGain.gain.value = 0.0001
    chordGain.connect(this.master)

    chordGain.gain.exponentialRampToValueAtTime(0.18, now + 0.02)
    chordGain.gain.exponentialRampToValueAtTime(0.0001, now + beat.dur)

    beat.notes.forEach((n, i) => {
      const osc = this.ctx.createOscillator()
      const detune = i === 0 ? 0 : i === 1 ? -4 : 4
      osc.type = i === 0 ? 'square' : 'triangle'
      osc.frequency.value = beat.root * Math.pow(2, n / 12)
      osc.detune.value = detune
      osc.connect(chordGain)
      osc.start(now)
      osc.stop(now + beat.dur + 0.02)
    })

    // Punchier bass pulse.
    const bass = this.ctx.createOscillator()
    const bassGain = this.ctx.createGain()
    bass.type = 'sawtooth'
    bass.frequency.value = beat.root / 2
    bassGain.gain.value = 0.0001
    bass.connect(bassGain)
    bassGain.connect(this.master)
    bassGain.gain.exponentialRampToValueAtTime(0.16, now + 0.01)
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + beat.dur * 0.82)
    bass.start(now)
    bass.stop(now + beat.dur + 0.03)

    this.playLead(now, beat.root)
    this.playDrums(now)

    this.musicStep += 1
  }

  playLead(now, root) {
    const semitone = this.leadSteps[this.musicStep % this.leadSteps.length]
    const lead = this.ctx.createOscillator()
    const leadGain = this.ctx.createGain()
    lead.type = 'sawtooth'
    lead.frequency.setValueAtTime(root * Math.pow(2, semitone / 12), now)
    lead.frequency.exponentialRampToValueAtTime(root * Math.pow(2, (semitone + 1) / 12), now + 0.11)
    leadGain.gain.value = 0.0001
    lead.connect(leadGain)
    leadGain.connect(this.master)
    leadGain.gain.exponentialRampToValueAtTime(0.09, now + 0.01)
    leadGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14)
    lead.start(now)
    lead.stop(now + 0.16)
  }

  playDrums(now) {
    this.playKick(now)
    this.playHat(now + 0.13)
    if (this.musicStep % 2 === 1) {
      this.playSnare(now + 0.02)
    }
  }

  playKick(now) {
    const kick = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    kick.type = 'sine'
    kick.frequency.setValueAtTime(150, now)
    kick.frequency.exponentialRampToValueAtTime(45, now + 0.1)
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)
    kick.connect(gain)
    gain.connect(this.master)
    kick.start(now)
    kick.stop(now + 0.1)
  }

  playSnare(now) {
    const buffer = this.ctx.createBuffer(1, 0.08 * this.ctx.sampleRate, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    }
    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer
    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.11, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
    noise.connect(gain)
    gain.connect(this.master)
    noise.start(now)
    noise.stop(now + 0.08)
  }

  playHat(now) {
    const hat = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    hat.type = 'square'
    hat.frequency.setValueAtTime(9000, now)
    gain.gain.setValueAtTime(0.035, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)
    hat.connect(gain)
    gain.connect(this.master)
    hat.start(now)
    hat.stop(now + 0.03)
  }

  playShoot() {
    this.playSweep(950, 620, 0.06, 0.04, 'square')
  }

  playHit() {
    this.playSweep(280, 120, 0.12, 0.08, 'sawtooth')
  }

  playExplosion() {
    if (!this.ctx || !this.isUnlocked || this.isMuted) return
    const now = this.ctx.currentTime
    const buffer = this.ctx.createBuffer(1, 0.12 * this.ctx.sampleRate, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    }
    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer
    const gain = this.ctx.createGain()
    gain.gain.value = 0.22
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)
    noise.connect(gain)
    gain.connect(this.master)
    noise.start(now)
    noise.stop(now + 0.12)
  }

  playPickup() {
    this.playSweep(520, 980, 0.1, 0.07, 'triangle')
  }

  playSweep(fromHz, toHz, duration, volume, type) {
    if (!this.ctx || !this.isUnlocked || this.isMuted) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(fromHz, now)
    osc.frequency.exponentialRampToValueAtTime(Math.max(toHz, 1), now + duration)
    gain.gain.value = volume
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start(now)
    osc.stop(now + duration)
  }

  destroy() {
    this.stopMusic()
    if (!this.ctx) return
    this.ctx.close()
    this.ctx = null
    this.master = null
    this.isUnlocked = false
  }
}
