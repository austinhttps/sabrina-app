/**
 * Web Audio API Synthesizer & Real Audio Player Engine
 * Direct HTML5 Audio playback for crisp, unblocked real song streaming across all browsers.
 */

export interface TrackInfo {
  id: string;
  title: string;
  album: string;
  audioUrl: string;
}

type AudioListener = (state: {
  isPlaying: boolean;
  trackId: string | null;
  trackTitle: string | null;
  currentTime: number;
  duration: number;
  volume: number;
}) => void;

class AudioSynthEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isTapePlaying: boolean = false;
  private currentTrackId: string | null = null;
  private currentTrackTitle: string | null = null;
  private currentAudioUrl: string | null = null;
  private volume: number = 0.85;
  private playbackRate: number = 1.0;
  private listeners: Set<AudioListener> = new Set();
  private duration: number = 30;
  private currentTime: number = 0;

  constructor() {
    this.initAudioElement();
  }

  private initAudioElement() {
    if (typeof window === 'undefined') return;

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.preload = 'auto';
      this.audioElement.volume = this.volume;

      this.audioElement.addEventListener('timeupdate', () => {
        if (this.audioElement) {
          this.currentTime = this.audioElement.currentTime;
          if (this.audioElement.duration && !isNaN(this.audioElement.duration)) {
            this.duration = this.audioElement.duration;
          }
          this.notifyListeners();
        }
      });

      this.audioElement.addEventListener('play', () => {
        this.isTapePlaying = true;
        this.notifyListeners();
      });

      this.audioElement.addEventListener('pause', () => {
        this.isTapePlaying = false;
        this.notifyListeners();
      });

      this.audioElement.addEventListener('ended', () => {
        this.isTapePlaying = false;
        this.notifyListeners();
      });

      this.audioElement.addEventListener('error', (e) => {
        console.warn('Audio playback error:', e);
        this.isTapePlaying = false;
        this.notifyListeners();
      });
    }
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    // Send immediate initial state
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }

  public getState() {
    return {
      isPlaying: this.isTapePlaying,
      trackId: this.currentTrackId,
      trackTitle: this.currentTrackTitle,
      currentTime: this.currentTime,
      duration: this.duration,
      volume: this.volume,
    };
  }

  public playRealSong(
    audioUrl: string,
    trackId: string,
    trackTitle?: string,
    onProgress?: (currentTimeSec: number, durationSec: number) => void,
    onEnded?: () => void
  ) {
    this.initAudioElement();
    if (!this.audioElement) return;

    if (this.currentAudioUrl !== audioUrl || !this.audioElement.src) {
      this.currentAudioUrl = audioUrl;
      this.currentTrackId = trackId;
      this.currentTrackTitle = trackTitle || trackId;
      this.audioElement.src = audioUrl;
      this.audioElement.playbackRate = this.playbackRate;
      this.audioElement.volume = this.volume;
      this.audioElement.currentTime = 0;
    }

    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isTapePlaying = true;
          this.notifyListeners();
        })
        .catch((err) => {
          console.log('Audio autoplay prevented, awaiting user interaction:', err);
          this.isTapePlaying = false;
          this.notifyListeners();
        });
    }

    if (onEnded) {
      this.audioElement.onended = () => {
        this.isTapePlaying = false;
        this.notifyListeners();
        onEnded();
      };
    }
  }

  public pauseAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isTapePlaying = false;
    this.notifyListeners();
  }

  public resumeAudio() {
    if (this.audioElement && this.audioElement.src) {
      this.audioElement.play().catch(() => {});
      this.isTapePlaying = true;
      this.notifyListeners();
    }
  }

  public stopSong() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.isTapePlaying = false;
    this.currentTime = 0;
    this.notifyListeners();
  }

  public seek(seconds: number) {
    if (this.audioElement) {
      this.audioElement.currentTime = seconds;
      this.currentTime = seconds;
      this.notifyListeners();
    }
  }

  public setMasterVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    this.notifyListeners();
  }

  public setPlaybackSpeed(rate: number) {
    this.playbackRate = Math.max(0.5, Math.min(2.0, rate));
    if (this.audioElement) {
      this.audioElement.playbackRate = this.playbackRate;
    }
  }

  public getIsPlaying(): boolean {
    return this.isTapePlaying;
  }

  public getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  public getCurrentTrackTitle(): string | null {
    return this.currentTrackTitle;
  }

  // Synthesizer note generator for OutroGenerator beatbox
  public playSynthNote(
    frequency: number,
    durationSec: number = 0.3,
    type: OscillatorType = 'sine',
    instrument: 'rhodes' | 'bass' | 'lead' | 'synth' = 'synth'
  ) {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);

      if (instrument === 'bass') {
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
      } else if (instrument === 'rhodes') {
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
      } else {
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + durationSec);
      setTimeout(() => ctx.close(), (durationSec + 0.5) * 1000);
    } catch (e) {
      // AudioContext fallback
    }
  }

  // UI Sound effect no-ops (all buzzers silenced)
  public playSparkle() {}
  public playCassetteClick(_type: string = 'press') {}
  public playDinerBell() {}
  public playSteamHiss(_durationSec: number = 1.2) {}
  public playTypewriterTap() {}
  public playCameraShutter() {}
  public playKissPop() {}
  public playPerfumeSpritz() {}
  public setLofiMode(_enabled: boolean) {}
  public getAnalyser(): AnalyserNode | null {
    return null;
  }
}

export const audioSynth = new AudioSynthEngine();

