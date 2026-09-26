/**
 * Web Audio API Synthesizer & Real Audio Player Engine
 * Supports real audio streaming, multi-track melody synthesis, UI feedback, and real-time spectrum analysis.
 */

class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isMuted: boolean = false;
  private isTapePlaying: boolean = false;
  private currentTrackTimeout: number | null = null;
  private playbackRate: number = 1.0;
  private isLofiMode: boolean = false;

  // Real Audio Streaming
  private audioElement: HTMLAudioElement | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;
  private currentPlayingTrackId: string | null = null;
  private audioProgressListener: (() => void) | null = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(20000, this.ctx.currentTime);

      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 64;
      this.analyserNode.smoothingTimeConstant = 0.8;

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    if (!this.ctx) this.initContext();
    return this.analyserNode;
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, vol));
    }
  }

  public setPlaybackSpeed(rate: number) {
    this.playbackRate = Math.max(0.5, Math.min(2.0, rate));
    if (this.audioElement) {
      this.audioElement.playbackRate = this.playbackRate;
    }
  }

  public setLofiMode(enabled: boolean) {
    this.isLofiMode = enabled;
    if (this.filterNode && this.ctx) {
      const targetFreq = enabled ? 2200 : 20000;
      this.filterNode.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
    }
  }

  // --- Real Audio Track Playback ---

  public playRealSong(
    audioUrl: string,
    trackId: string,
    onProgress?: (currentTimeSec: number, durationSec: number) => void,
    onEnded?: () => void,
    onError?: () => void
  ) {
    this.stopSong();
    this.initContext();

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';

      // Connect to Web Audio Analyser if supported
      try {
        if (this.ctx && !this.audioSourceNode) {
          this.audioSourceNode = this.ctx.createMediaElementSource(this.audioElement);
          this.audioSourceNode.connect(this.filterNode || this.ctx.destination);
        }
      } catch (e) {
        console.log('Direct audio node connection used');
      }
    }

    this.audioElement.src = audioUrl;
    this.audioElement.playbackRate = this.playbackRate;
    this.audioElement.volume = 0.85;
    this.currentPlayingTrackId = trackId;
    this.isTapePlaying = true;

    if (this.audioProgressListener && this.audioElement) {
      this.audioElement.removeEventListener('timeupdate', this.audioProgressListener);
    }

    this.audioProgressListener = () => {
      if (this.audioElement && onProgress) {
        onProgress(this.audioElement.currentTime, this.audioElement.duration || 30);
      }
    };

    this.audioElement.addEventListener('timeupdate', this.audioProgressListener);

    this.audioElement.onended = () => {
      this.isTapePlaying = false;
      if (onEnded) onEnded();
    };

    this.audioElement.onerror = () => {
      console.warn('Audio streaming failed, falling back to synth');
      if (onError) onError();
    };

    this.audioElement.play().catch(() => {
      console.log('Audio autoplay prevented, ready on user click');
    });
  }

  public pauseAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isTapePlaying = false;
  }

  public resumeAudio() {
    if (this.audioElement && this.audioElement.src) {
      this.initContext();
      this.audioElement.play().catch(() => {});
      this.isTapePlaying = true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isTapePlaying;
  }

  public getCurrentTrackId(): string | null {
    return this.currentPlayingTrackId;
  }

  // --- UI Sound Effects (All click buzzers and SFX disabled) ---

  public playSparkle() {
    // Disabled UI sound
  }

  public playCassetteClick(_type: 'press' | 'release' | 'eject' = 'press') {
    // Disabled UI sound
  }

  public playDinerBell() {
    // Disabled UI sound
  }

  public playSteamHiss(_durationSec: number = 1.2) {
    // Disabled UI sound
  }

  public playTypewriterTap() {
    // Disabled UI sound
  }

  public playCameraShutter() {
    // Disabled UI sound
  }

  public playKissPop() {
    // Disabled UI sound
  }

  public playPerfumeSpritz() {
    // Disabled UI sound
  }

  public playSynthNote(
    frequency: number,
    durationSec: number = 0.4,
    type: OscillatorType = 'sine',
    instrument: 'rhodes' | 'bass' | 'lead' | 'synth' = 'synth'
  ) {
    const ctx = this.initContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency * this.playbackRate, now);

    if (this.isLofiMode) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(4.5, now);
      lfoGain.gain.setValueAtTime(4, now);
      lfo.connect(osc.frequency);
      lfo.start();
      lfo.stop(now + durationSec);
    }

    if (instrument === 'rhodes') {
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    } else if (instrument === 'bass') {
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
    } else {
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    }

    osc.connect(gain);
    gain.connect(this.filterNode || ctx.destination);

    osc.start();
    osc.stop(now + durationSec);
  }

  public stopSong() {
    this.isTapePlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (this.currentTrackTimeout) {
      clearTimeout(this.currentTrackTimeout);
      this.currentTrackTimeout = null;
    }
  }

  public playSongSequence(
    notesSequence: Array<{ note: number; time: number; dur: number; type?: OscillatorType; inst?: 'rhodes' | 'bass' | 'lead' | 'synth' }>,
    bpm: number,
    onProgress?: (progressSec: number, beatIndex: number) => void,
    onComplete?: () => void
  ) {
    this.stopSong();
    this.isTapePlaying = true;
    const ctx = this.initContext();

    const beatDuration = (60 / bpm) / this.playbackRate;
    let maxTime = 0;

    notesSequence.forEach((item, index) => {
      const startTime = item.time * beatDuration * 1000;
      const noteDur = item.dur * beatDuration;
      if (item.time + item.dur > maxTime) {
        maxTime = item.time + item.dur;
      }

      setTimeout(() => {
        if (!this.isTapePlaying) return;
        this.playSynthNote(item.note, noteDur, item.type || 'triangle', item.inst || 'synth');
        if (onProgress) {
          onProgress((item.time * beatDuration), index);
        }
      }, startTime);
    });

    const totalDuration = maxTime * beatDuration * 1000 + 400;
    this.currentTrackTimeout = window.setTimeout(() => {
      if (this.isTapePlaying && onComplete) {
        onComplete();
      }
    }, totalDuration);
  }
}

export const audioSynth = new AudioSynthEngine();
