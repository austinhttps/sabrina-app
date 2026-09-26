import React, { useState, useRef, useEffect } from 'react';
import { 
  Coffee, 
  Sparkles, 
  Heart, 
  Download, 
  Share2, 
  HelpCircle, 
  Plus, 
  Check, 
  RotateCcw, 
  Flame, 
  Music,
  ShoppingBag,
  CupSoda
} from 'lucide-react';
import confetti from 'canvas-confetti';
import cafeData from '../data/cafeMenu.json';
import { audioSynth } from '../utils/audioSynth.ts';
import { drawReceiptToCanvas, ReceiptData } from '../utils/receiptGenerator.ts';

interface DinerCafeProps {
  onBack: () => void;
}

export const DinerCafe: React.FC<DinerCafeProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'quiz' | 'custom'>('menu');
  const [customerName, setCustomerName] = useState('Superfan');

  // Custom Drink Builder State
  const [selectedBase, setSelectedBase] = useState(cafeData.customBuilder.bases[0]);
  const [selectedMilk, setSelectedMilk] = useState(cafeData.customBuilder.milks[3]); // Pink cold foam
  const [selectedSweetness, setSelectedSweetness] = useState(cafeData.customBuilder.sweetness[1]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['glitter', 'cherry']);
  const [selectedSyrup, setSelectedSyrup] = useState(cafeData.customBuilder.syrups[0]);

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResultDrink, setQuizResultDrink] = useState<any | null>(null);

  // Receipt Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [receiptImageSrc, setReceiptImageSrc] = useState<string>('');
  const [currentReceiptData, setCurrentReceiptData] = useState<ReceiptData | null>(null);
  const [isBrewing, setIsBrewing] = useState(false);

  // Generate initial receipt on mount
  useEffect(() => {
    generateAndRenderReceipt({
      orderNumber: `${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || 'Special Guest',
      table: '04 (Short n\' Sweet Booth)',
      serverName: 'Sabrina C. 💋',
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      items: [
        {
          name: 'Short n\' Sweet Espresso Double',
          price: '$5.25',
          mods: ['Pink Sweet Cream Cold Foam', 'Edible Shimmer Dust ✨']
        }
      ],
      subtotal: '$5.25',
      tax: '$0.42',
      total: '$5.67',
      baristaNote: "Say you can't sleep, baby I know. That's that me, espresso.",
      vibeScore: '100% Caffeinated',
      pairedTrack: 'Espresso'
    });
  }, []);

  const generateAndRenderReceipt = (data: ReceiptData) => {
    setCurrentReceiptData(data);
    if (canvasRef.current) {
      const dataUrl = drawReceiptToCanvas(canvasRef.current, data);
      setReceiptImageSrc(dataUrl);
    }
  };

  const handleOrderSignatureDrink = (drink: any) => {
    audioSynth.playDinerBell();
    setIsBrewing(true);
    audioSynth.playSteamHiss(1.2);

    setTimeout(() => {
      const priceNum = parseFloat(drink.price.replace('$', ''));
      const tax = (priceNum * 0.08).toFixed(2);
      const total = (priceNum + parseFloat(tax)).toFixed(2);

      const notes = cafeData.baristaNotes;
      const randomNote = notes[Math.floor(Math.random() * notes.length)];

      const data: ReceiptData = {
        orderNumber: `${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customerName || 'Special Guest',
        table: 'Booth 07 (Penthouse)',
        serverName: 'Sabrina C. 💋',
        dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        items: [
          {
            name: drink.name,
            price: drink.price,
            mods: drink.flavorNotes
          }
        ],
        subtotal: drink.price,
        tax: `$${tax}`,
        total: `$${total}`,
        baristaNote: drink.quote || randomNote,
        vibeScore: drink.sweetness,
        pairedTrack: drink.pairedTrack
      };

      generateAndRenderReceipt(data);
      setIsBrewing(false);

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff4d8d', '#f43f5e', '#fbbf24']
      });
    }, 800);
  };

  const handleCustomBrew = () => {
    audioSynth.playDinerBell();
    setIsBrewing(true);
    audioSynth.playSteamHiss(1.5);

    setTimeout(() => {
      let subtotalNum = selectedBase.price + selectedMilk.price;
      const mods: string[] = [
        selectedMilk.name,
        selectedSweetness.name,
        `Syrup: ${selectedSyrup.name}`
      ];

      selectedToppings.forEach((topId) => {
        const topObj = cafeData.customBuilder.toppings.find(t => t.id === topId);
        if (topObj) {
          subtotalNum += topObj.price;
          mods.push(topObj.name);
        }
      });

      const taxNum = subtotalNum * 0.08;
      const totalNum = subtotalNum + taxNum;

      const randomNotes = cafeData.baristaNotes;
      const baristaNote = randomNotes[Math.floor(Math.random() * randomNotes.length)];

      const data: ReceiptData = {
        orderNumber: `${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customerName || 'VIP Guest',
        table: 'Table 01 (Bar Top)',
        serverName: 'Sabrina C. 💋',
        dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        items: [
          {
            name: `Custom ${selectedBase.name}`,
            price: `$${subtotalNum.toFixed(2)}`,
            mods: mods
          }
        ],
        subtotal: `$${subtotalNum.toFixed(2)}`,
        tax: `$${taxNum.toFixed(2)}`,
        total: `$${totalNum.toFixed(2)}`,
        baristaNote: baristaNote,
        vibeScore: selectedSweetness.name,
        pairedTrack: 'Bed Chem'
      };

      generateAndRenderReceipt(data);
      setIsBrewing(false);

      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 900);
  };

  const toggleTopping = (toppingId: string) => {
    audioSynth.playKissPop();
    setSelectedToppings(prev => 
      prev.includes(toppingId) ? prev.filter(t => t !== toppingId) : [...prev, toppingId]
    );
  };

  const handleQuizAnswer = (questionId: string, drinkId: string) => {
    audioSynth.playCassetteClick('press');
    const newAnswers = { ...quizAnswers, [questionId]: drinkId };
    setQuizAnswers(newAnswers);

    if (quizStep < cafeData.quizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // Tally winner
      const counts: Record<string, number> = {};
      Object.values(newAnswers).forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });
      const winningDrinkId = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'espresso-double');
      const winningDrink = cafeData.drinks.find(d => d.id === winningDrinkId) || cafeData.drinks[0];
      setQuizResultDrink(winningDrink);
      handleOrderSignatureDrink(winningDrink);
    }
  };

  const restartQuiz = () => {
    audioSynth.playSparkle();
    setQuizStep(0);
    setQuizAnswers({});
    setQuizResultDrink(null);
  };

  const downloadReceiptImage = () => {
    if (!receiptImageSrc) return;
    audioSynth.playSparkle();
    const link = document.createElement('a');
    link.download = `sabrina_espresso_receipt_${Date.now()}.png`;
    link.href = receiptImageSrc;
    link.click();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Hidden Canvas for High-Resolution Drawing */}
      <canvas ref={canvasRef} className="hidden" />

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
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'menu' ? 'bg-amber-600 text-white shadow-md' : 'text-espresso-300 hover:text-amber-200'
            }`}
          >
            📋 Diner Menu
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'quiz' ? 'bg-amber-600 text-white shadow-md' : 'text-espresso-300 hover:text-amber-200'
            }`}
          >
            🔮 Personality Quiz
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'custom' ? 'bg-amber-600 text-white shadow-md' : 'text-espresso-300 hover:text-amber-200'
            }`}
          >
            ☕ Custom Brew
          </button>
        </div>
      </div>

      {/* Main Grid: Left Interactions, Right Live Canvas Receipt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Mode Panels */}
        <div className="lg:col-span-7 space-y-6">
          {/* Guest Name Bar */}
          <div className="bg-[#1f110a] border border-espresso-800 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">☕</span>
              <div>
                <span className="text-[10px] font-mono text-espresso-400 uppercase font-bold block">
                  Table Guest Name:
                </span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Name..."
                  className="bg-transparent border-b border-espresso-700 focus:border-amber-500 font-serif font-bold text-white text-base focus:outline-none"
                />
              </div>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/80">
              Table 04 • Short n' Sweet
            </span>
          </div>

          {/* Mode 1: Signature Diner Menu */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">Sabrina's Signature Beverages</h2>
                  <p className="text-xs text-espresso-300">
                    Hand-crafted pop specialties paired with Short n' Sweet tracks.
                  </p>
                </div>
                <span className="text-xs font-mono text-pink-400">6 Specialty Drinks</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cafeData.drinks.map((drink) => (
                  <div
                    key={drink.id}
                    className="p-5 rounded-3xl bg-[#201009] border border-espresso-800 hover:border-amber-500/60 transition-all shadow-md flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {drink.category}
                        </span>
                        <span className="text-sm font-mono font-bold text-amber-400">
                          {drink.price}
                        </span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-white group-hover:text-pink-200 transition-colors">
                        {drink.name}
                      </h3>
                      <p className="text-xs font-sans text-espresso-200/80 mt-1 italic">
                        "{drink.tagline}"
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {drink.flavorNotes.map((fn, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-espresso-950 text-espresso-300">
                            {fn}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-espresso-800/80 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-pink-400">
                        🎶 {drink.pairedTrack}
                      </span>
                      <button
                        onClick={() => handleOrderSignatureDrink(drink)}
                        disabled={isBrewing}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-mono text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                      >
                        Order & Print ☕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode 2: Personality Drink Quiz */}
          {activeTab === 'quiz' && (
            <div className="bg-[#201009] border border-espresso-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              {!quizResultDrink ? (
                <div>
                  {/* Progress Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-pink-400 font-bold uppercase tracking-wider">
                      Question {quizStep + 1} of {cafeData.quizQuestions.length}
                    </span>
                    <span className="text-xs font-mono text-espresso-400">
                      Match Your Sabrina Beverage 🔮
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-espresso-900 rounded-full h-1.5 mb-6">
                    <div 
                      className="bg-pink-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${((quizStep + 1) / cafeData.quizQuestions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Title */}
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-6">
                    {cafeData.quizQuestions[quizStep].question}
                  </h3>

                  {/* Options List */}
                  <div className="space-y-3">
                    {cafeData.quizQuestions[quizStep].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(cafeData.quizQuestions[quizStep].id, opt.drinkId)}
                        className="w-full text-left p-4 rounded-2xl bg-espresso-950/80 border border-espresso-800/80 hover:border-pink-500 hover:bg-espresso-900 transition-all font-sans text-sm text-pink-50 flex items-center justify-between group"
                      >
                        <span>{opt.text}</span>
                        <Sparkles className="w-4 h-4 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Quiz Winner Screen */
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-500 text-pink-400 flex items-center justify-center mx-auto text-2xl shadow-glow-pink">
                    ☕
                  </div>

                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                      Your Sabrina Signature Match
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-white mt-1">
                      {quizResultDrink.name}
                    </h3>
                    <p className="text-sm font-sans italic text-pink-200 mt-2 max-w-md mx-auto">
                      "{quizResultDrink.tagline}"
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-espresso-950/90 border border-espresso-800 max-w-sm mx-auto text-left space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-espresso-400">Sweetness:</span>
                      <span className="text-pink-300 font-bold">{quizResultDrink.sweetness}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-espresso-400">Paired Track:</span>
                      <span className="text-amber-300 font-bold">{quizResultDrink.pairedTrack}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={restartQuiz}
                      className="px-4 py-2.5 rounded-xl bg-espresso-900 border border-espresso-700 text-xs font-mono text-espresso-200 hover:text-white flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Retake Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Custom Drink Builder */}
          {activeTab === 'custom' && (
            <div className="bg-[#201009] border border-espresso-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white">Custom Barista Bar</h2>
                <p className="text-xs text-espresso-300 mt-0.5">
                  Mix and match bases, milks, syrups, and edible glitter toppings.
                </p>
              </div>

              {/* Base Picker */}
              <div>
                <label className="block text-xs font-mono text-espresso-300 font-semibold mb-2">
                  1. SELECT COFFEE / BEVERAGE BASE:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {cafeData.customBuilder.bases.map((base) => (
                    <button
                      key={base.id}
                      onClick={() => { audioSynth.playKissPop(); setSelectedBase(base); }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedBase.id === base.id
                          ? 'bg-amber-600/30 border-amber-500 text-amber-200 shadow-md'
                          : 'bg-espresso-950/80 border-espresso-800 text-espresso-300 hover:border-espresso-700'
                      }`}
                    >
                      <div className="text-base mb-1">{base.icon}</div>
                      <div className="text-xs font-bold font-serif text-white">{base.name}</div>
                      <div className="text-[10px] font-mono text-amber-400 mt-0.5">${base.price.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk Picker */}
              <div>
                <label className="block text-xs font-mono text-espresso-300 font-semibold mb-2">
                  2. SELECT MILK & COLD FOAM:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {cafeData.customBuilder.milks.map((milk) => (
                    <button
                      key={milk.id}
                      onClick={() => { audioSynth.playKissPop(); setSelectedMilk(milk); }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedMilk.id === milk.id
                          ? 'bg-pink-600/30 border-pink-500 text-pink-200 shadow-md'
                          : 'bg-espresso-950/80 border-espresso-800 text-espresso-300 hover:border-espresso-700'
                      }`}
                    >
                      <div className="text-xs font-medium text-white">{milk.name}</div>
                      <div className="text-[10px] font-mono text-pink-400 mt-0.5">+${milk.price.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweetness & Syrup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-espresso-300 font-semibold mb-2">
                    3. SWEETNESS LEVEL:
                  </label>
                  <select
                    value={selectedSweetness.id}
                    onChange={(e) => {
                      const sw = cafeData.customBuilder.sweetness.find(s => s.id === e.target.value);
                      if (sw) setSelectedSweetness(sw);
                    }}
                    className="w-full p-2.5 rounded-xl bg-espresso-950 border border-espresso-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  >
                    {cafeData.customBuilder.sweetness.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-espresso-300 font-semibold mb-2">
                    4. SECRET FLAVOR SYRUP:
                  </label>
                  <select
                    value={selectedSyrup.id}
                    onChange={(e) => {
                      const sy = cafeData.customBuilder.syrups.find(s => s.id === e.target.value);
                      if (sy) setSelectedSyrup(sy);
                    }}
                    className="w-full p-2.5 rounded-xl bg-espresso-950 border border-espresso-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  >
                    {cafeData.customBuilder.syrups.map((sy) => (
                      <option key={sy.id} value={sy.id}>{sy.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toppings Multi-select */}
              <div>
                <label className="block text-xs font-mono text-espresso-300 font-semibold mb-2">
                  5. LUXURY TOPPINGS (SELECT ALL THAT APPLY):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {cafeData.customBuilder.toppings.map((top) => {
                    const isSelected = selectedToppings.includes(top.id);
                    return (
                      <button
                        key={top.id}
                        onClick={() => toggleTopping(top.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-600/30 border-rose-500 text-rose-100 shadow-md'
                            : 'bg-espresso-950/80 border-espresso-800 text-espresso-400'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-medium text-white">{top.name}</div>
                          <div className="text-[10px] font-mono text-rose-400">+${top.price.toFixed(2)}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brew Action Button */}
              <button
                onClick={handleCustomBrew}
                disabled={isBrewing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-pink-600 hover:from-amber-500 hover:to-pink-500 text-white font-serif font-bold text-sm shadow-diner-pink transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Coffee className="w-4 h-4" />
                {isBrewing ? 'Brewing Espresso & Printing Receipt...' : 'Brew Custom Drink & Print Receipt 🧾'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Thermal Paper Receipt Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Thermal Paper Receipt
            </span>
            <button
              onClick={downloadReceiptImage}
              className="px-3 py-1 rounded-xl bg-espresso-900 border border-espresso-700 hover:border-pink-500 text-pink-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PNG
            </button>
          </div>

          {/* Receipt Wrapper Container */}
          <div className="relative rounded-3xl p-4 bg-[#140a06] border-2 border-espresso-800 shadow-2xl flex flex-col items-center">
            {receiptImageSrc ? (
              <img
                src={receiptImageSrc}
                alt="Sabrina's Espresso Diner Thermal Receipt"
                className="w-full max-w-[360px] rounded-lg shadow-2xl filter drop-shadow-xl transition-all duration-300 hover:scale-[1.01]"
              />
            ) : (
              <div className="py-24 text-center text-espresso-500 font-mono text-xs">
                Generating thermal receipt...
              </div>
            )}

            {/* Quick Barista Quote below receipt */}
            <div className="mt-4 text-center text-xs font-mono text-espresso-400">
              Printed on Sabrina Thermal Station 5000 • 100% Recycled Sass 💋
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
