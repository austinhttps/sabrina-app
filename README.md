# 💋 Sabrina Carpenter: A Carpenter's Experience
### *The Ultimate Interactive Web Universe Celebrating the Music, Wit, Aesthetics, and Tour Magic of Pop Icon Sabrina Carpenter*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Native-F59E0B?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-pink?style=for-the-badge)](LICENSE)

---

## 🎀 Overview

**A Carpenter's Experience** is a high-fidelity, responsive Single Page Application (SPA) portal celebrating Sabrina Carpenter. Built with React, TypeScript, and Tailwind CSS, it offers 6 curated interactive experiences spanning her iconic discography (including the complete ***Short n' Sweet*** and ***Man's Best Friend*** albums), her fragrance collection, her world tour archive, and playful fan-favorite moments.

---

## 🌟 Interactive Experience Modules

```
├── 💋 Universe Hub (Live Kisses & Randomized Daily Lyric Fortunes)
├── 📻 Sabrina-Matic 3000 Stereo Cassette Deck (27 Songs with Real Streaming Audio)
├── 🍫 Sweet Tooth Fragrance Vault (The Famous OG Lemon Bar & Chocolate Bar Bottle)
├── 🎤 Nonsense Outro Generator (Custom City Rhymes & 96 BPM Beatbox)
├── 💌 emails i can't send Client (Y2K Webmail & Burn-to-Void Incinerator)
├── ☕ Espresso Diner & Cafe (Canvas Thermal Receipt Engine & Drink Pairing Quiz)
└── 🗺️ Short n' Sweet Tour Vault (20+ Stops, Surprise Songs & Runway Outfits)
```

---

### 1. 📻 Vintage Stereo Cassette Boombox (`/cassette`)
- **Complete Discography**: Features all 12 tracks from ***Short n' Sweet*** (*Taste, Please Please Please, Good Graces, Sharpest Tool, Coincidence, Bed Chem, Espresso, Dumb & Poetic, Slim Pickins, Juno, Lie to Girls, Don't Smile*), all 13 tracks from ***Man's Best Friend*** (*Manchild, Tears, My Man on Willpower, Sugar Talking, We Almost Broke Up Again Last Night, Nobody's Son, Never Getting Laid, When Did You Get Hot?, Go Go Juice, Don't Worry I'll Make You Worry, House Tour, Goodbye, Such A Funny Way*), and classics (*Feather, Nonsense*).
- **Real Audio Streaming**: Direct high-fidelity audio playback.
- **Synced Karaoke Lyrics**: Line-by-line synced lyrics for every song that highlight as the track plays.
- **Hardware Simulation**: Dual spinning cassette feed/take-up spools, real-time audio spectrum analyzer, tape pitch speed control (0.75x–1.25x), and volume sliders.
- **Persistent Mini-Player**: Bottom floating playback bar allows listening while exploring other sections of the portal.

### 2. 🍫 Sweet Tooth Fragrance Vault (`/perfume`)
- **The Famous OG Lemon Bar**: Showcasing Sabrina's legendary signature perfume—candied lemon zest, lemon bar shortbread crust, whipped chocolate marshmallow, and vanilla chantilly.
- **Authentic 3D Chocolate Bar Bottle**: Rendered in CSS with beveled chocolate segments, top-right bite mark, and metallic gold foil wrapping sleeve.
- **Scent Layering Studio**: Mix and match fragrance pairs (*Sweet Tooth OG, Caramel Dream, Cherry Baby, Me Espresso*) to generate personalized gourmand layering recipes.
- **Fragrance Finder Quiz**: 3-step interactive quiz to determine your signature scent match.

### 3. 🎤 Nonsense Outro Generator (`/outro`)
- **Cheeky Rhymes Studio**: Create custom 3-line rhyming outros using city selectors, custom mad-libs inputs, and an 80+ rhyme bank.
- **96 BPM Disco Beatbox**: Built-in rhythmic synth metronome with visual pulse indicator.
- **City Outro Archive**: Searchable database of iconic live concert outros from LA, NYC, London, Sydney, Paris, and more.
- **Export Verses**: Instant clipboard copy with confetti animations.

### 4. 💌 "emails i can't send" Y2K Webmail (`/webmail`)
- **Retro Y2K UI**: Nostalgic early-2000s desktop webmail client complete with folder navigation and unread counters.
- **Redacted Unsent Vault**: Tap hidden black redacted bars to decrypt confidential confessions and song backstory drafts.
- **Burn to Void**: Write your own unsent letter and incinerate it into glowing firework particles that erase all traces from memory.
- **Custom Kiss Stamps**: Apply virtual lipstick kiss seals (💋, 🪶, 💄, 💌, ✨) before saving drafts to `localStorage`.

### 5. ☕ Espresso Diner & Cafe (`/diner`)
- **HTML5 Canvas Thermal Receipt Engine**: Generates authentic diner receipts with custom drink orders, realistic barcodes, ragged thermal paper edges, and a lipstick stamp watermark.
- **Beverage Menu**: Drinks themed around her songs (*Short n' Sweet Espresso Double, Man's Best Friend Honeycomb Latte, Please Cold Brew, Taste Blood Orange Americano*).
- **Barista Drink Quiz**: 4-question personality quiz matching your romantic state of mind to a signature brew.

### 6. 🗺️ Short n' Sweet Tour Vault (`/tour`)
- **Global Itinerary**: 20+ real tour stops across North America, UK, Europe, and Australia.
- **Surprise Song Tracker**: Comprehensive archive of nightly acoustic covers and special guest appearances.
- **Runway Outfit Vault**: Interactive stage costume wardrobe detailing designer credits, colorways, and act themes.
- **Funny Arrest Segment**: Fan moments where audience members were jokingly handcuffed during *Juno*.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) + Custom Keyframe Animations
- **Icons:** [Lucide React](https://lucide.dev/)
- **Audio Engine:** HTML5 Audio + Web Audio API (zero heavy third-party audio dependencies)
- **Effects:** Canvas Confetti + HTML5 2D Canvas Graphics
- **Typography:** Google Fonts (*Great Vibes, Dancing Script, Caveat, Playfair Display, Courier Prime*)
- **Routing:** Hash-based client-side routing (`#hub`, `#cassette`, `#perfume`, `#outro`, `#webmail`, `#diner`, `#tour`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/austinhttps/sabrina-app.git
   cd sabrina-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready assets will be bundled into the `dist/` directory.

---

## 📂 Project Structure

```text
sabrina-app/
├── index.html                   # HTML template with Google Fonts imports
├── package.json                 # Scripts and dependencies
├── tailwind.config.js           # Custom themes, vintage palettes, and animations
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration
└── src/
    ├── main.tsx                 # Application entry point
    ├── App.tsx                  # Global layout, sticky header & floating audio player
    ├── index.css                # Tailwind directives & custom CSS utilities
    ├── data/
    │   ├── demoTracks.json      # Complete 27-song tracklist, lyrics & audio URLs
    │   ├── tourData.json        # 20+ tour stops, surprise covers & outfits
    │   ├── cafeMenu.json        # Diner beverage list & personality quiz
    │   └── outroRhymes.json     # Rhyme bank & historic concert outros
    ├── routes/
    │   ├── Hub.tsx              # Portal homepage, fortunes & live kiss counter
    │   ├── CassettePlayer.tsx   # Vintage boombox & synchronized karaoke lyrics
    │   ├── PerfumeLounge.tsx    # Sweet Tooth OG Lemon Bar 3D lounge & quiz
    │   ├── OutroGenerator.tsx   # Nonsense outro rhyme creator & beatbox
    │   ├── WebmailClient.tsx    # Y2K unsent email vault & burn incinerator
    │   ├── DinerCafe.tsx        # Espresso cafe & canvas receipt generator
    │   └── TourArchive.tsx      # World tour interactive map & runway vault
    └── utils/
        ├── audioSynth.ts        # Direct audio streaming & synthesizer engine
        └── receiptGenerator.ts  # HTML5 Canvas thermal receipt renderer
```

---

## 💖 Contributing

Pull requests and feature ideas are welcome! Feel free to open an issue or submit a PR if you want to add new surprise tour songs, fragrance notes, or outro rhymes.

---

## 📄 License

This fan-crafted project is open-source and available under the [MIT License](LICENSE).

*Crafted with 💖 for Carpenters worldwide.*
