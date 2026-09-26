import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic2, 
  Sparkles, 
  Play, 
  Square, 
  Volume2, 
  Copy, 
  Check, 
  Shuffle, 
  Flame, 
  Radio, 
  Share2, 
  MapPin, 
  Music,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import outroData from '../data/outroRhymes.json';
import { audioSynth } from '../utils/audioSynth.ts';

interface OutroGeneratorProps {
  onBack: () => void;
}

export const OutroGenerator: React.FC<OutroGeneratorProps> = ({ onBack }) => {
  // Navigation & Modes
  const [activeTab, setActiveTab] = useState<'explorer' | 'studio' | 'beatbox'>('studio');

  // Explorer State
  const [selectedTourOutro, setSelectedTourOutro] = useState(outroData.iconicOutros[0]);

  // Custom Studio State
  const [cityInput, setCityInput] = useState('Miami');
  const [selectedCategory, setSelectedCategory] = useState<'espresso' | 'shortnsweet' | 'spicy' | 'city'>('espresso');
  const [spicyLevel, setSpicyLevel] = useState(85);
  const [customVerseLines, setCustomVerseLines] = useState<string[]>([
    "I'm in Miami, looking way too pretty",
    "I ordered double espresso with the foam",
    "He said he'll never ever leave me alone",
    "Miami, you know you love me! 💋"
  ]);
  const [copied, setCopied] = useState(false);

  // Beatbox Loop State
  const [isBeatPlaying, setIsBeatPlaying] = useState(false);
  const [beatStep, setBeatStep] = useState(0);
  const beatIntervalRef = useRef<number | null>(null);

  // Auto-generate verse when city or category changes
  const generateNewVerse = (city: string = cityInput, category: 'espresso' | 'shortnsweet' | 'spicy' | 'city' = selectedCategory) => {
    audioSynth.playSparkle();
    const cleanCity = city.trim() || 'This City';
    
    // Pick opener
    const openers = outroData.generatorWordBank.openers;
    const rawOpener = openers[Math.floor(Math.random() * openers.length)];
    const line1 = rawOpener.replace('{CITY}', cleanCity);

    // Pick rhyme pair
    const rhPairList = outroData.generatorWordBank.rhymeCategories[category]?.rhymes || [];
    const chosenPair = rhPairList[Math.floor(Math.random() * rhPairList.length)] || [
      "He said my lipstick looks damn pretty",
      "Good luck getting over me, what a pity!"
    ];

    // Pick punchline
    const punchlines = outroData.generatorWordBank.punchlines;
    const rawPunch = punchlines[Math.floor(Math.random() * punchlines.length)];
    const line4 = rawPunch.replace('{CITY}', cleanCity);

    setCustomVerseLines([
      line1,
      chosenPair[0] || "He whispered softly on the phone",
      chosenPair[1] || "And now he won't leave me alone",
      line4
    ]);
  };

  // Beatbox Synthesizer Loop (96 BPM Nonsense Groove)
  const toggleBeatbox = () => {
    if (isBeatPlaying) {
      if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
      setIsBeatPlaying(false);
      audioSynth.playCassetteClick('release');
    } else {
      audioSynth.playCassetteClick('press');
      setIsBeatPlaying(true);
      let step = 0;
      
      // 96 BPM = 625ms per quarter note beat -> 156.25ms per 16th note
      const intervalMs = 156.25;

      beatIntervalRef.current = window.setInterval(() => {
        setBeatStep(step % 16);

        // Bass Kick on 0, 4, 8, 12
        if (step % 4 === 0) {
          audioSynth.playSynthNote(65.41, 0.15, 'triangle', 'bass'); // C2 Kick
        }
        // Snare / Clap on 4, 12
        if (step % 8 === 4) {
          audioSynth.playSynthNote(220, 0.08, 'triangle', 'synth');
        }
        // Funky Bassline on steps 0, 3, 6, 8, 11, 14
        const bassNotes = [130.81, 146.83, 164.81, 174.61, 196.00];
        if ([0, 3, 6, 8, 11, 14].includes(step % 16)) {
          const n = bassNotes[(step % bassNotes.length)];
          audioSynth.playSynthNote(n, 0.12, 'sawtooth', 'bass');
        }

        step = (step + 1) % 16;
      }, intervalMs);
    }
  };

  useEffect(() => {
    return () => {
      if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    };
  }, []);

  const handleCopy = () => {
    const textToCopy = `🎤 Sabrina Carpenter "Nonsense" Outro Live:\n\n${customVerseLines.join('\n')}\n\n✨ Crafted in Sabrina Carpenter Universe`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    audioSynth.playSparkle();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-espresso-900 border border-espresso-700 text-pink-300 hover:text-white hover:border-pink-500 transition-all font-mono text-xs flex items-center gap-1.5"
        >
          ← Back to Universe Hub
        </button>

        <div className="flex items-center gap-2 bg-espresso-900/80 p-1.5 rounded-2xl border border-espresso-800">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'studio' ? 'bg-pink-600 text-white shadow-md' : 'text-espresso-300 hover:text-pink-200'
            }`}
          >
            ✍️ Outro Studio
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'explorer' ? 'bg-pink-600 text-white shadow-md' : 'text-espresso-300 hover:text-pink-200'
            }`}
          >
            🌟 Tour Archive
          </button>
          <button
            onClick={() => setActiveTab('beatbox')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'beatbox' ? 'bg-pink-600 text-white shadow-md' : 'text-espresso-300 hover:text-pink-200'
            }`}
          >
            🥁 96 BPM Beatbox
          </button>
        </div>
      </div>

      {/* Main Studio Mode */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Config Panel */}
          <div className="lg:col-span-5 bg-[#1f110b] border border-espresso-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
            <div>
              <div className="flex items-center gap-2 text-pink-400 mb-1">
                <Mic2 className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-widest font-bold">Rhyme Configurator</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">Create Custom Outro</h2>
              <p className="text-xs text-espresso-300 mt-1">
                Enter your city or venue to generate cheekily crafted 4-bar Nonsense outro verses.
              </p>
            </div>

            {/* City Input */}
            <div>
              <label className="block text-xs font-mono text-espresso-200 font-semibold mb-2">
                📍 TOUR STOP / CITY NAME:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="e.g. Manchester, Chicago, Tokyo, Paris..."
                  className="w-full px-4 py-3 rounded-xl bg-espresso-950/90 border border-espresso-700 text-white placeholder-espresso-500 focus:outline-none focus:border-pink-500 text-sm font-medium"
                />
                <button
                  onClick={() => {
                    const cities = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Miami', 'Las Vegas', 'Nashville', 'Dublin', 'Seattle'];
                    const randomCity = cities[Math.floor(Math.random() * cities.length)];
                    setCityInput(randomCity);
                    generateNewVerse(randomCity, selectedCategory);
                  }}
                  className="absolute right-2.5 top-2.5 px-2.5 py-1 rounded-lg bg-espresso-800 hover:bg-pink-600 text-espresso-200 hover:text-white text-xs font-mono transition-colors"
                >
                  Randomize
                </button>
              </div>
            </div>

            {/* Rhyme Category Vibe */}
            <div>
              <label className="block text-xs font-mono text-espresso-200 font-semibold mb-2">
                ✨ CHOOSE LYRICAL VIBE:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'espresso', label: '☕ Espresso', sub: 'Caffeinated & Bold' },
                  { id: 'shortnsweet', label: '🍒 Short n\' Sweet', sub: 'Height Jokes & Flirt' },
                  { id: 'spicy', label: '🌶️ Extra Spicy', sub: 'Audacious & Witty' },
                  { id: 'city', label: '🌆 City & Nightlife', sub: 'Crowd Hype' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id as any);
                      generateNewVerse(cityInput, cat.id as any);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-pink-600/20 border-pink-500 text-pink-100 shadow-md'
                        : 'bg-espresso-900/50 border-espresso-800 text-espresso-300 hover:border-espresso-700'
                    }`}
                  >
                    <div className="font-serif font-bold text-xs">{cat.label}</div>
                    <div className="text-[10px] text-espresso-400 mt-0.5">{cat.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cheekiness Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-espresso-200 font-semibold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  SASS & SPICE METER:
                </label>
                <span className="text-xs font-mono text-rose-400 font-bold">{spicyLevel}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={spicyLevel}
                onChange={(e) => setSpicyLevel(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-espresso-400 mt-1">
                <span>Sweet & Innocent</span>
                <span>Iconic Mic Drop</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => generateNewVerse(cityInput, selectedCategory)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-serif font-bold text-sm shadow-diner-pink transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Shuffle className="w-4 h-4" />
                Generate New Rhyme
              </button>
            </div>
          </div>

          {/* Right Live Stage & Mic Teleprompter */}
          <div className="lg:col-span-7 space-y-6">
            {/* The Teleprompter Box */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#2a1710] to-[#160b06] border-2 border-pink-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden">
              {/* Stage Lights Ambient Glow */}
              <div className="absolute top-0 left-1/4 w-1/2 h-20 bg-pink-500/15 blur-3xl pointer-events-none" />
              
              {/* Stage Mic Header */}
              <div className="flex items-center justify-between border-b border-espresso-800 pb-4 mb-6 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-mono uppercase tracking-widest text-pink-300 font-semibold">
                    Live Teleprompter • 96 BPM
                  </span>
                </div>
                <span className="text-xs font-mono text-espresso-400">
                  {cityInput.toUpperCase() || 'TOUR'} STOP
                </span>
              </div>

              {/* 4-Verse Lyrics Display */}
              <div className="space-y-4 my-6 relative z-10">
                {customVerseLines.map((line, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-espresso-950/70 border border-espresso-800/80 hover:border-pink-500/40 transition-colors flex items-center gap-3 group"
                  >
                    <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>
                    <p className="text-base sm:text-lg md:text-xl font-serif font-bold text-white group-hover:text-pink-200 transition-colors leading-relaxed">
                      "{line}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Teleprompter Control Toolbar */}
              <div className="pt-4 border-t border-espresso-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
                <button
                  onClick={toggleBeatbox}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                    isBeatPlaying
                      ? 'bg-rose-600 text-white animate-pulse shadow-lg'
                      : 'bg-espresso-900 border border-espresso-700 text-pink-300 hover:bg-espresso-800'
                  }`}
                >
                  {isBeatPlaying ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  {isBeatPlaying ? 'Stop 96 BPM Beat' : 'Sing to 96 BPM Beat'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-xl bg-espresso-900 border border-espresso-700 text-espresso-200 hover:text-white hover:border-pink-500 text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied Verse!' : 'Copy Verse'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Sassy Soundboard for Outro Performance */}
            <div className="bg-[#1b0e08] border border-espresso-800 rounded-3xl p-5 shadow-lg">
              <span className="text-[11px] font-mono uppercase tracking-widest text-espresso-400 font-semibold block mb-3">
                🎤 Outro Soundboard FX (Click to Fire)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: '💋 Kiss Pop', action: () => audioSynth.playKissPop() },
                  { label: '✨ Sparkle Chime', action: () => audioSynth.playSparkle() },
                  { label: '☕ Espresso Steam', action: () => audioSynth.playSteamHiss(0.8) },
                  { label: '🔔 Diner Bell', action: () => audioSynth.playDinerBell() }
                ].map((sfx, idx) => (
                  <button
                    key={idx}
                    onClick={sfx.action}
                    className="py-2.5 px-3 rounded-xl bg-espresso-900/90 border border-espresso-700/70 hover:border-pink-500/60 text-pink-200 text-xs font-mono font-medium hover:bg-pink-600/20 transition-all text-center active:scale-95"
                  >
                    {sfx.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tour Outros Archive Explorer */}
      {activeTab === 'explorer' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-3xl font-serif font-bold text-white">Iconic Live Outros Archive</h2>
            <p className="text-xs text-espresso-300 mt-1">
              Listen, read, and explore Sabrina's real iconic improvised outro verses from world tour stops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {outroData.iconicOutros.map((outro) => (
              <div
                key={outro.id}
                onClick={() => {
                  audioSynth.playCassetteClick('press');
                  setSelectedTourOutro(outro);
                }}
                className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                  selectedTourOutro.id === outro.id
                    ? 'bg-gradient-to-b from-[#2e1810] to-[#1a0c07] border-pink-500 shadow-xl'
                    : 'bg-[#1a0e08] border-espresso-800/80 hover:border-espresso-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-pink-400">
                    {outro.city}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                    🔥 {outro.spicyMeter}%
                  </span>
                </div>
                <p className="text-[11px] font-mono text-espresso-400 mb-3">{outro.date}</p>
                <p className="text-xs font-serif italic text-pink-100/90 line-clamp-3">
                  "{outro.verses[0]}..."
                </p>
              </div>
            ))}
          </div>

          {/* Selected Tour Outro Detailed Card */}
          <div className="bg-[#24130b] border-2 border-pink-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto mt-8">
            <div className="flex items-center justify-between border-b border-espresso-800 pb-3 mb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">{selectedTourOutro.city}</h3>
                <span className="text-xs font-mono text-pink-400">{selectedTourOutro.date}</span>
              </div>
              <button
                onClick={() => {
                  setCustomVerseLines([...selectedTourOutro.verses]);
                  setCityInput(selectedTourOutro.city);
                  setActiveTab('studio');
                  audioSynth.playSparkle();
                }}
                className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-mono font-semibold transition-all"
              >
                Load into Studio ✍️
              </button>
            </div>

            <div className="space-y-3 my-4">
              {selectedTourOutro.verses.map((v, i) => (
                <div key={i} className="p-3 rounded-xl bg-espresso-950/80 border border-espresso-800/80 text-sm font-serif font-bold text-pink-100">
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 96 BPM Beatbox Station Mode */}
      {activeTab === 'beatbox' && (
        <div className="max-w-2xl mx-auto bg-[#20110a] border border-espresso-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Radio className="w-7 h-7 animate-pulse" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">96 BPM Rhythm Sequencer</h2>
            <p className="text-xs text-espresso-300 mt-1">
              The signature tempo used in the iconic live outro bounce. Click start and practice your timing!
            </p>
          </div>

          {/* Visual Step Sequencer Lights (16 steps) */}
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 py-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded-lg transition-all ${
                  isBeatPlaying && beatStep === i
                    ? 'bg-rose-500 shadow-glow-pink scale-110'
                    : i % 4 === 0
                    ? 'bg-espresso-700/80'
                    : 'bg-espresso-900/80'
                }`}
              />
            ))}
          </div>

          {/* Play / Stop Master Button */}
          <button
            onClick={toggleBeatbox}
            className={`w-full py-4 rounded-2xl text-base font-serif font-bold transition-all shadow-xl flex items-center justify-center gap-2 ${
              isBeatPlaying
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white'
            }`}
          >
            {isBeatPlaying ? <Square className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            {isBeatPlaying ? 'Stop Sequencer' : 'Start 96 BPM Beat'}
          </button>
        </div>
      )}
    </div>
  );
};
