export class AudioManager {
  private static ctx: AudioContext | null = null;
  private static masterGain: GainNode | null = null;
  private static rainNoise: AudioBufferSourceNode | null = null;
  private static rainGain: GainNode | null = null;

  static init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.5;
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  static playRainAmbience() {
    if (!this.ctx || !this.masterGain) return;
    if (this.rainNoise) return; // already playing

    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.rainNoise = this.ctx.createBufferSource();
    this.rainNoise.buffer = buffer;
    this.rainNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = 0; // Start at 0, fade in
    
    this.rainNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    this.rainNoise.start();
    
    // Fade in
    this.rainGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 2);
  }

  static stopRainAmbience() {
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      setTimeout(() => {
        if (this.rainNoise) {
          this.rainNoise.stop();
          this.rainNoise.disconnect();
          this.rainNoise = null;
        }
      }, 1000);
    }
  }

  static playGunshot(suppressed: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // 1. Transient Click / Punch
    const punch = this.ctx.createOscillator();
    punch.type = 'square';
    punch.frequency.setValueAtTime(150, t);
    punch.frequency.exponentialRampToValueAtTime(0.01, t + 0.1);

    const punchGain = this.ctx.createGain();
    punchGain.gain.setValueAtTime(1, t);
    punchGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    punch.connect(punchGain);
    punchGain.connect(this.masterGain);
    punch.start(t);
    punch.stop(t + 0.1);

    // 2. Body / Boom
    const boom = this.ctx.createOscillator();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(suppressed ? 100 : 60, t);
    boom.frequency.exponentialRampToValueAtTime(0.01, t + (suppressed ? 0.3 : 0.8));

    const boomGain = this.ctx.createGain();
    boomGain.gain.setValueAtTime(suppressed ? 0.8 : 1.5, t);
    boomGain.gain.exponentialRampToValueAtTime(0.01, t + (suppressed ? 0.3 : 0.8));
    boom.connect(boomGain);
    boomGain.connect(this.masterGain);
    boom.start(t);
    boom.stop(t + (suppressed ? 0.3 : 0.8));

    // 3. Noise / Crack
    const bufferSize = this.ctx.sampleRate * (suppressed ? 0.2 : 1.0);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = suppressed ? 'lowpass' : 'highpass';
    noiseFilter.frequency.value = suppressed ? 1000 : 800;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(suppressed ? 0.5 : 1.2, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + (suppressed ? 0.2 : 0.6));

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);
  }

  static playReload() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    // Magazine Out (click)
    this.playClick(t, 600, 0.05);
    // Magazine In (clack)
    this.playClick(t + 0.4, 400, 0.08);
    // Bolt Pull (shhh-clack)
    this.playClick(t + 0.8, 800, 0.05);
    this.playClick(t + 0.95, 900, 0.1);
  }

  static playDryFire() {
    if (!this.ctx || !this.masterGain) return;
    this.playClick(this.ctx.currentTime, 800, 0.1);
  }

  private static playClick(time: number, freq: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq / 2, time + duration);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration);
  }

  static playScopeIn() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  static playScopeOut() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.15);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  static playJingle(success: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const notes = success ? [523.25, 659.25, 783.99, 1046.50] : [523.25, 493.88, 466.16, 440.00]; // C5 E5 G5 C6 vs C5 B4 Bb4 A4
    const durations = success ? [0.15, 0.15, 0.15, 0.4] : [0.2, 0.2, 0.2, 0.5];

    let timeOffset = 0;
    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      osc.type = success ? 'square' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + timeOffset);
      
      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0, t + timeOffset);
      gain.gain.linearRampToValueAtTime(0.2, t + timeOffset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, t + timeOffset + durations[index]);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(t + timeOffset);
      osc.stop(t + timeOffset + durations[index] + 0.1);
      
      timeOffset += durations[index];
    });
  }
}
