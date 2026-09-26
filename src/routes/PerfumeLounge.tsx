import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Flame, 
  Compass, 
  Layers, 
  Droplets, 
  Check, 
  HelpCircle, 
  RotateCcw,
  ShoppingBag,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PerfumeLoungeProps {
  onBack: () => void;
}

interface Perfume {
  id: string;
  name: string;
  subtitle: string;
  family: string;
  bottleColor: string;
  bottleGradient: string;
  wrapperColor: string;
  accentColor: string;
  tagline: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  vibe: string;
  price: string;
  rating: string;
  awards: string;
}

const PERFUMES: Perfume[] = [
  {
    id: 'sweet-tooth-original',
    name: 'Sweet Tooth (The OG Lemon Bar)',
    subtitle: 'The Original & Most Famous Eau de Parfum',
    family: 'Lemon Bar Gourmand',
    bottleColor: '#f472b6',
    bottleGradient: 'from-pink-300 via-pink-400 to-rose-400',
    wrapperColor: 'from-amber-200 via-yellow-100 to-amber-300',
    accentColor: '#ec4899',
    tagline: 'The iconic OG Lemon Bar scent—sparkling candied lemon zest, buttery shortbread crust & marshmallow cream.',
    topNotes: ['Candied Lemon Zest', 'Lemon Bar Shortbread Crust', 'Sugared Ginger', 'Sparkling Bergamot'],
    heartNotes: ['Chocolate Marshmallow', 'Coconut Milk', 'Madagascar Vanilla Orchid', 'Jasmine Petals'],
    baseNotes: ['Vanilla Chantilly Cream', 'Golden Honeycomb', 'Fluffy Sugared Musk', 'Cashmere Wood'],
    vibe: 'Sabrina\'s most famous signature fragrance: luscious lemon bar dessert with whipped marshmallow and sweet buttery crunch.',
    price: '$49.99 (75ml EDP)',
    rating: '5.0 ★ (25,000+ reviews)',
    awards: 'Fragrance Foundation Award & Global Fan Favorite'
  },
  {
    id: 'caramel-dream',
    name: 'Sweet Tooth: Caramel Dream',
    subtitle: 'Eau de Parfum',
    family: 'Warm & Spicy Amber Gourmand',
    bottleColor: '#d97706',
    bottleGradient: 'from-amber-600 via-yellow-700 to-stone-900',
    wrapperColor: 'from-amber-400 via-amber-200 to-yellow-600',
    accentColor: '#f59e0b',
    tagline: 'Sophisticated, rich, and dripping with decadent caramelized amber.',
    topNotes: ['Sugared Lemon', 'Orange Zest', 'Almond Milk', 'Freesia'],
    heartNotes: ['Dark Chocolate', 'Vanilla Orchid', 'Orange Blossom'],
    baseNotes: ['Caramelized Amber', 'Patchouli', 'Sandalwood', 'Fluffy Musk'],
    vibe: 'Sensual, sultry, nocturnal, and unapologetically rich.',
    price: '$49.99 (75ml EDP)',
    rating: '4.9 ★ (9,800+ reviews)',
    awards: 'Best Gourmand Fragrance Award'
  },
  {
    id: 'cherry-baby',
    name: 'Sweet Tooth: Cherry Baby',
    subtitle: 'Eau de Parfum',
    family: 'Fruity Floral Gourmand',
    bottleColor: '#e11d48',
    bottleGradient: 'from-rose-600 via-red-800 to-rose-950',
    wrapperColor: 'from-rose-300 via-pink-100 to-rose-400',
    accentColor: '#f43f5e',
    tagline: 'Glazed cherries, dark chocolate, and red poppy floral seduction.',
    topNotes: ['Cosmos Cherry', 'Glazed Apple', 'Plum Nectar', 'Brown Sugar'],
    heartNotes: ['Red Poppy', 'Peony Blossom', 'Dark Chocolate Drizzle'],
    baseNotes: ['Vanilla Orchid', 'Cashmere Wood', 'Sensual Amber', 'Patchouli'],
    vibe: 'Flirty, bold, tempting, and addictive like a candy cherry kiss.',
    price: '$49.99 (75ml EDP)',
    rating: '5.0 ★ (15,200+ reviews)',
    awards: 'TikTok Viral Fragrance of the Year'
  },
  {
    id: 'me-espresso',
    name: 'Me Espresso Eau de Parfum',
    subtitle: 'Special Edition Flacon',
    family: 'Caffeinated Warm Amber',
    bottleColor: '#78350f',
    bottleGradient: 'from-amber-900 via-stone-900 to-neutral-950',
    wrapperColor: 'from-yellow-200 via-amber-300 to-amber-500',
    accentColor: '#d97706',
    tagline: 'Wake up, stay rent-free in their mind, and smell like luxury espresso.',
    topNotes: ['Roasted Dark Espresso', 'Brown Sugar Foam', 'Caramel Drizzle'],
    heartNotes: ['Velvet Cocoa Butter', 'Toasted Hazelnut', 'Tonka Bean'],
    baseNotes: ['Golden Honeycomb', 'Bourbon Vanilla', 'Warm Cedar'],
    vibe: 'Energizing, stylish, irresistible, and 100% Short n\' Sweet.',
    price: '$52.00 (75ml EDP)',
    rating: '4.9 ★ (8,100+ reviews)',
    awards: 'Sold out globally in 3 minutes'
  }
];

export const PerfumeLounge: React.FC<PerfumeLoungeProps> = ({ onBack }) => {
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume>(PERFUMES[0]);
  const [isSpritzing, setIsSpritzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'collection' | 'layering' | 'quiz'>('collection');

  // Layering Mixer State
  const [layerBase, setLayerBase] = useState<Perfume>(PERFUMES[0]);
  const [layerTop, setLayerTop] = useState<Perfume>(PERFUMES[2]);

  // Scent Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<Perfume | null>(null);

  const handleSpritz = (e: React.MouseEvent) => {
    setIsSpritzing(true);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    confetti({
      particleCount: 45,
      spread: 70,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: [selectedPerfume.accentColor, '#ffffff', '#ffd1dc', '#fef08a']
    });

    setTimeout(() => setIsSpritzing(false), 1200);
  };

  const handleQuizOption = (perfumeId: string) => {
    const newAnswers = [...quizAnswers, perfumeId];
    setQuizAnswers(newAnswers);

    if (quizStep < 2) {
      setQuizStep(prev => prev + 1);
    } else {
      const match = PERFUMES.find(p => p.id === perfumeId) || PERFUMES[0];
      setQuizResult(match);
      setSelectedPerfume(match);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
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
            onClick={() => setActiveTab('collection')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'collection' ? 'bg-pink-600 text-white shadow-md' : 'text-espresso-300 hover:text-pink-200'
            }`}
          >
            🍫 Sweet Tooth Vault
          </button>
          <button
            onClick={() => setActiveTab('layering')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'layering' ? 'bg-pink-600 text-white shadow-md' : 'text-espresso-300 hover:text-pink-200'
            }`}
          >
            🧪 Scent Layering
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'quiz' ? 'bg-pink-600 text-white shadow-md' : 'text-espresso-300 hover:text-pink-200'
            }`}
          >
            ✨ Find Your Fragrance
          </button>
        </div>
      </div>

      {/* Main Tab 1: Collection View */}
      {activeTab === 'collection' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Authentic Chocolate Bar Bottle 3D Presentation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#24130b] to-[#140a06] border-2 border-pink-500/40 p-8 sm:p-12 shadow-2xl overflow-hidden flex flex-col items-center text-center">
              {/* Glow Behind Bottle */}
              <div 
                className="absolute w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
                style={{ backgroundColor: selectedPerfume.accentColor }}
              />

              {/* Authentic Sweet Tooth Chocolate Bar Bottle with Bite Mark & Foil Sleeve */}
              <div className="relative z-10 my-4 transform transition-all duration-500 hover:scale-105">
                {/* Gold Spray Atomizer Nozzle */}
                <div className="w-14 h-9 mx-auto rounded-t-lg bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 border-2 border-amber-500/80 shadow-md flex items-center justify-center relative">
                  <div className="w-3.5 h-2 rounded-full bg-stone-900 border border-amber-300" />
                  <div className="absolute -top-1.5 w-6 h-1.5 bg-amber-400 rounded-t" />
                </div>

                {/* Chocolate Bar Bottle Body */}
                <div className="relative w-56 sm:w-64 h-80">
                  {/* Beveled Chocolate Bar Shell */}
                  <div className={`w-full h-full rounded-2xl p-4 bg-gradient-to-br ${selectedPerfume.bottleGradient} border-2 border-white/30 shadow-2xl flex flex-col justify-between relative overflow-hidden`}>
                    
                    {/* Iconic Corner Bite Mark in Top Right Corner */}
                    <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-[#1e0f08] border-2 border-black/30 shadow-inner" />
                    <div className="absolute top-1 right-2 w-8 h-8 rounded-full bg-[#1e0f08] border-2 border-black/20" />

                    {/* Chocolate Bar Beveled Grid Squares */}
                    <div className="grid grid-cols-2 gap-3 flex-1 pt-1 z-10">
                      {/* Segment 1 */}
                      <div className="rounded-xl bg-white/10 border-t border-l border-white/30 border-b-2 border-r-2 border-black/30 shadow-inner p-2 flex flex-col items-center justify-center">
                        <span className="font-serif font-extrabold text-sm text-white/90 drop-shadow">SC</span>
                        <span className="text-[8px] font-mono text-white/70 uppercase">SWEET</span>
                      </div>
                      {/* Segment 2 */}
                      <div className="rounded-xl bg-white/10 border-t border-l border-white/30 border-b-2 border-r-2 border-black/30 shadow-inner p-2 flex flex-col items-center justify-center">
                        <span className="text-base drop-shadow">💋</span>
                      </div>
                      {/* Segment 3 */}
                      <div className="rounded-xl bg-white/10 border-t border-l border-white/30 border-b-2 border-r-2 border-black/30 shadow-inner p-2 flex flex-col items-center justify-center">
                        <span className="text-xs font-serif font-bold text-white/80">TOOTH</span>
                      </div>
                      {/* Segment 4 */}
                      <div className="rounded-xl bg-white/10 border-t border-l border-white/30 border-b-2 border-r-2 border-black/30 shadow-inner p-2 flex flex-col items-center justify-center">
                        <span className="text-base drop-shadow">✨</span>
                      </div>
                    </div>

                    {/* Metallic Foil Wrapper Base Sleeve */}
                    <div className={`mt-3 rounded-xl p-3 bg-gradient-to-r ${selectedPerfume.wrapperColor} shadow-lg border border-white/50 text-center relative z-20`}>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-stone-900 font-extrabold block">
                        Sabrina Carpenter
                      </span>
                      <h4 className="text-xs sm:text-sm font-serif font-extrabold text-stone-900 leading-tight">
                        {selectedPerfume.name}
                      </h4>
                      <span className="text-[8px] font-mono text-stone-800 uppercase block mt-0.5">
                        Eau de Parfum • 75 ml / 2.5 fl. oz.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spritz Atomizer Button */}
              <button
                onClick={handleSpritz}
                disabled={isSpritzing}
                className="relative z-10 mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white font-serif font-bold text-sm shadow-diner-pink transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2.5"
              >
                <Droplets className="w-4 h-4 animate-bounce" />
                {isSpritzing ? 'Spritzing Fragrance Mist ✨...' : `Spritz ${selectedPerfume.name} 💨`}
              </button>

              <p className="relative z-10 text-[11px] font-mono text-espresso-400 mt-3">
                {selectedPerfume.awards}
              </p>
            </div>

            {/* Fragrance Bottle Selector Carousel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PERFUMES.map((perfume) => (
                <button
                  key={perfume.id}
                  onClick={() => setSelectedPerfume(perfume)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedPerfume.id === perfume.id
                      ? 'bg-pink-600/20 border-pink-500 text-white shadow-md scale-105'
                      : 'bg-espresso-950/80 border-espresso-800 text-espresso-300 hover:border-espresso-700'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-2 border border-white/30 shadow-sm"
                    style={{ backgroundColor: perfume.bottleColor }}
                  />
                  <div className="text-xs font-serif font-bold truncate">{perfume.name}</div>
                  <div className="text-[10px] font-mono text-espresso-400 mt-0.5">{perfume.family.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Detailed Notes Pyramid & Ingredients Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-[#1f1009] border border-espresso-800 p-6 sm:p-8 shadow-xl space-y-6">
              {/* Title & Tagline */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    {selectedPerfume.family}
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {selectedPerfume.rating}
                  </span>
                </div>

                <h3 className="text-3xl font-serif font-extrabold text-white">
                  {selectedPerfume.name}
                </h3>
                <p className="text-sm font-sans italic text-pink-200/90 mt-1">
                  "{selectedPerfume.tagline}"
                </p>
              </div>

              {/* Fragrance Pyramid (Top, Heart, Base) */}
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-espresso-400 font-bold block">
                  Olfactory Notes Pyramid
                </span>

                {/* Top Notes */}
                <div className="p-4 rounded-2xl bg-espresso-950/90 border border-espresso-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-pink-400 font-bold">
                    <span>🌟 TOP NOTES (FIRST 15 MINS)</span>
                    <span className="text-[10px] text-espresso-400">Sparkling Impression</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPerfume.topNotes.map((note, i) => (
                      <span key={i} className="text-xs font-serif px-2.5 py-1 rounded-lg bg-[#2f1810] text-pink-100 border border-pink-500/20">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Heart Notes */}
                <div className="p-4 rounded-2xl bg-espresso-950/90 border border-espresso-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-rose-400 font-bold">
                    <span>💖 HEART NOTES (2 - 4 HOURS)</span>
                    <span className="text-[10px] text-espresso-400">The Soul</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPerfume.heartNotes.map((note, i) => (
                      <span key={i} className="text-xs font-serif px-2.5 py-1 rounded-lg bg-[#2f1810] text-rose-100 border border-rose-500/20">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Base Notes */}
                <div className="p-4 rounded-2xl bg-espresso-950/90 border border-espresso-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                    <span>🪵 BASE NOTES (6+ HOURS)</span>
                    <span className="text-[10px] text-espresso-400">Lingering Trail</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPerfume.baseNotes.map((note, i) => (
                      <span key={i} className="text-xs font-serif px-2.5 py-1 rounded-lg bg-[#2f1810] text-amber-100 border border-amber-500/20">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vibe Summary */}
              <div className="p-4 rounded-2xl bg-[#2a160d] border border-espresso-700/60 text-xs font-sans text-espresso-200 leading-relaxed">
                <span className="font-bold text-pink-300 block mb-1">Sabrina's Scent Profile:</span>
                {selectedPerfume.vibe}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Scent Layering Studio */}
      {activeTab === 'layering' && (
        <div className="max-w-3xl mx-auto bg-[#1f1009] border border-espresso-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
              Sabrina's Signature Scent Layering
            </h3>
            <p className="text-xs text-espresso-300 mt-1">
              Mix two Sweet Tooth perfumes to create your personalized haute couture gourmand signature.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {/* Base Perfume */}
            <div className="p-4 rounded-2xl bg-espresso-950 border border-espresso-800 space-y-2">
              <label className="text-xs font-mono text-pink-400 font-bold block">1. BASE LAYER (HEAVY NOTES):</label>
              <select
                value={layerBase.id}
                onChange={(e) => {
                  const match = PERFUMES.find(p => p.id === e.target.value);
                  if (match) setLayerBase(match);
                }}
                className="w-full p-2.5 rounded-xl bg-[#28140c] border border-espresso-700 text-xs font-serif text-white focus:outline-none focus:border-pink-500"
              >
                {PERFUMES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Top Perfume */}
            <div className="p-4 rounded-2xl bg-espresso-950 border border-espresso-800 space-y-2">
              <label className="text-xs font-mono text-rose-400 font-bold block">2. TOP SPRITZ (SWEET ACCENT):</label>
              <select
                value={layerTop.id}
                onChange={(e) => {
                  const match = PERFUMES.find(p => p.id === e.target.value);
                  if (match) setLayerTop(match);
                }}
                className="w-full p-2.5 rounded-xl bg-[#28140c] border border-espresso-700 text-xs font-serif text-white focus:outline-none focus:border-pink-500"
              >
                {PERFUMES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Layered Result Recipe */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-950/40 via-amber-950/40 to-rose-950/40 border-2 border-pink-500/40 text-center space-y-3">
            <span className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
              ✨ Layering Alchemy Recipe
            </span>
            <h4 className="text-xl sm:text-2xl font-serif font-bold text-white">
              "{layerBase.name.replace('Sweet Tooth: ', '')} & {layerTop.name.replace('Sweet Tooth: ', '')} Couture Duo"
            </h4>
            <p className="text-xs font-sans text-pink-100/90 max-w-lg mx-auto leading-relaxed">
              Spritz 2 sprays of <strong className="text-white">{layerBase.name}</strong> on your wrists, then layer with 1 spritz of <strong className="text-white">{layerTop.name}</strong> behind your ears. This creates a mesmerizing contrast between {layerBase.baseNotes[0]} and {layerTop.topNotes[0]}.
            </p>
            <button
              onClick={handleSpritz}
              className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs font-bold transition-all shadow-md mt-2"
            >
              Test Layered Spritz 💨
            </button>
          </div>
        </div>
      )}

      {/* Main Tab 3: Fragrance Finder Quiz */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto bg-[#1f1009] border border-espresso-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          {!quizResult ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-pink-400 font-bold uppercase tracking-wider">
                  Question {quizStep + 1} of 3
                </span>
                <span className="text-xs font-mono text-espresso-400">
                  Sweet Tooth Scent Finder 🍫
                </span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mb-6">
                {quizStep === 0 && "What scent family makes you feel most confident?"}
                {quizStep === 1 && "What is your dream night out aesthetic?"}
                {quizStep === 2 && "Which Sabrina Carpenter song is your mood anthem?"}
              </h3>

              <div className="space-y-3">
                {quizStep === 0 && [
                  { label: "OG Lemon bar shortbread crust, candied lemon zest & fluffy marshmallow", id: 'sweet-tooth-original' },
                  { label: "Caramelized amber, dark chocolate & warm sandalwood", id: 'caramel-dream' },
                  { label: "Glazed cherries, red poppy & ruby plum nectar", id: 'cherry-baby' },
                  { label: "Freshly brewed dark espresso with brown sugar foam", id: 'me-espresso' }
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizOption(opt.id)}
                    className="w-full text-left p-4 rounded-2xl bg-espresso-950 border border-espresso-800 hover:border-pink-500 text-xs font-serif text-pink-100 transition-all flex items-center justify-between group"
                  >
                    <span>{opt.label}</span>
                    <Sparkles className="w-4 h-4 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}

                {quizStep === 1 && [
                  { label: "Cozy movie night wearing oversized pink cashmere sweaters", id: 'sweet-tooth-original' },
                  { label: "Candlelit romantic dinner in London with a cute boy in a jacket", id: 'caramel-dream' },
                  { label: "Glamorous red carpet party with bold cherry lipstick", id: 'cherry-baby' },
                  { label: "Breezy summer rooftop bar dancing until sunrise", id: 'me-espresso' }
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizOption(opt.id)}
                    className="w-full text-left p-4 rounded-2xl bg-espresso-950 border border-espresso-800 hover:border-pink-500 text-xs font-serif text-pink-100 transition-all flex items-center justify-between group"
                  >
                    <span>{opt.label}</span>
                    <Sparkles className="w-4 h-4 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}

                {quizStep === 2 && [
                  { label: "\"Manchild\" / \"Please Please Please\" / \"Feather\"", id: 'sweet-tooth-original' },
                  { label: "\"Bed Chem\" / \"My Man on Willpower\" / \"Sugar Talking\"", id: 'caramel-dream' },
                  { label: "\"Taste\" / \"When Did You Get Hot?\" / \"Nonsense\"", id: 'cherry-baby' },
                  { label: "\"Espresso\" / \"Go Go Juice\" / \"Good Graces\"", id: 'me-espresso' }
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizOption(opt.id)}
                    className="w-full text-left p-4 rounded-2xl bg-espresso-950 border border-espresso-800 hover:border-pink-500 text-xs font-serif text-pink-100 transition-all flex items-center justify-between group"
                  >
                    <span>{opt.label}</span>
                    <Sparkles className="w-4 h-4 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-500 text-pink-400 flex items-center justify-center mx-auto text-3xl shadow-glow-pink">
                🍫
              </div>

              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                  Your Signature Sweet Tooth Perfume
                </span>
                <h3 className="text-3xl font-serif font-extrabold text-white mt-1">
                  {quizResult.name}
                </h3>
                <p className="text-xs font-sans italic text-pink-200 mt-2 max-w-md mx-auto">
                  "{quizResult.tagline}"
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-espresso-950 border border-espresso-800 text-xs font-mono text-espresso-300 max-w-sm mx-auto space-y-1">
                <div><span className="text-pink-400">Fragrance Family:</span> {quizResult.family}</div>
                <div><span className="text-amber-400">Key Note:</span> {quizResult.topNotes[0]}</div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={resetQuiz}
                  className="px-4 py-2 rounded-xl bg-espresso-900 border border-espresso-700 text-xs font-mono text-espresso-300 hover:text-white"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => {
                    setSelectedPerfume(quizResult);
                    setActiveTab('collection');
                  }}
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs font-bold"
                >
                  View Bottle in 3D 🍫
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
