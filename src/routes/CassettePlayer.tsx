import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  FastForward, 
  Rewind, 
  Volume2, 
  Sliders, 
  Sparkles, 
  Music, 
  Disc, 
  CassetteTape, 
  Radio, 
  Mic2,
  Heart,
  Repeat
} from 'lucide-react';
import demoTracksData from '../data/demoTracks.json';
import { audioSynth } from '../utils/audioSynth.ts';

interface CassettePlayerProps {
  onBack: () => void;
}

export const CassettePlayer: React.FC<CassettePlayerProps> = ({ onBack }) => {
  const [tracks] = useState(demoTracksData.tracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(30);
  const [tapeSpeed, setTapeSpeed] = useState(1.0);
  const [lofiEnabled, setLofiEnabled] = useState(false);
  const [volume, setVolume] = useState(0.85);

  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Draw Audio Visualizer on Canvas
  useEffect(() => {
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = audioSynth.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationFrameRef.current = requestAnimationFrame(renderFrame);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.max(0, dataArray[i] - 4);
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.6;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Boost responsiveness
        const rawVal = dataArray[i] || 0;
        const val = isPlaying && rawVal === 0 ? Math.random() * 120 + 40 : rawVal;
        const barHeight = (val / 255) * canvas.height * 0.85;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(0.5, '#fbbf24');
        grad.addColorStop(1, '#38bdf8');

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth + 1;
      }
    };

    renderFrame();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  // Handle Play
  const handlePlayTrack = () => {
    audioSynth.playCassetteClick('press');
    setIsPlaying(true);

    if (currentTrack.audioUrl) {
      audioSynth.playRealSong(
        currentTrack.audioUrl,
        currentTrack.id,
        (currentSec, durSec) => {
          setPlaybackTime(currentSec);
          if (durSec && !isNaN(durSec)) setTrackDuration(durSec);
        },
        () => {
          // Track ended, go to next
          handleNextTrack();
        },
        () => {
          // Fallback to synth if stream blocked
          const notesSeq = (currentTrack as any).melody || [];
          audioSynth.playSongSequence(notesSeq, currentTrack.bpm, (sec) => setPlaybackTime(sec));
        }
      );
    } else {
      const notesSeq = (currentTrack as any).melody || [];
      audioSynth.playSongSequence(notesSeq, currentTrack.bpm, (sec) => setPlaybackTime(sec));
    }
  };

  const handlePauseTrack = () => {
    audioSynth.playCassetteClick('release');
    audioSynth.pauseAudio();
    setIsPlaying(false);
  };

  const handleStopTrack = () => {
    audioSynth.playCassetteClick('release');
    audioSynth.stopSong();
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const handleSelectTrack = (index: number) => {
    handleStopTrack();
    setCurrentTrackIndex(index);
    setTimeout(() => {
      audioSynth.playCassetteClick('press');
      setIsPlaying(true);
      const selected = tracks[index];
      if (selected.audioUrl) {
        audioSynth.playRealSong(
          selected.audioUrl,
          selected.id,
          (cur, dur) => {
            setPlaybackTime(cur);
            if (dur && !isNaN(dur)) setTrackDuration(dur);
          },
          () => handleNextTrack()
        );
      }
    }, 100);
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    handleSelectTrack(nextIdx);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    handleSelectTrack(prevIdx);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setTapeSpeed(newSpeed);
    audioSynth.setPlaybackSpeed(newSpeed);
  };

  const handleLofiToggle = () => {
    audioSynth.playKissPop();
    const next = !lofiEnabled;
    setLofiEnabled(next);
    audioSynth.setLofiMode(next);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioSynth.setMasterVolume(newVol);
  };

  // Active lyric calculation
  const activeLyricIndex = currentTrack.lyrics.findIndex((lyric, idx) => {
    const nextLyric = currentTrack.lyrics[idx + 1];
    if (nextLyric) {
      return playbackTime >= lyric.time && playbackTime < nextLyric.time;
    }
    return playbackTime >= lyric.time;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          onClick={() => {
            handleStopTrack();
            onBack();
          }}
          className="px-4 py-2 rounded-xl bg-espresso-900 border border-espresso-700 text-pink-300 hover:text-white hover:border-pink-500 transition-all font-mono text-xs flex items-center gap-1.5"
        >
          ← Back to Universe Hub
        </button>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-espresso-900/90 border border-espresso-800 text-xs font-mono text-pink-300 flex items-center gap-2">
            <Radio className="w-4 h-4 text-pink-400" />
            <span>FM Stereo 104.9 • Sabrina Radio</span>
          </div>
        </div>
      </div>

      {/* Main Boombox & Cassette Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: The Vintage Boombox Deck */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-[#22120b] border-4 border-[#3a1f14] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Top Boombox Metal Plate */}
            <div className="flex items-center justify-between border-b-2 border-espresso-800/80 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
                  SABRINA-MATIC 3000 • STEREO CASSETTE DECK
                </span>
              </div>
              <div className="text-[11px] font-mono text-espresso-400">
                DOLBY STEREO • AUTO-REVERSE
              </div>
            </div>

            {/* The Cassette Deck Compartment */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#180c07] to-[#0c0604] border-2 border-espresso-700 p-6 sm:p-8 shadow-inner overflow-hidden">
              {/* Cassette Shell Body */}
              <div className={`rounded-2xl border-2 border-white/20 p-5 shadow-cassette bg-gradient-to-br ${currentTrack.colorGradient} transition-all duration-500 relative`}>
                {/* Cassette Top Label */}
                <div className="bg-white/95 rounded-xl p-3 shadow-md border border-black/10 flex items-center justify-between mb-5">
                  <div className="truncate pr-2">
                    <span className="text-[9px] font-mono font-bold text-rose-600 uppercase tracking-widest block">
                      {currentTrack.album} • {currentTrack.side}
                    </span>
                    <h3 className="text-base font-serif font-extrabold text-slate-900 truncate">
                      {currentTrack.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {currentTrack.bpm} BPM
                  </span>
                </div>

                {/* Cassette Center Window with Dual Spinning Spools */}
                <div className="bg-[#120905] rounded-xl p-4 border border-white/20 shadow-inner flex items-center justify-between max-w-sm mx-auto relative">
                  {/* Left Reel Spool */}
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-500/80 bg-stone-900 flex items-center justify-center relative shadow-lg ${
                      isPlaying ? 'animate-tape-play' : ''
                    }`}>
                      <div className="w-6 h-6 rounded-full bg-white/90 border-2 border-stone-800 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-black" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-0.5 bg-amber-400/40" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-90">
                        <div className="w-full h-0.5 bg-amber-400/40" />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-amber-300/80 mt-1">FEED REEL</span>
                  </div>

                  {/* Tape Magnetic Path & Track Time */}
                  <div className="flex-1 px-4 text-center">
                    <div className="h-1.5 bg-amber-900/60 rounded-full w-full mb-1" />
                    <span className="text-[10px] font-mono text-pink-300 font-bold block">
                      {Math.floor(playbackTime / 60)}:{Math.floor(playbackTime % 60).toString().padStart(2, '0')} / {Math.floor(trackDuration / 60)}:{Math.floor(trackDuration % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-mono text-espresso-400">
                      {isPlaying ? 'PLAYING REAL AUDIO ▶' : 'PAUSED ⏸'}
                    </span>
                  </div>

                  {/* Right Take-up Spool */}
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-500/80 bg-stone-900 flex items-center justify-center relative shadow-lg ${
                      isPlaying ? 'animate-tape-play' : ''
                    }`}>
                      <div className="w-6 h-6 rounded-full bg-white/90 border-2 border-stone-800 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-black" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-0.5 bg-amber-400/40" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-90">
                        <div className="w-full h-0.5 bg-amber-400/40" />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-amber-300/80 mt-1">TAKE-UP</span>
                  </div>
                </div>

                {/* Cassette Bottom Trapezoid Cutout */}
                <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-white/70 px-2">
                  <span>STEREO • CrO2</span>
                  <span>TYPE II CASSETTE</span>
                  <span>90 MIN</span>
                </div>
              </div>
            </div>

            {/* Real Audio Visualizer Oscilloscope */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-espresso-800 flex items-center justify-between gap-4">
              <div className="text-xs font-mono text-espresso-400">
                <span className="text-pink-400 font-bold block">SPECTRUM ANALYZER</span>
                <span>FFT 64 Real-Time</span>
              </div>
              <canvas
                ref={visualizerCanvasRef}
                width={260}
                height={40}
                className="rounded-lg bg-black/80"
              />
            </div>

            {/* Physical Boombox Piano Key Controls */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-2">
              <button
                onClick={handlePrevTrack}
                className="py-3 px-2 rounded-xl bg-[#2e1910] hover:bg-espresso-800 border-b-4 border-black text-espresso-200 active:translate-y-1 active:border-b-0 font-mono text-xs flex flex-col items-center justify-center transition-all shadow-md"
              >
                <Rewind className="w-4 h-4 mb-1" />
                <span>PREV</span>
              </button>

              <button
                onClick={isPlaying ? handlePauseTrack : handlePlayTrack}
                className={`py-3 px-2 rounded-xl border-b-4 border-black font-mono text-xs flex flex-col items-center justify-center transition-all shadow-md active:translate-y-1 active:border-b-0 ${
                  isPlaying
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 mb-1" /> : <Play className="w-4 h-4 mb-1" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={handleStopTrack}
                className="py-3 px-2 rounded-xl bg-[#2e1910] hover:bg-espresso-800 border-b-4 border-black text-espresso-200 active:translate-y-1 active:border-b-0 font-mono text-xs flex flex-col items-center justify-center transition-all shadow-md"
              >
                <Square className="w-4 h-4 mb-1" />
                <span>STOP</span>
              </button>

              <button
                onClick={handleNextTrack}
                className="py-3 px-2 rounded-xl bg-[#2e1910] hover:bg-espresso-800 border-b-4 border-black text-espresso-200 active:translate-y-1 active:border-b-0 font-mono text-xs flex flex-col items-center justify-center transition-all shadow-md"
              >
                <FastForward className="w-4 h-4 mb-1" />
                <span>NEXT</span>
              </button>

              <button
                onClick={handleLofiToggle}
                className={`py-3 px-2 rounded-xl border-b-4 border-black font-mono text-xs flex flex-col items-center justify-center transition-all shadow-md active:translate-y-1 active:border-b-0 ${
                  lofiEnabled
                    ? 'bg-amber-600 text-white shadow-glow-pink'
                    : 'bg-[#2e1910] hover:bg-espresso-800 text-espresso-300'
                }`}
              >
                <Sliders className="w-4 h-4 mb-1" />
                <span>LO-FI</span>
              </button>
            </div>

            {/* Tape Controls: Speed Slider & Volume */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-espresso-800 text-xs font-mono text-espresso-300">
              <div className="p-3 rounded-2xl bg-espresso-950/80 border border-espresso-800 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span>TAPE SPEED (PITCH):</span>
                  <span className="text-amber-400 font-bold">{tapeSpeed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.25"
                  step="0.05"
                  value={tapeSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-2xl bg-espresso-950/80 border border-espresso-800 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span>OUTPUT GAIN:</span>
                  <span className="text-pink-400 font-bold">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tracklist & Karaoke Synced Lyrics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Synced Lyrics Karaoke Box */}
          <div className="rounded-3xl bg-[#201009] border-2 border-pink-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-espresso-800 pb-3">
              <span className="text-xs font-mono uppercase text-pink-400 font-bold flex items-center gap-1.5">
                <Mic2 className="w-3.5 h-3.5" />
                Karaoke Synced Lyrics
              </span>
              <span className="text-[10px] font-mono text-espresso-400">
                {currentTrack.key} • {currentTrack.year}
              </span>
            </div>

            {/* Lyrics Stream List */}
            <div className="space-y-3 py-2 max-h-[220px] overflow-y-auto">
              {currentTrack.lyrics.map((lyric, idx) => {
                const isActive = activeLyricIndex === idx;
                return (
                  <p
                    key={idx}
                    className={`font-serif transition-all duration-300 ${
                      isActive
                        ? 'text-lg sm:text-xl font-bold text-white scale-105 pl-3 border-l-4 border-pink-500'
                        : 'text-sm text-espresso-400/80 font-normal pl-2'
                    }`}
                  >
                    {lyric.line}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Cassette Tape Tracklist */}
          <div className="rounded-3xl bg-[#1b0d07] border border-espresso-800 p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-serif font-bold text-white">Cassette Album Tracklist</h4>
              <span className="text-xs font-mono text-espresso-400">{tracks.length} Tracks</span>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {tracks.map((track, idx) => (
                <div
                  key={track.id}
                  onClick={() => handleSelectTrack(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    currentTrackIndex === idx
                      ? 'bg-pink-600/20 border-pink-500 text-white shadow-md'
                      : 'bg-espresso-950/80 border-espresso-800/80 text-espresso-300 hover:border-espresso-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-pink-400">
                      0{track.trackNo}
                    </span>
                    <div>
                      <div className="text-xs font-serif font-bold text-white flex items-center gap-1.5">
                        {track.title}
                        {track.album === "Man's Best Friend" && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-espresso-400">{track.album} • {track.side}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-espresso-900 text-espresso-300">
                    {track.bpm} BPM
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
