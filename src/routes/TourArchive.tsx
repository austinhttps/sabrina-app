import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Music, 
  Heart, 
  Shirt, 
  Search, 
  Camera, 
  Disc, 
  AlertCircle, 
  Filter,
  Download,
  Share2,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import tourData from '../data/tourData.json';
import { audioSynth } from '../utils/audioSynth.ts';

interface TourArchiveProps {
  onBack: () => void;
}

export const TourArchive: React.FC<TourArchiveProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'dates' | 'outfits' | 'setlist' | 'juno'>('dates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShow, setSelectedShow] = useState(tourData.shows[0]);
  const [selectedOutfit, setSelectedOutfit] = useState(tourData.outfitVault[0]);
  const [outfitColorFilter, setOutfitColorFilter] = useState<string>('all');

  // Juno Arrest Roulette State
  const [junoSpinning, setJunoSpinning] = useState(false);
  const [currentJunoPosition, setCurrentJunoPosition] = useState("The Classic Spoon (10/10 Form)");
  const [currentArrestReason, setCurrentArrestReason] = useState("Fan dressed as giant cup of iced espresso");

  const filteredShows = tourData.shows.filter((show) => {
    const q = searchQuery.toLowerCase();
    return (
      show.city.toLowerCase().includes(q) ||
      show.venue.toLowerCase().includes(q) ||
      show.surpriseSong.toLowerCase().includes(q) ||
      show.outfitColor.toLowerCase().includes(q)
    );
  });

  const filteredOutfits = tourData.outfitVault.filter((outfit) => {
    if (outfitColorFilter === 'all') return true;
    return outfit.colorName.toLowerCase() === outfitColorFilter.toLowerCase();
  });

  const spinJunoRoulette = () => {
    audioSynth.playCassetteClick('press');
    setJunoSpinning(true);

    const positions = [
      "The Wall Sit Reverse (Elite flexibility)",
      "The 360 Spin Drop (Crowd went wild)",
      "The Down Under Somersault (Aussie form)",
      "The Eiffel Tower Arch (Tres chic)",
      "The Classic Broadway Kick (10/10)"
    ];

    const arrests = [
      "Boyfriend who knew every single ad-lib in Feather",
      "Fan holding a cardboard sign asking for espresso beans",
      "Girl who recreated the entire Taste music video outfit",
      "Dad in the pit with matching baby-blue hair ribbons",
      "Superfan who attended 8 consecutive arena tour nights"
    ];

    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      setCurrentJunoPosition(positions[Math.floor(Math.random() * positions.length)]);
      setCurrentArrestReason(arrests[Math.floor(Math.random() * arrests.length)]);
      audioSynth.playTypewriterTap();

      if (ticks > 8) {
        clearInterval(interval);
        setJunoSpinning(false);
        audioSynth.playSparkle();
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }, 120);
  };

  const handlePolaroidClick = () => {
    audioSynth.playCameraShutter();
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Top Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-espresso-900 border border-espresso-700 text-pink-300 hover:text-white hover:border-pink-500 transition-all font-mono text-xs flex items-center gap-1.5"
        >
          ← Back to Universe Hub
        </button>

        <div className="flex items-center gap-2 bg-espresso-900/80 p-1.5 rounded-2xl border border-espresso-800">
          <button
            onClick={() => setActiveTab('dates')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'dates' ? 'bg-purple-600 text-white shadow-md' : 'text-espresso-300 hover:text-purple-200'
            }`}
          >
            🗺️ Tour Dates & Covers
          </button>
          <button
            onClick={() => setActiveTab('outfits')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'outfits' ? 'bg-purple-600 text-white shadow-md' : 'text-espresso-300 hover:text-purple-200'
            }`}
          >
            👗 Outfit Runway
          </button>
          <button
            onClick={() => setActiveTab('setlist')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'setlist' ? 'bg-purple-600 text-white shadow-md' : 'text-espresso-300 hover:text-purple-200'
            }`}
          >
            🎵 4-Act Setlist
          </button>
          <button
            onClick={() => setActiveTab('juno')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'juno' ? 'bg-purple-600 text-white shadow-md' : 'text-espresso-300 hover:text-purple-200'
            }`}
          >
            🚨 Juno Arrest Lab
          </button>
        </div>
      </div>

      {/* Tour Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Total Shows', val: tourData.tourStats.totalShows, icon: Calendar },
          { label: 'Countries', val: tourData.tourStats.countries, icon: MapPin },
          { label: 'Surprise Songs', val: tourData.tourStats.uniqueSurpriseSongs, icon: Music },
          { label: 'Crowd Decibels', val: tourData.tourStats.averageDecibels, icon: Sparkles },
          { label: 'Custom Outfits', val: tourData.tourStats.topOutfits, icon: Shirt },
          { label: 'Lipstick Choice', val: 'Prada Monochrome', icon: Heart },
        ].map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="p-3.5 rounded-2xl bg-[#1b0e08] border border-espresso-800 text-center">
              <Icon className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-sm font-serif font-bold text-white">{st.val}</div>
              <div className="text-[10px] font-mono text-espresso-400 uppercase mt-0.5">{st.label}</div>
            </div>
          );
        })}
      </div>

      {/* Mode 1: Tour Dates & Surprise Songs */}
      {activeTab === 'dates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Shows List */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-espresso-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, venue, or surprise song..."
                  className="w-full pl-9 pr-3 py-2 bg-espresso-950 rounded-xl border border-espresso-800 text-xs text-white placeholder-espresso-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {filteredShows.map((show) => (
                <div
                  key={show.id}
                  onClick={() => {
                    audioSynth.playCassetteClick('press');
                    setSelectedShow(show);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedShow.id === show.id
                      ? 'bg-[#29140b] border-purple-500 shadow-lg'
                      : 'bg-[#1a0e08] border-espresso-800 hover:border-espresso-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 className="text-sm font-serif font-bold text-white">{show.city}</h4>
                      <span className="text-[11px] font-mono text-espresso-400">{show.venue} • {show.date}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {show.outfitColor}
                    </span>
                  </div>

                  <div className="mt-2.5 p-2 rounded-xl bg-espresso-950/80 border border-espresso-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-pink-300 flex items-center gap-1.5">
                      <Music className="w-3 h-3 text-pink-400" />
                      Cover: {show.surpriseSong}
                    </span>
                    <span className="text-[10px] text-espresso-500">{show.surpriseSongOriginal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Selected Show Stage Details & Memory Polaroid */}
          <div className="lg:col-span-6 space-y-6">
            {/* Show Spotlight Card */}
            <div className="rounded-3xl bg-[#23120a] border-2 border-purple-500/50 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-start justify-between border-b border-espresso-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block">
                    {selectedShow.tour}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white">{selectedShow.city}</h3>
                  <p className="text-xs font-mono text-espresso-300">{selectedShow.venue} • {selectedShow.date}</p>
                </div>
                <button
                  onClick={handlePolaroidClick}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Snap Polaroid
                </button>
              </div>

              {/* Highlight Note */}
              <div className="p-4 rounded-2xl bg-espresso-950/90 border border-espresso-800">
                <span className="text-[10px] font-mono uppercase text-pink-400 font-bold block mb-1">
                  🌟 Tour Night Highlight:
                </span>
                <p className="text-xs font-sans text-pink-50/90 leading-relaxed">
                  {selectedShow.highlight}
                </p>
              </div>

              {/* Acoustic Surprise Song Details */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 to-purple-950/40 border border-pink-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-pink-300 flex items-center gap-1.5">
                    <Music className="w-4 h-4" />
                    Surprise Acoustic Cover
                  </span>
                  <span className="text-[10px] font-mono text-espresso-400">Nightly Exclusive</span>
                </div>
                <p className="text-base font-serif font-bold text-white">
                  "{selectedShow.surpriseSong}"
                </p>
                <p className="text-xs font-sans text-espresso-300 italic">
                  Originally performed by {selectedShow.surpriseSongOriginal}. Sabrina played this on acoustic guitar at the fireplace stage.
                </p>
              </div>

              {/* Outfit & Juno Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-espresso-950/80 border border-espresso-800">
                  <span className="text-espresso-400 block text-[10px]">WARDROBE WORN:</span>
                  <span className="text-white font-bold">{selectedShow.outfitName}</span>
                </div>
                <div className="p-3 rounded-xl bg-espresso-950/80 border border-espresso-800">
                  <span className="text-espresso-400 block text-[10px]">JUNO FORM:</span>
                  <span className="text-purple-300 font-bold">{selectedShow.junoPosition}</span>
                </div>
              </div>
            </div>

            {/* Vintage Polaroid Collectible Card */}
            <div className="bg-white text-stone-900 rounded-2xl p-5 pb-8 shadow-2xl max-w-sm mx-auto transform rotate-1 hover:rotate-0 transition-transform">
              <div className="aspect-[4/3] bg-espresso-950 rounded-lg mb-4 overflow-hidden relative flex items-center justify-center p-4 text-center">
                <div className="space-y-1">
                  <span className="text-3xl">💋✨</span>
                  <h5 className="font-serif font-bold text-white text-base">{selectedShow.city}</h5>
                  <p className="text-[10px] font-mono text-pink-300">{selectedShow.date}</p>
                </div>
              </div>
              <div className="text-center font-handwritten text-xl text-stone-800 font-bold">
                "Best night ever in {selectedShow.city.split(',')[0]}!" 💋
              </div>
              <div className="text-center font-mono text-[9px] text-stone-400 mt-1 uppercase">
                Short n' Sweet World Tour Archive • Collector Item #0{selectedShow.id.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Iconic Outfit Runway */}
      {activeTab === 'outfits' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white">Custom Wardrobe Vault</h2>
              <p className="text-xs text-espresso-300">
                Haute couture stage garments designed for the Short n' Sweet Tour.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-espresso-900/90 p-1 rounded-xl border border-espresso-800">
              {['all', 'Baby Blue', 'Cherry Red', 'Butter Yellow', 'Espresso Brown', 'Crystal Silver'].map((col) => (
                <button
                  key={col}
                  onClick={() => setOutfitColorFilter(col)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    outfitColorFilter === col ? 'bg-purple-600 text-white' : 'text-espresso-300 hover:text-white'
                  }`}
                >
                  {col === 'all' ? 'All Colors' : col}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOutfits.map((outfit) => (
              <div
                key={outfit.id}
                onClick={() => {
                  audioSynth.playCassetteClick('press');
                  setSelectedOutfit(outfit);
                }}
                className="p-6 rounded-3xl bg-[#1f1009] border border-espresso-800 hover:border-purple-500/70 transition-all shadow-xl space-y-4 group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: outfit.color }}
                    />
                    <span className="text-xs font-mono font-bold text-purple-300">
                      {outfit.colorName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-espresso-950 text-espresso-400">
                    {outfit.act.split(':')[0]}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-pink-200 transition-colors">
                    {outfit.name}
                  </h3>
                  <p className="text-xs font-mono text-pink-400/90 mt-0.5">
                    {outfit.designer}
                  </p>
                </div>

                <p className="text-xs font-sans text-espresso-200/80 leading-relaxed">
                  {outfit.vibe}
                </p>

                <div className="p-3 rounded-2xl bg-espresso-950/80 border border-espresso-800/80 text-[11px] font-mono space-y-1">
                  <div className="text-espresso-400">
                    <span className="text-purple-400">Accessories:</span> {outfit.accessories}
                  </div>
                  <div className="text-espresso-400">
                    <span className="text-pink-400">Worn in:</span> {outfit.wornCities.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: 4-Act Setlist Breakdown */}
      {activeTab === 'setlist' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-3xl font-serif font-bold text-white">Full Arena 4-Act Setlist</h2>
            <p className="text-xs text-espresso-300 mt-1">
              Curated chronological setlist from the penthouse television intro to the Espresso encore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tourData.setlistActs.map((actData, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#1d0f09] border border-espresso-800 shadow-xl space-y-4"
              >
                <div className="border-b border-espresso-800 pb-3">
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block mb-1">
                    Stage Concept
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">{actData.act}</h3>
                  <p className="text-xs font-sans text-espresso-300 mt-1">
                    {actData.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {actData.songs.map((song, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl bg-espresso-950/80 border border-espresso-800/80 flex items-center justify-between hover:border-pink-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold flex items-center justify-center">
                          {sIdx + 1}
                        </span>
                        <span className="text-sm font-serif font-bold text-white">{song.title}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                        {song.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 4: Juno Position & Arrest Roulette */}
      {activeTab === 'juno' && (
        <div className="max-w-2xl mx-auto bg-[#201009] border-2 border-purple-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div>
            <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500 text-purple-400 flex items-center justify-center mx-auto text-2xl shadow-glow-pink mb-3">
              🚨
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              "Juno" Position & Fan Arrest Lab
            </h2>
            <p className="text-xs text-espresso-300 mt-1">
              Every night on tour, Sabrina strikes an audacious new pose during 'Juno' and places a lucky fan in fuzzy handcuffs!
            </p>
          </div>

          {/* Generated Result Display */}
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-2xl bg-espresso-950/90 border border-espresso-800 text-left">
              <span className="text-[10px] font-mono uppercase text-pink-400 font-bold block mb-1">
                💃 TONIGHT'S JUNO POSE FORM:
              </span>
              <p className="text-lg font-serif font-bold text-white">
                {currentJunoPosition}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-espresso-950/90 border border-espresso-800 text-left">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block mb-1">
                🚨 ARENA FAN ARREST CITATION:
              </span>
              <p className="text-sm font-sans text-pink-100">
                "{currentArrestReason}"
              </p>
            </div>
          </div>

          <button
            onClick={spinJunoRoulette}
            disabled={junoSpinning}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-serif font-bold text-sm shadow-diner-pink transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {junoSpinning ? 'Spinning Arrest Roulette...' : 'Spin Tour Roulette 🎲'}
          </button>
        </div>
      )}
    </div>
  );
};
