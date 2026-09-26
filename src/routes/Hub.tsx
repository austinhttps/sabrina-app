import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mic2, 
  Mail, 
  Coffee, 
  Compass, 
  CassetteTape, 
  Heart, 
  ArrowRight, 
  Flame, 
  Music, 
  Disc3,
  Award,
  Radio,
  Star,
  Sparkle,
  Droplets
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioSynth } from '../utils/audioSynth.ts';

interface HubProps {
  onNavigate: (route: string) => void;
}

const ALL_FORTUNES = [
  "\"They say that diamonds are a girl's best friend... till I walk away and never call again.\" 🐾 (Man's Best Friend)",
  "\"Say you can't sleep, baby I know. That's that me, espresso.\" ☕ (Espresso)",
  "\"Heartbreak is one thing, my ego's another. I beg you, don't embarrass me, motherf***er!\" 💄 (Please Please Please)",
  "\"Now I hear you're back together and if that's true... you'll just have to taste me when he's kissin' you!\" 🍒 (Taste)",
  "\"Who's the cute boy with the white jacket and the thick accent?\" ✨ (Bed Chem)",
  "\"One of me is cute, but two though? Might make me Juno!\" 🍼 (Juno)",
  "\"I feel so much lighter like a feather with you off my mind.\" 🪶 (Feather)",
  "\"I'm five feet tall but got a giant stature.\" 💅 (Nonsense)",
  "\"You were cruel in private, but I kept your vintage sweater anyway.\" 💌 (emails i can't send)",
  "\"Good graces rule number one: Don't text him back, drink your espresso instead.\" ☕ (Good Graces)",
  "\"I'm loyal like a puppy, but you're trained on every single heart attack.\" 🐾 (Man's Best Friend)",
  "\"Don't prove 'em right, please please please!\" 💖 (Please Please Please)",
  "\"Tell me why my lipstick looks so good on your white collar?\" 💋 (Nonsense Outro)",
  "\"Give me six seconds and a microphone, and I'll make a whole arena blush.\" 🎤 (Short n' Sweet Live)",
  "\"I got you blocked on everything, now that's a feather.\" 🪶 (Feather)",
  "\"Some people are like cold decaf. You're a double espresso with extra glitter.\" ✨ (Diner Wisdom)",
  "\"I leave quite an impression... five feet to be exact.\" 🍒 (Taste)",
  "\"My love is sweet tooth candy, but don't bite more than you can chew.\" 🍫 (Sweet Tooth)"
];

export const Hub: React.FC<HubProps> = ({ onNavigate }) => {
  // Randomize fortune on every single page load
  const [fortuneIndex, setFortuneIndex] = useState(() => Math.floor(Math.random() * ALL_FORTUNES.length));
  
  // Server-side synchronized kiss counter (starts at 0)
  const [kissCount, setKissCount] = useState<number>(0);
  const [hasKissed, setHasKissed] = useState(false);

  // Fetch live server-side kiss counter
  useEffect(() => {
    // Pick another random fortune to ensure fresh load
    setFortuneIndex(Math.floor(Math.random() * ALL_FORTUNES.length));

    // Try fetching global server-side count
    const fetchGlobalKisses = async () => {
      try {
        const res = await fetch('https://api.counterapi.dev/v1/sabrina-carpenter-universe-kisses-2026/kisses/');
        if (res.ok) {
          const data = await res.json();
          setKissCount(data.count || 0);
        } else {
          // If counter not yet initialized on server, it starts at 0
          const localSaved = localStorage.getItem('sabrina_global_kisses');
          setKissCount(localSaved ? parseInt(localSaved, 10) : 0);
        }
      } catch (err) {
        const localSaved = localStorage.getItem('sabrina_global_kisses');
        setKissCount(localSaved ? parseInt(localSaved, 10) : 0);
      }
    };

    fetchGlobalKisses();
  }, []);

  const handleKissClick = async (e: React.MouseEvent) => {
    setHasKissed(true);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#ff4d8d', '#f43f5e', '#fda4af', '#fef08a']
    });

    // Optimistically update
    setKissCount(prev => {
      const next = prev + 1;
      localStorage.setItem('sabrina_global_kisses', next.toString());
      return next;
    });

    // Send server-side +1 increment
    try {
      const res = await fetch('https://api.counterapi.dev/v1/sabrina-carpenter-universe-kisses-2026/kisses/up');
      if (res.ok) {
        const data = await res.json();
        if (data.count) {
          setKissCount(data.count);
          localStorage.setItem('sabrina_global_kisses', data.count.toString());
        }
      }
    } catch (err) {
      // Fallback already saved in localStorage
    }

    setTimeout(() => setHasKissed(false), 300);
  };

  const nextFortune = () => {
    setFortuneIndex((prev) => {
      let nextIdx = Math.floor(Math.random() * ALL_FORTUNES.length);
      if (nextIdx === prev) nextIdx = (prev + 1) % ALL_FORTUNES.length;
      return nextIdx;
    });
  };

  const handleCardClick = (routeId: string) => {
    onNavigate(routeId);
  };

  const modules = [
    {
      id: 'outro',
      title: 'Nonsense Outro Generator',
      subtitle: 'Cheeky Rhymes & City Beats',
      description: 'Craft personalized live outro verses, test your syllables on the 96 BPM disco bounce, and explore iconic city rhymes.',
      icon: Mic2,
      badge: 'Interactive Beatbox',
      color: 'from-pink-500/20 via-rose-600/10 to-transparent',
      borderColor: 'group-hover:border-rose-400',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      tag: '🔥 80+ Rhyme Combos'
    },
    {
      id: 'webmail',
      title: "emails i can't send Client",
      subtitle: 'Y2K Unsent Letterbox',
      description: 'Browse confidential drafts, decrypt unsent confessions, compose nostalgic letters, and watch them burn into the void.',
      icon: Mail,
      badge: 'Retro Y2K UI',
      color: 'from-sky-500/20 via-blue-600/10 to-transparent',
      borderColor: 'group-hover:border-sky-400',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      tag: '💌 Unsent Vault'
    },
    {
      id: 'diner',
      title: "Espresso Diner & Cafe",
      subtitle: 'Signature Brews & Canvas Receipts',
      description: 'Take the Sabrina order quiz, customize your dream caffeinated beverage, and generate an authentic thermal paper receipt.',
      icon: Coffee,
      badge: 'Canvas Receipt Engine',
      color: 'from-amber-600/20 via-amber-900/10 to-transparent',
      borderColor: 'group-hover:border-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      tag: '☕ 100% Caffeinated'
    },
    {
      id: 'perfume',
      title: 'Sweet Tooth Fragrance Vault',
      subtitle: 'Chocolate Bar Perfume Collection',
      description: 'Explore the iconic Sweet Tooth chocolate bar fragrances (Original, Caramel Dream, Cherry Baby), test olfactory notes, and spritz mist.',
      icon: Droplets,
      badge: 'Chocolate Bottle 3D',
      color: 'from-rose-500/20 via-pink-600/10 to-transparent',
      borderColor: 'group-hover:border-pink-400',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      tag: '🍫 Sweet Tooth Lineup'
    },
    {
      id: 'tour',
      title: 'Short n\' Sweet Tour Archive',
      subtitle: 'Surprise Songs & Outfit Runway',
      description: 'Interactive tour timeline, city surprise song tracker, custom designer outfit vault, Juno arrests, and setlist breakdowns.',
      icon: Compass,
      badge: 'Full Arena Database',
      color: 'from-purple-500/20 via-pink-600/10 to-transparent',
      borderColor: 'group-hover:border-purple-400',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      tag: '✨ 34+ Surprise Songs'
    },
    {
      id: 'cassette',
      title: 'Vintage Boombox Player',
      subtitle: 'Real Audio & Synced Karaoke',
      description: 'Play real Sabrina hits (Short n\' Sweet, Man\'s Best Friend, emails), dual spinning tape reels, tape speed wow & flutter, and live lyrics.',
      icon: CassetteTape,
      badge: 'Real Audio + Synth',
      color: 'from-yellow-500/20 via-amber-600/10 to-transparent',
      borderColor: 'group-hover:border-yellow-400',
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      tag: '📼 Real Songs + Karaoke'
    }
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <header className="relative text-center mb-14 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          Short n' Sweet • Man's Best Friend Era
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
        </div>

        {/* Cursive Header Title & Subtitle */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-cursive font-normal tracking-wide text-white mb-2 drop-shadow-md">
          Sabrina Carpenter
        </h1>

        <div className="text-3xl sm:text-4xl md:text-5xl font-cursive text-pink-300/90 tracking-wider mb-8">
          A Carpenter's Experience
        </div>

        {/* Fortune Cookie & Interactive Kiss Button Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto">
          {/* Quote of the Moment */}
          <div 
            onClick={nextFortune}
            className="flex-1 min-w-[280px] bg-[#22130d]/80 border border-espresso-700/60 hover:border-pink-500/50 rounded-2xl p-3.5 px-5 shadow-lg backdrop-blur-md cursor-pointer transition-all duration-300 group flex items-center justify-between"
          >
            <div className="text-left pr-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-pink-400 font-semibold block mb-0.5">
                💌 Lyric Fortune of the Day (Click to Flip)
              </span>
              <p className="text-sm font-serif italic text-pink-100/90 leading-snug line-clamp-2">
                {ALL_FORTUNES[fortuneIndex]}
              </p>
            </div>
            <Sparkles className="w-4 h-4 text-pink-400 group-hover:rotate-45 transition-transform shrink-0" />
          </div>

          {/* Kiss Counter Stamp (Server-side synced, starts at 0) */}
          <button
            onClick={handleKissClick}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm shadow-diner-pink transition-transform active:scale-95 ${hasKissed ? 'scale-110' : ''}`}
          >
            <span className="text-lg">💋</span>
            <span>Send a Kiss</span>
            <span className="px-2.5 py-0.5 rounded-full bg-black/30 text-xs font-mono font-bold">
              {kissCount.toLocaleString()}
            </span>
          </button>
        </div>
      </header>

      {/* 6 Main Interactive Experience Cards */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {modules.map((m) => {
          const Icon = m.icon;

          return (
            <div
              key={m.id}
              onClick={() => handleCardClick(m.id)}
              className="group relative rounded-3xl bg-[#1d100b]/90 border border-espresso-800/80 hover:border-pink-500/60 p-6 sm:p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Subtle Ambient Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-30 group-hover:opacity-60 transition-opacity`} />
              
              {/* Card Top */}
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="p-3 rounded-2xl bg-espresso-900/90 border border-espresso-700/60 text-pink-400 group-hover:text-white group-hover:bg-pink-600/80 transition-all shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-mono px-3 py-1 rounded-full border ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-xs font-mono font-medium tracking-wider text-espresso-300 uppercase">
                    {m.subtitle}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white group-hover:text-pink-200 transition-colors mt-0.5">
                    {m.title}
                  </h3>
                </div>

                <p className="text-sm text-espresso-200/70 leading-relaxed mb-6 font-sans">
                  {m.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 pt-4 border-t border-espresso-800/60 flex items-center justify-between text-xs font-medium text-espresso-300">
                <span className="font-mono text-pink-400/90">{m.tag}</span>
                <span className="inline-flex items-center gap-1 text-pink-400 group-hover:translate-x-1 transition-transform font-semibold">
                  Launch Experience
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </main>

      {/* Bottom Footer Info */}
      <footer className="text-center border-t border-espresso-800/80 pt-8 pb-4 text-espresso-400 text-xs font-mono space-y-2">
        <p className="flex items-center justify-center gap-1.5 text-espresso-200 text-sm font-medium">
          Crafted with 💖 for Carpenters worldwide.
        </p>
        <p className="text-espresso-400/80 flex items-center justify-center gap-2">
          <a
            href="https://github.com/austinhttps/sabrina-app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300 hover:underline inline-flex items-center gap-1 font-mono"
          >
            ⭐ View on GitHub (austinhttps/sabrina-app)
          </a>
        </p>
      </footer>
    </div>
  );
};
