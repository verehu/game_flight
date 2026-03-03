export class SynthAudio {
  constructor() {
    this.ctx = null
    this.master = null
    this.compressor = null
    this.baseVolume = 0.48
    this.isUnlocked = false
    this.isMuted = false
    this.lastShootAt = 0
  }

  init() {
    if (this.ctx) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    this.ctx = new Ctx()
    this.compressor = this.ctx.createDynamicsCompressor()
    this.compressor.threshold.value = -20
    this.compressor.knee.value = 20
    this.compressor.ratio.value = 8
    this.compressor.attack.value = 0.003
    this.compressor.release.value = 0.2
    this.master = this.ctx.createGain()
    this.master.gain.value = this.baseVolume
    this.master.connect(this.compressor)
    this.compressor.connect(this.ctx.destination)
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
    this.master.gain.linearRampToValueAtTime(muted ? 0 : this.baseVolume, this.ctx.currentTime + 0.03)
  }

  playShoot() {
    if (!this.ctx || !this.isUnlocked || this.isMuted) return
    const now = this.ctx.currentTime

    // Avoid harsh stacking when auto-fire is very fast.
    if (now - this.lastShootAt < 0.045) return
    this.lastShootAt = now

    const highPass = this.ctx.createBiquadFilter()
    highPass.type = 'highpass'
    highPass.frequency.value = 900
    highPass.Q.value = 0.7
    highPass.connect(this.master)

    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc1.type = 'square'
    osc2.type = 'triangle'
    osc1.frequency.setValueAtTime(1900, now)
    osc1.frequency.exponentialRampToValueAtTime(920, now + 0.055)
    osc2.frequency.setValueAtTime(2400, now)
    osc2.frequency.exponentialRampToValueAtTime(1300, now + 0.05)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.003)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(highPass)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.06)
    osc2.stop(now + 0.06)
  }

  playHit() {
    this.playSweep(280, 120, 0.12, 0.12, 'sawtooth')
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
    gain.gain.value = 0.34
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)
    noise.connect(gain)
    gain.connect(this.master)
    noise.start(now)
    noise.stop(now + 0.12)
  }

  playPickup() {
    this.playSweep(520, 980, 0.1, 0.11, 'triangle')
  }

  playAlarm() {
    if (!this.ctx || !this.isUnlocked || this.isMuted) return
    const now = this.ctx.currentTime

    for (let i = 0; i < 3; i += 1) {
      const t = now + i * 0.18
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(920, t)
      osc.frequency.exponentialRampToValueAtTime(640, t + 0.13)
      gain.gain.setValueAtTime(0.18, t)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
      osc.connect(gain)
      gain.connect(this.master)
      osc.start(t)
      osc.stop(t + 0.15)
    }
  }

  playUltimate() {
    if (!this.ctx || !this.isUnlocked || this.isMuted) return
    const now = this.ctx.currentTime
    for (let i = 0; i < 3; i += 1) {
      const t = now + i * 0.06
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(420 + i * 120, t)
      osc.frequency.exponentialRampToValueAtTime(1200 + i * 90, t + 0.26)
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.2, t + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28)
      osc.connect(gain)
      gain.connect(this.master)
      osc.start(t)
      osc.stop(t + 0.29)
    }
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
    if (!this.ctx) return
    this.ctx.close()
    this.ctx = null
    this.master = null
    this.compressor = null
    this.isUnlocked = false
  }
}
