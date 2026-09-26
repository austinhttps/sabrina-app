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
  // Current route: 'hub' | 'outro' | 'webmail' | 'diner' | 'perfume' | 'tour' | 'cassette'
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return ['hub', 'outro', 'webmail', 'diner', 'perfume', 'tour', 'cassette'].includes(hash) ? hash : 'hub';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingGlobal, setIsPlayingGlobal] = useState(false);
  const [currentSongTitle, setCurrentSongTitle] = useState('Espresso');

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

  // Global Header Audio Play/Pause Trigger
  const toggleGlobalAudio = () => {
    if (isPlayingGlobal) {
      audioSynth.pauseAudio();
      setIsPlayingGlobal(false);
    } else {
      const signatureTrack = demoTracksData.tracks[0]; // Espresso
      setCurrentSongTitle(signatureTrack.title);
      audioSynth.playRealSong(
        signatureTrack.audioUrl,
        signatureTrack.id,
        undefined,
        () => setIsPlayingGlobal(false)
      );
      setIsPlayingGlobal(true);
    }
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
    <div className="min-h-screen bg-[#130b08] text-pink-50 flex flex-col justify-between selection:bg-pink-500 selection:text-white">
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

          {/* Right Toolbar: Global Audio Music Player & Mobile Hamburger */}
          <div className="flex items-center gap-2.5">
            {/* Global Music Player Button with Live Equalizer Animation */}
            <button
              onClick={toggleGlobalAudio}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all shadow-md ${
                isPlayingGlobal
                  ? 'bg-rose-600 text-white shadow-glow-pink animate-pulse'
                  : 'bg-espresso-900 border border-espresso-700 text-pink-300 hover:text-white hover:border-pink-500'
              }`}
              title={isPlayingGlobal ? "Pause Song" : "Play Sabrina's Music"}
            >
              {isPlayingGlobal ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline font-bold">Playing: {currentSongTitle}</span>
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
    </div>
  );
};

export default App;
