import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mic2, 
  Mail, 
  Coffee, 
  Compass, 
  CassetteTape, 
  Heart, 
  Home, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Droplets,
  Play,
  Pause,
  FastForward,
  Rewind,
  Music
} from 'lucide-react';
import { Hub } from './routes/Hub.tsx';
import { OutroGenerator } from './routes/OutroGenerator.tsx';
import { WebmailClient } from './routes/WebmailClient.tsx';
import { DinerCafe } from './routes/DinerCafe.tsx';
import { TourArchive } from './routes/TourArchive.tsx';
import { CassettePlayer } from './routes/CassettePlayer.tsx';
import { PerfumeLounge } from './routes/PerfumeLounge.tsx';
import { audioSynth } from './utils/audioSynth.ts';
import demoTracksData from './data/demoTracks.json';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return ['hub', 'outro', 'webmail', 'diner', 'perfume', 'tour', 'cassette'].includes(hash) ? hash : 'hub';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioState, setAudioState] = useState(audioSynth.getState());
  const [tracks] = useState(demoTracksData.tracks);

  // Subscribe to audio engine updates
  useEffect(() => {
    const unsubscribe = audioSynth.subscribe((state) => {
      setAudioState({ ...state });
    });
    return () => unsubscribe();
  }, []);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['hub', 'outro', 'webmail', 'diner', 'perfume', 'tour', 'cassette'].includes(hash)) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTrackIndex = tracks.findIndex(t => t.id === audioState.trackId);
  const activeTrack = tracks[currentTrackIndex >= 0 ? currentTrackIndex : 0];

  // Header & Floating Player Controls
  const togglePlayPause = () => {
    if (audioState.isPlaying) {
      audioSynth.pauseAudio();
    } else {
      if (audioState.trackId) {
        audioSynth.resumeAudio();
      } else {
        const first = tracks[0];
        audioSynth.playRealSong(first.audioUrl, first.id, first.title);
      }
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIdx];
    audioSynth.playRealSong(nextTrack.audioUrl, nextTrack.id, nextTrack.title);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    const prevTrack = tracks[prevIdx];
    audioSynth.playRealSong(prevTrack.audioUrl, prevTrack.id, prevTrack.title);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    audioSynth.seek(parseFloat(e.target.value));
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    audioSynth.setMasterVolume(parseFloat(e.target.value));
  };

  const navItems = [
    { id: 'hub', label: 'Hub', icon: Home },
    { id: 'outro', label: 'Outro Studio', icon: Mic2 },
    { id: 'webmail', label: 'Webmail', icon: Mail },
    { id: 'diner', label: 'Espresso Diner', icon: Coffee },
    { id: 'perfume', label: 'Perfume Vault', icon: Droplets },
    { id: 'tour', label: 'Tour Vault', icon: Compass },
    { id: 'cassette', label: 'Boombox', icon: CassetteTape },
  ];

  return (
    <div className="min-h-screen bg-[#130b08] text-pink-50 flex flex-col justify-between selection:bg-pink-500 selection:text-white pb-24">
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#1a0e08]/90 border-b border-espresso-800/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo without harsh box outline */}
          <div 
            onClick={() => navigateTo('hub')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <span className="text-3xl filter drop-shadow-md transition-transform group-hover:scale-110 select-none">
              💋
            </span>
            <div>
              <span className="font-cursive text-2xl sm:text-3xl text-white group-hover:text-pink-300 transition-colors block leading-tight">
                Sabrina Carpenter
              </span>
              <span className="text-[10px] font-mono text-pink-400 tracking-wider uppercase block -mt-1 font-semibold">
                A Carpenter's Experience
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-espresso-950/70 p-1.5 rounded-2xl border border-espresso-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md font-bold'
                      : 'text-espresso-300 hover:text-white hover:bg-espresso-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Toolbar: Global Header Music Button & Mobile Hamburger */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={togglePlayPause}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all shadow-md ${
                audioState.isPlaying
                  ? 'bg-rose-600 text-white shadow-glow-pink animate-pulse'
                  : 'bg-espresso-900 border border-espresso-700 text-pink-300 hover:text-white hover:border-pink-500'
              }`}
              title={audioState.isPlaying ? "Pause Music" : "Play Sabrina's Songs"}
            >
              {audioState.isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline font-bold truncate max-w-[130px]">
                    {audioState.trackTitle || activeTrack.title}
                  </span>
                  <div className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
                    <span className="w-1 h-2 bg-white rounded-full animate-bounce delay-75" />
                    <span className="w-1 h-3.5 bg-white rounded-full animate-bounce delay-150" />
                  </div>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Play Sabrina</span>
                </>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-espresso-900 border border-espresso-700 text-espresso-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-2 space-y-1 border-t border-espresso-800/80 mt-3 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-pink-600 text-white font-bold'
                      : 'text-espresso-300 hover:bg-espresso-900/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Experience View */}
      <main className="flex-1">
        {currentRoute === 'hub' && <Hub onNavigate={navigateTo} />}
        {currentRoute === 'outro' && <OutroGenerator onBack={() => navigateTo('hub')} />}
        {currentRoute === 'webmail' && <WebmailClient onBack={() => navigateTo('hub')} />}
        {currentRoute === 'diner' && <DinerCafe onBack={() => navigateTo('hub')} />}
        {currentRoute === 'perfume' && <PerfumeLounge onBack={() => navigateTo('hub')} />}
        {currentRoute === 'tour' && <TourArchive onBack={() => navigateTo('hub')} />}
        {currentRoute === 'cassette' && <CassettePlayer onBack={() => navigateTo('hub')} />}
      </main>

      {/* Global Floating Mini Music Player Bar */}
      <div className="fixed bottom-3 inset-x-3 sm:inset-x-6 max-w-4xl mx-auto z-40">
        <div className="rounded-2xl bg-[#1b0d07]/95 backdrop-blur-xl border-2 border-pink-500/40 p-3 sm:px-5 shadow-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          {/* Track Info */}
          <div 
            onClick={() => navigateTo('cassette')}
            className="flex items-center gap-3 cursor-pointer group min-w-0"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeTrack.colorGradient || 'from-pink-600 to-rose-900'} border border-white/20 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
              <CassetteTape className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <h4 className="text-xs sm:text-sm font-serif font-bold text-white group-hover:text-pink-300 transition-colors truncate">
                {audioState.trackTitle || activeTrack.title}
              </h4>
              <span className="text-[10px] font-mono text-espresso-300 block truncate">
                {activeTrack.album} • {activeTrack.bpm} BPM
              </span>
            </div>
          </div>

          {/* Player Controls & Scrubber */}
          <div className="flex-1 max-w-md flex flex-col items-center gap-1 order-last sm:order-none w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevTrack}
                className="p-1.5 rounded-lg text-espresso-300 hover:text-white hover:bg-espresso-900 transition-all"
                title="Previous Track"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlayPause}
                className={`p-2 rounded-full font-bold shadow-md transition-all active:scale-95 ${
                  audioState.isPlaying
                    ? 'bg-rose-600 text-white shadow-glow-pink'
                    : 'bg-pink-600 hover:bg-pink-500 text-white'
                }`}
                title={audioState.isPlaying ? "Pause" : "Play"}
              >
                {audioState.isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-1.5 rounded-lg text-espresso-300 hover:text-white hover:bg-espresso-900 transition-all"
                title="Next Track"
              >
                <FastForward className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber & Time */}
            <div className="w-full flex items-center gap-2 text-[10px] font-mono text-espresso-400">
              <span>
                {Math.floor(audioState.currentTime / 60)}:{Math.floor(audioState.currentTime % 60).toString().padStart(2, '0')}
              </span>
              <input
                type="range"
                min="0"
                max={audioState.duration || 30}
                step="0.1"
                value={audioState.currentTime}
                onChange={handleSeek}
                className="flex-1 accent-pink-500 cursor-pointer h-1 bg-espresso-900 rounded-lg"
              />
              <span>
                {Math.floor(audioState.duration / 60)}:{Math.floor(audioState.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Volume Slider & Open Boombox */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-espresso-400 hidden md:block" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioState.volume}
              onChange={handleVolume}
              className="w-16 accent-pink-500 cursor-pointer h-1 bg-espresso-900 rounded-lg hidden md:block"
              title="Volume"
            />
            <button
              onClick={() => navigateTo('cassette')}
              className="px-2.5 py-1 rounded-xl bg-espresso-900 border border-espresso-700 text-pink-300 hover:text-white text-[11px] font-mono whitespace-nowrap"
            >
              Boombox 📻
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
