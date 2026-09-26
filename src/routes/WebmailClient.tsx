import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Star, 
  Search, 
  Flame, 
  Sparkles, 
  Plus, 
  Check, 
  Eye, 
  EyeOff, 
  Reply, 
  Paperclip,
  Smile,
  Stamp,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioSynth } from '../utils/audioSynth.ts';

interface WebmailClientProps {
  onBack: () => void;
}

interface EmailItem {
  id: string;
  folder: 'inbox' | 'drafts' | 'trash' | 'starred';
  from: string;
  to: string;
  subject: string;
  date: string;
  time: string;
  body: string;
  isRedacted?: boolean;
  redactedParts?: string[];
  isStarred?: boolean;
  isRead?: boolean;
  avatar: string;
  tag?: string;
}

const DEFAULT_EMAILS: EmailItem[] = [
  {
    id: 'e1',
    folder: 'inbox',
    from: 'Barry 🎬 <barry@keoghan.film>',
    to: 'Sabrina <sabrina@shortnsweet.fm>',
    subject: 'That white jacket you mentioned...',
    date: 'Sep 24, 2024',
    time: '11:42 PM',
    body: "Saw the 'Bed Chem' lyrics! You really had to mention the heavy accent and the jacket, didn't you? See you in New York next week, love. Don't let them arrest any more fans in handcuffs without me.",
    avatar: '🎬',
    isStarred: true,
    isRead: true,
    tag: 'Bed Chem'
  },
  {
    id: 'e2',
    folder: 'inbox',
    from: 'Island Records HQ <mgmt@islandrecords.com>',
    to: 'Sabrina <sabrina@shortnsweet.fm>',
    subject: 'URGENT: "Short n\' Sweet" Billboard #1 Update & Champagne 🍾',
    date: 'Sep 23, 2024',
    time: '09:15 AM',
    body: "Congratulations Sabrina! Short n' Sweet has officially topped the Billboard 200 with three simultaneous Top 5 hits ('Taste', 'Please Please Please', and 'Espresso'). The arena tour is completely sold out across all 68 dates. Rest your voice and grab an iced espresso!",
    avatar: '💿',
    isStarred: true,
    isRead: true,
    tag: 'Milestone'
  },
  {
    id: 'e3',
    folder: 'inbox',
    from: 'The 67th GRAMMYs Committee <nominations@grammy.org>',
    to: 'Sabrina Carpenter <sabrina@shortnsweet.fm>',
    subject: 'Official Nomination Confirmation: Album of the Year & Record of the Year',
    date: 'Nov 08, 2024',
    time: '08:30 AM',
    body: "Dear Sabrina, on behalf of The Recording Academy, it is our distinct privilege to formally inform you of your nominations for Album of the Year, Record of the Year, and Best Pop Solo Performance. See you in Los Angeles for the red carpet!",
    avatar: '🏆',
    isStarred: true,
    isRead: false,
    tag: 'GRAMMYs'
  },
  {
    id: 'e4',
    folder: 'inbox',
    from: 'Eras Tour Production <crew@taylorswift.com>',
    to: 'Sabrina <sabrina@shortnsweet.fm>',
    subject: 'Memories from Australia & Singapore 💖',
    date: 'Mar 12, 2024',
    time: '04:10 PM',
    body: "Sabrina! The stadiums were shaking every night during your opening set. Taylor loved the acoustic mashups. You're always welcome to guest star anytime. Sending love from the whole tour family!",
    avatar: '✨',
    isStarred: false,
    isRead: true,
    tag: 'Tour'
  },
  {
    id: 'e5',
    folder: 'drafts',
    from: 'Sabrina <sabrina@shortnsweet.fm>',
    to: 'the.boy.who.shall.not.be.named@neveragain.com',
    subject: 'emails i can\'t send (Draft #14: The Unsent Closure)',
    date: 'Oct 14, 2022',
    time: '02:30 AM',
    body: "I spent three years thinking that if I was just a little quieter or a little prettier you wouldn't look for reasons to leave. [REDACTED: I kept the vintage sweater you stole from my closet anyway]. You said I was dramatic in public, but you were cruel in private. I hope whoever you're lying to tonight knows that loving you feels like holding onto broken glass.",
    isRedacted: true,
    redactedParts: [
      "I kept the vintage sweater you stole from my closet anyway",
      "you were cruel in private"
    ],
    avatar: '💌',
    tag: 'Unsent Vault'
  },
  {
    id: 'e6',
    folder: 'drafts',
    from: 'Sabrina <sabrina@shortnsweet.fm>',
    to: 'my.inner.peace@cloudnine.com',
    subject: 'Good Graces (Rulebook for myself)',
    date: 'Jul 19, 2024',
    time: '01:15 AM',
    body: "Rule 1: Don't let anyone waste your makeup time. Rule 2: [REDACTED: If he embarrasses you in front of the internet, he is immediately exiled]. Rule 3: Always leave them wanting one more espresso shot. You're the prize, baby.",
    isRedacted: true,
    redactedParts: [
      "If he embarrasses you in front of the internet, he is immediately exiled"
    ],
    avatar: '💄',
    tag: 'Self Rule'
  },
  {
    id: 'e7',
    folder: 'trash',
    from: 'Ex-Boyfriend <toxic@heartbreakhotel.com>',
    to: 'Sabrina <sabrina@shortnsweet.fm>',
    subject: 'Can we just talk for 5 minutes?',
    date: 'Aug 02, 2024',
    time: '03:45 AM',
    body: "I heard 'Taste' and I know it's about me. Please tell me you didn't really mean what you said in the music video.",
    avatar: '🗑️',
    isStarred: false,
    isRead: true,
    tag: 'Blocked'
  }
];

export const WebmailClient: React.FC<WebmailClientProps> = ({ onBack }) => {
  const [emails, setEmails] = useState<EmailItem[]>(() => {
    const saved = localStorage.getItem('sabrina_webmail_emails');
    return saved ? JSON.parse(saved) : DEFAULT_EMAILS;
  });

  const [currentFolder, setCurrentFolder] = useState<'inbox' | 'drafts' | 'trash' | 'starred'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedRedactions, setRevealedRedactions] = useState<Record<string, boolean>>({});
  
  // Compose modal state
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState('ex-boyfriend@neveragain.com');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [stampSelected, setStampSelected] = useState('💋');

  useEffect(() => {
    localStorage.setItem('sabrina_webmail_emails', JSON.stringify(emails));
  }, [emails]);

  // Set default selected email when folder changes
  useEffect(() => {
    const folderEmails = emails.filter(e => currentFolder === 'starred' ? e.isStarred : e.folder === currentFolder);
    if (folderEmails.length > 0) {
      setSelectedEmail(folderEmails[0]);
    } else {
      setSelectedEmail(null);
    }
  }, [currentFolder, emails]);

  const filteredEmails = emails.filter((email) => {
    const matchesFolder = currentFolder === 'starred' ? email.isStarred : email.folder === currentFolder;
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleSelectEmail = (email: EmailItem) => {
    audioSynth.playCassetteClick('press');
    setSelectedEmail(email);
    // Mark as read
    if (!email.isRead) {
      setEmails(prev => prev.map(e => e.id === email.id ? { ...e, isRead: true } : e));
    }
  };

  const handleToggleStar = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioSynth.playSparkle();
    setEmails(prev => prev.map(email => email.id === emailId ? { ...email, isStarred: !email.isStarred } : email));
  };

  const handleBurnDraft = (draftId: string) => {
    audioSynth.playSteamHiss(1.5);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#f97316', '#ef4444', '#78350f']
    });

    setEmails(prev => prev.filter(e => e.id !== draftId));
    setSelectedEmail(null);
  };

  const handleSendOrSaveDraft = (intoVoid: boolean = false) => {
    if (!composeSubject.trim() && !composeBody.trim()) return;

    audioSynth.playSparkle();
    if (intoVoid) {
      audioSynth.playSteamHiss(1.0);
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ec4899', '#f43f5e', '#38bdf8']
      });
    }

    const newEmail: EmailItem = {
      id: `draft_${Date.now()}`,
      folder: intoVoid ? 'trash' : 'drafts',
      from: 'Sabrina <sabrina@shortnsweet.fm>',
      to: composeTo || 'the.universe@shortnsweet.fm',
      subject: `${stampSelected} ${composeSubject || '(No Subject)'}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      body: composeBody,
      avatar: '💌',
      tag: intoVoid ? 'Burned' : 'Custom Draft',
      isStarred: false,
      isRead: true
    };

    setEmails([newEmail, ...emails]);
    setIsComposing(false);
    setComposeSubject('');
    setComposeBody('');
    setCurrentFolder(intoVoid ? 'trash' : 'drafts');
    setSelectedEmail(newEmail);
  };

  const toggleRedaction = (id: string) => {
    audioSynth.playKissPop();
    setRevealedRedactions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-espresso-900 border border-espresso-700 text-pink-300 hover:text-white hover:border-pink-500 transition-all font-mono text-xs flex items-center gap-1.5"
        >
          ← Back to Universe Hub
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioSynth.playCassetteClick('press');
              setIsComposing(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-mono text-xs font-bold shadow-diner-pink flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Compose Unsent Draft
          </button>
        </div>
      </div>

      {/* Retro Y2K Webmail Window Container */}
      <div className="rounded-3xl bg-[#1c0f0a] border-2 border-espresso-700/80 shadow-2xl overflow-hidden flex flex-col min-h-[720px]">
        {/* Retro Window Titlebar */}
        <div className="bg-[#2b1710] px-5 py-3.5 border-b border-espresso-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500/80 inline-block border border-rose-600" />
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500/80 inline-block border border-amber-600" />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 inline-block border border-emerald-600" />
            <span className="text-xs font-mono font-bold text-espresso-200 ml-2 tracking-wide">
              📧 Sabrina Carpenter Webmail v2.0 • [emails i can't send]
            </span>
          </div>

          <div className="text-xs font-mono text-pink-400/90 font-semibold hidden sm:block">
            Connected: sabrina@shortnsweet.fm ☕
          </div>
        </div>

        {/* Webmail Layout (Sidebar + Email List + Message View) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0">
          {/* Left Navigation Sidebar */}
          <div className="md:col-span-3 bg-[#170c07] border-r border-espresso-800 p-4 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-espresso-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search letters & roasts..."
                className="w-full pl-9 pr-3 py-2 bg-espresso-950 rounded-xl border border-espresso-800 text-xs text-espresso-100 placeholder-espresso-500 focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>

            {/* Folder Navigation Tabs */}
            <div className="space-y-1">
              {[
                { id: 'inbox', label: 'Inbox', icon: Inbox, count: emails.filter(e => e.folder === 'inbox' && !e.isRead).length },
                { id: 'drafts', label: 'Unsent Drafts', icon: FileText, count: emails.filter(e => e.folder === 'drafts').length },
                { id: 'starred', label: 'Starred VIP', icon: Star, count: emails.filter(e => e.isStarred).length },
                { id: 'trash', label: 'Composted / Trash', icon: Trash2, count: emails.filter(e => e.folder === 'trash').length },
              ].map((f) => {
                const Icon = f.icon;
                const isActive = currentFolder === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      audioSynth.playCassetteClick('press');
                      setCurrentFolder(f.id as any);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                      isActive
                        ? 'bg-pink-600/20 text-pink-300 font-bold border border-pink-500/40'
                        : 'text-espresso-300 hover:bg-espresso-900/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{f.label}</span>
                    </div>
                    {f.count > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-pink-600 text-white' : 'bg-espresso-800 text-espresso-300'
                      }`}>
                        {f.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Aesthetic Sticky Note */}
            <div className="p-4 rounded-2xl bg-[#2a170f] border border-espresso-700/60 shadow-md">
              <span className="text-[10px] font-mono uppercase text-pink-400 font-bold block mb-1">
                📌 Barista Reminder
              </span>
              <p className="text-xs font-serif italic text-espresso-200/90 leading-snug">
                "Some letters are better left in drafts, but they make incredible platinum pop anthems."
              </p>
            </div>
          </div>

          {/* Middle Email Item List */}
          <div className="md:col-span-4 bg-[#1f110b] border-r border-espresso-800 overflow-y-auto max-h-[660px]">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-espresso-400 font-mono text-xs">
                No letters found in this folder.
              </div>
            ) : (
              <div className="divide-y divide-espresso-800/60">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => handleSelectEmail(email)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedEmail?.id === email.id
                        ? 'bg-[#2f1910] border-l-4 border-pink-500'
                        : !email.isRead
                        ? 'bg-espresso-950/40 hover:bg-espresso-900/60'
                        : 'hover:bg-espresso-900/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base">{email.avatar}</span>
                        <span className={`text-xs font-mono truncate ${!email.isRead ? 'font-bold text-white' : 'text-espresso-200'}`}>
                          {email.from.split('<')[0]}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleToggleStar(email.id, e)}
                        className="text-espresso-500 hover:text-amber-400 transition-colors shrink-0"
                      >
                        <Star className={`w-3.5 h-3.5 ${email.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    <h4 className={`text-xs font-serif line-clamp-1 mb-1 ${!email.isRead ? 'font-bold text-pink-100' : 'text-espresso-300'}`}>
                      {email.subject}
                    </h4>

                    <p className="text-[11px] text-espresso-400/80 line-clamp-2 font-sans mb-2">
                      {email.body}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-espresso-500">
                      <span>{email.date}</span>
                      {email.tag && (
                        <span className="px-2 py-0.5 rounded bg-espresso-900 text-pink-400 border border-espresso-800">
                          {email.tag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Selected Email Reading Pane */}
          <div className="md:col-span-5 bg-[#25140d] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[660px]">
            {selectedEmail ? (
              <div className="space-y-6">
                {/* Email Header */}
                <div className="border-b border-espresso-800 pb-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                      {selectedEmail.subject}
                    </h2>
                    <div className="flex items-center gap-2 shrink-0">
                      {selectedEmail.folder === 'drafts' && (
                        <button
                          onClick={() => handleBurnDraft(selectedEmail.id)}
                          className="px-3 py-1.5 rounded-xl bg-orange-950/80 border border-orange-700/60 hover:bg-orange-600 text-orange-200 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 shadow-md"
                          title="Burn this unsent draft into the void"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          Burn to Void
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-mono text-espresso-300">
                    <div><span className="text-espresso-500">FROM:</span> {selectedEmail.from}</div>
                    <div><span className="text-espresso-500">TO:</span> {selectedEmail.to}</div>
                    <div><span className="text-espresso-500">SENT:</span> {selectedEmail.date} at {selectedEmail.time}</div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="prose prose-invert max-w-none text-sm font-sans text-pink-50/90 leading-relaxed whitespace-pre-line">
                  {selectedEmail.isRedacted ? (
                    <div>
                      {selectedEmail.body}
                      
                      {/* Redacted Reveal Toggle Card */}
                      <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-espresso-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-pink-400 font-bold flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            Confidential Unsent Lines
                          </span>
                          <button
                            onClick={() => toggleRedaction(selectedEmail.id)}
                            className="px-2.5 py-1 rounded-lg bg-pink-600/30 hover:bg-pink-600 text-pink-200 hover:text-white text-xs font-mono transition-all flex items-center gap-1"
                          >
                            {revealedRedactions[selectedEmail.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {revealedRedactions[selectedEmail.id] ? 'Hide Redacted' : 'Reveal Redacted'}
                          </button>
                        </div>
                        
                        {revealedRedactions[selectedEmail.id] ? (
                          <div className="space-y-1.5 mt-2">
                            {selectedEmail.redactedParts?.map((part, i) => (
                              <p key={i} className="text-xs font-mono text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
                                🔓 "{part}"
                              </p>
                            ))}
                          </div>
                        ) : (
                          <div className="h-6 bg-espresso-950 rounded flex items-center px-3 text-[11px] font-mono text-espresso-600">
                            ████████████████████████████████████████
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    selectedEmail.body
                  )}
                </div>

                {/* Reply Footer Box */}
                <div className="pt-6 border-t border-espresso-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-espresso-500">
                    Sabrina Webmail • End-to-End Sass Encrypted
                  </span>
                  <button
                    onClick={() => {
                      audioSynth.playCassetteClick('press');
                      setComposeTo(selectedEmail.from);
                      setComposeSubject(`Re: ${selectedEmail.subject}`);
                      setIsComposing(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-espresso-900 border border-espresso-700 hover:border-pink-500 text-pink-200 text-xs font-mono flex items-center gap-1.5"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-espresso-400 font-mono py-20">
                <Mail className="w-12 h-12 text-espresso-700 mb-3" />
                <p className="text-sm">Select an email to view the message.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Draft Modal */}
      {isComposing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1f100a] border-2 border-pink-500/60 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-espresso-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <h3 className="text-lg font-serif font-bold text-white">Write Unsent Letter / Draft</h3>
              </div>
              <button
                onClick={() => setIsComposing(false)}
                className="text-espresso-400 hover:text-white font-mono text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* Recipient */}
            <div>
              <label className="block text-[11px] font-mono text-espresso-400 mb-1">TO:</label>
              <input
                type="text"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-espresso-950 border border-espresso-800 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[11px] font-mono text-espresso-400 mb-1">SUBJECT:</label>
              <input
                type="text"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="e.g. why i didn't answer your call..."
                className="w-full px-3 py-2 rounded-xl bg-espresso-950 border border-espresso-800 text-xs font-serif text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Sticker Stamp Selection */}
            <div>
              <label className="block text-[11px] font-mono text-espresso-400 mb-1">WAX SEAL STAMP:</label>
              <div className="flex gap-2">
                {['💋', '☕', '🪶', '🍒', '✨', '💔', '💌'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      audioSynth.playKissPop();
                      setStampSelected(st);
                    }}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                      stampSelected === st ? 'bg-pink-600 scale-110 shadow-glow-pink' : 'bg-espresso-900 border border-espresso-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[11px] font-mono text-espresso-400 mb-1">LETTER CONTENT:</label>
              <textarea
                rows={5}
                value={composeBody}
                onKeyDown={() => audioSynth.playTypewriterTap()}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Pour your heart, your boundaries, or your unreleased lyrics into this draft..."
                className="w-full px-3 py-2.5 rounded-xl bg-espresso-950 border border-espresso-800 text-xs font-sans text-pink-50 focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 gap-3">
              <button
                onClick={() => handleSendOrSaveDraft(true)}
                className="px-4 py-2.5 rounded-xl bg-orange-950 hover:bg-orange-600 text-orange-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <Flame className="w-3.5 h-3.5" />
                Burn into Void
              </button>

              <button
                onClick={() => handleSendOrSaveDraft(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-mono font-bold shadow-diner-pink flex items-center gap-1.5 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                Save to Unsent Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
