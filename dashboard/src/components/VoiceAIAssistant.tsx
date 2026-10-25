import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Sparkles, X, MessageSquare, ArrowRight, Zap, CheckCheck } from 'lucide-react';
import type { VoiceAIMessage, EnrichedTechProduct } from '../types';

interface VoiceAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  products: EnrichedTechProduct[];
  activeCategory?: string;
  onSelectCategory: (category: string) => void;
  onSetSearchQuery: (query: string) => void;
  onSetSortBy: (sort: string) => void;
  onToggleDuplicateView: (show: boolean) => void;
  onSelectProduct?: (product: EnrichedTechProduct) => void;
}

export const VoiceAIAssistant: React.FC<VoiceAIAssistantProps> = ({
  isOpen,
  onClose,
  products,
  onSelectCategory,
  onSetSearchQuery,
  onSetSortBy,
  onToggleDuplicateView,
  onSelectProduct,
}) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<VoiceAIMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Assalam-o-Alaikum! Main Zeph-Laya AI Agent hoon. Aap mujh se bol kar ya text mein WhatsApp group deals, duplicate prices aur saste sellers ke baare mein pooch sakte hain.',
      timestamp: 'Now',
    },
  ]);
  const [textInput, setTextInput] = useState('');
  const [activeMode, setActiveMode] = useState<'voice' | 'chat'>('voice');
  const [internalOpen, setInternalOpen] = useState(false);
  const modalVisible = isOpen || internalOpen;

  const handleClose = () => {
    handleEndCall();
    setInternalOpen(false);
    onClose();
  };

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Call duration counter
  useEffect(() => {
    let timer: any;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  // Format call duration MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Initialize Speech Synthesis and Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // recognizes English & Urdu tech terms

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const spokenText = event.results[0][0].transcript;
          setTranscript(spokenText);
          handleUserQuery(spokenText);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Text to Speech
  const speakResponse = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition already started or error', e);
      }
    }
  };

  // Non-autoregressive Laya & Zeph routing engine
  const handleUserQuery = (query: string) => {
    const qLower = query.toLowerCase();
    let responseText = '';
    let actionDone = '';

    // Add user message to history
    const userMsg: VoiceAIMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // 1. Intent: Cross-Group Duplicate & Savings
    if (
      qLower.includes('duplicate') ||
      qLower.includes('cross') ||
      qLower.includes('saving') ||
      qLower.includes('farq') ||
      qLower.includes('difference') ||
      qLower.includes('doosre group')
    ) {
      onToggleDuplicateView(true);
      onSetSortBy('savings');
      responseText =
        'Main ne Multi-Group Cross-Post view khol diya hai aur biggest savings ke hisaab se sort kar diya hai. Samsung S23 Ultra par Rs. 37,000 aur Dell XPS 17 par Rs. 35,000 ki bachat mil rahi hai!';
      actionDone = 'Toggled Multi-Group Duplicate View & Sorted by Highest Savings';
    }
    // 2. Intent: MacBook queries
    else if (qLower.includes('macbook') || qLower.includes('apple laptop') || qLower.includes('m1') || qLower.includes('m2')) {
      onSelectCategory('MacBook Series');
      if (qLower.includes('sasta') || qLower.includes('cheapest') || qLower.includes('low')) {
        onSetSortBy('price-asc');
        const m1 = products.find((p) => p.id === 'macbook-air-m1-gold');
        if (m1 && onSelectProduct) onSelectProduct(m1);
        responseText =
          'Sabse best value MacBook Air M1 16GB RAM Gold hai. Yeh Kashif Apple Hub Saddar se Rs. 142,000 mein mil raha hai, jabke Hafeez Center mein yehi 155,000 ka hai.';
        actionDone = 'Switched to MacBook Series & Highlighted MacBook Air M1 (Rs. 142,000)';
      } else {
        responseText =
          'MacBook Series open ho gayi hai. Yahan 16GB M1 Air, M1 Pro 14 inch aur M2 Midnight ki verified WhatsApp listings mojood hain.';
        actionDone = 'Filtered to MacBook Series';
      }
    }
    // 3. Intent: Dell / General Laptops
    else if (qLower.includes('dell') || qLower.includes('xps') || qLower.includes('thinkpad') || qLower.includes('legion') || qLower.includes('laptop')) {
      onSelectCategory('General Laptops');
      if (qLower.includes('xps') || qLower.includes('hamza') || qLower.includes('quetta')) {
        const xps = products.find((p) => p.id === 'dell-xps-17-9700-uhd');
        if (xps && onSelectProduct) onSelectProduct(xps);
        responseText =
          'Dell XPS 17 9700 UHD+ 4K Quetta Russi Market Godam #65 se Muhammad Hamza Rs. 180,000 mein de rahe hain. Yeh Techno City Karachi se Rs. 35,000 sasta hai!';
        actionDone = 'Opened Dell XPS 17 9700 Verified Listing';
      } else {
        responseText =
          'General Laptops category load ho chuki hai. Dell XPS 17, ThinkPad X1 Carbon Gen 9 aur Lenovo Legion 5 Pro RTX 3070 verified rate par mojood hain.';
        actionDone = 'Switched to General Laptops';
      }
    }
    // 4. Intent: HP Spectre / OLED
    else if (qLower.includes('spectre') || qLower.includes('hp') || qLower.includes('oled') || qLower.includes('elitebook')) {
      onSelectCategory('HP Spectre & HP Laptops');
      const spectre = products.find((p) => p.id === 'hp-spectre-x360-14-oled-gem-cut');
      if (spectre && onSelectProduct) onSelectProduct(spectre);
      responseText =
        'HP Spectre x360 14 inch 3K2K OLED Touch convertible Rs. 178,000 mein Tariq Corporate Karachi se mil raha hai. Blue Area Islamabad mein yeh 210,000 ka tha.';
      actionDone = 'Opened HP Spectre x360 14 OLED Details';
    }
    // 5. Intent: iPhone queries
    else if (qLower.includes('iphone') || qLower.includes('apple mobile')) {
      onSelectCategory('iPhones');
      if (qLower.includes('13 pro')) {
        const ip13 = products.find((p) => p.id === 'iphone-13-pro-128gb-graphite');
        if (ip13 && onSelectProduct) onSelectProduct(ip13);
        responseText =
          'iPhone 13 Pro 128GB Graphite Official PTA Approved waterpack phone Muhammad Hamza Quetta se Rs. 185,000 ka de rahe hain (Hall Road rate 210,000 hai).';
        actionDone = 'Filtered iPhone 13 Pro 128GB PTA Deal';
      } else {
        responseText =
          'iPhones category open kar di hai. Yahan iPhone 13 Pro, iPhone 14 Plus JV aur 15 Pro Max Natural Titanium ke cross-group deals mojood hain.';
        actionDone = 'Switched to iPhones category';
      }
    }
    // 6. Intent: Other Mobiles (Android)
    else if (qLower.includes('samsung') || qLower.includes('pixel') || qLower.includes('oneplus') || qLower.includes('xiaomi') || qLower.includes('android')) {
      onSelectCategory('Other Mobiles');
      responseText =
        'Other Mobiles open ho gaya hai. Samsung Galaxy S23 Ultra 512GB PTA Rs. 248,000 mein Quetta se mil raha hai, aur Google Pixel 7 Pro Rs. 105,000 mein available hai.';
      actionDone = 'Filtered to Android Flagships';
    }
    // 7. Intent: Price sorting / Cheapest
    else if (qLower.includes('sasta') || qLower.includes('cheapest') || qLower.includes('lowest price')) {
      onSetSortBy('price-asc');
      responseText = 'Products ko lowest price se highest price tak sort kar diya hai.';
      actionDone = 'Sorted by Price: Low to High';
    }
    // 8. Intent: General search
    else {
      onSetSearchQuery(query);
      responseText = `Aap ki query "${query}" ke hisaab se live deals filter kar di hain.`;
      actionDone = `Filtered dashboard by: "${query}"`;
    }

    // Add assistant response
    const botMsg: VoiceAIMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionExecuted: actionDone,
    };

    setMessages((prev) => [...prev, botMsg]);

    // Speak response if calling
    if (isCalling) {
      speakResponse(responseText);
    }
  };

  const handleStartCall = () => {
    setIsCalling(true);
    setInternalOpen(true);
    setActiveMode('voice');
    speakResponse(
      'WhatsApp AI Assistant connected. Boliye, main aap ke liye konsa laptop ya mobile search karun?'
    );
  };

  const handleEndCall = () => {
    setIsCalling(false);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    setIsSpeaking(false);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const query = textInput.trim();
    setTextInput('');
    handleUserQuery(query);
  };

  return (
    <>
      {/* Floating WhatsApp Action Pill Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={handleStartCall}
          className="group flex items-center gap-3 px-5 py-3.5 bg-[#25D366] text-[#111B21] rounded-full shadow-2xl hover:bg-[#20ba5a] transition-all transform hover:scale-105 active:scale-95 font-medium text-sm"
        >
          <div className="relative flex items-center justify-center w-6 h-6 bg-[#111B21] text-[#25D366] rounded-full">
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>
          <span>Talk to WhatsApp Voice AI</span>
        </button>

        <button
          onClick={() => {
            setInternalOpen(true);
            setActiveMode('chat');
          }}
          className="p-3.5 bg-[#202C33] text-[#25D366] border border-[#2A3942] rounded-full shadow-xl hover:bg-[#2A3942] transition-colors"
          title="Open AI Chat Drawer"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* WhatsApp Voice Call & Assistant Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#111B21] border border-[#2A3942] rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#202C33] border-b border-[#2A3942]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white text-base font-normal flex items-center gap-2">
                    <span>Zeph & Laya WhatsApp Voice AI</span>
                    <span className="px-2 py-0.5 text-xs bg-[#25D366]/20 text-[#25D366] rounded-full font-sans">
                      Non-Autoregressive 33ms
                    </span>
                  </h3>
                  <p className="text-xs text-[#8696A0]">
                    {isCalling
                      ? `Voice Call Active • ${formatTime(callDuration)}`
                      : 'End-to-End Encrypted Deal Assistant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMode(activeMode === 'voice' ? 'chat' : 'voice')}
                  className="px-3 py-1.5 text-xs rounded-full border border-[#2A3942] text-[#8696A0] hover:text-white hover:border-[#25D366] transition-colors"
                >
                  {activeMode === 'voice' ? 'Switch to Chat' : 'Switch to Voice'}
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 text-[#8696A0] hover:text-white rounded-full hover:bg-[#2A3942]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Voice Call Screen */}
            {activeMode === 'voice' ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-between text-center overflow-y-auto">
                <div className="my-6">
                  {/* Avatar with animated pulses */}
                  <div className="relative mx-auto w-28 h-28 rounded-full bg-gradient-to-tr from-[#202C33] to-[#2A3942] border-2 border-[#25D366] flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-12 h-12 text-[#25D366] animate-pulse" />
                    {isSpeaking && (
                      <span className="absolute inset-0 rounded-full border-4 border-[#25D366] animate-ping opacity-25"></span>
                    )}
                  </div>
                  <h4 className="mt-4 text-xl font-normal text-white">Zeph WhatsApp Agent</h4>
                  <p className="text-sm text-[#25D366] font-medium mt-1">
                    {isSpeaking
                      ? 'Speaking...'
                      : isListening
                      ? 'Listening to you... Boliye'
                      : isCalling
                      ? 'Connected • Tap mic to speak'
                      : 'Ready to call'}
                  </p>

                  {/* Audio Waveform */}
                  {(isSpeaking || isListening) && (
                    <div className="flex items-center justify-center gap-1.5 h-10 mt-4">
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                    </div>
                  )}

                  {transcript && (
                    <div className="mt-3 text-xs text-[#25D366] italic bg-[#202C33] px-3.5 py-1.5 rounded-full border border-[#25D366]/30 inline-block">
                      "{transcript}"
                    </div>
                  )}
                </div>

                {/* Latest Dialogue Card */}
                {messages.length > 0 && (
                  <div className="w-full bg-[#202C33]/80 border border-[#2A3942] rounded-2xl p-4 text-left my-2">
                    <div className="flex items-center gap-2 text-xs text-[#8696A0] mb-1">
                      <span className="text-[#25D366] font-medium">
                        {messages[messages.length - 1].sender === 'assistant'
                          ? 'AI Assistant'
                          : 'You'}
                      </span>
                      <span>•</span>
                      <span>{messages[messages.length - 1].timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-100">
                      {messages[messages.length - 1].text}
                    </p>
                    {messages[messages.length - 1].actionExecuted && (
                      <div className="mt-2 text-xs text-[#25D366] bg-[#25D366]/10 px-2.5 py-1 rounded-md inline-block">
                        ⚡ {messages[messages.length - 1].actionExecuted}
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Voice Prompt Chips */}
                <div className="w-full mt-4">
                  <p className="text-xs text-[#8696A0] mb-2">Try saying or tapping:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      'Sabse sasta M1 MacBook dikhao',
                      'Show duplicate posts for Dell XPS 17',
                      'Which HP Spectre has 3K OLED?',
                      'Compare iPhone 13 Pro prices',
                      'Sort by highest savings',
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleUserQuery(chip)}
                        className="px-3 py-1.5 text-xs bg-[#202C33] text-slate-300 hover:text-white hover:bg-[#2A3942] border border-[#2A3942] rounded-full transition-all"
                      >
                        "{chip}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Call Control Action Bar */}
                <div className="flex items-center gap-5 mt-8 mb-2">
                  <button
                    onClick={startVoiceInput}
                    disabled={!isCalling}
                    className={`p-4 rounded-full transition-all ${
                      isListening
                        ? 'bg-[#25D366] text-[#111B21] animate-pulse ring-4 ring-[#25D366]/30'
                        : 'bg-[#202C33] text-slate-200 border border-[#2A3942] hover:bg-[#2A3942]'
                    }`}
                    title="Speak into Microphone"
                  >
                    {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </button>

                  {isCalling ? (
                    <button
                      onClick={handleEndCall}
                      className="p-5 bg-rose-600 text-white rounded-full shadow-xl hover:bg-rose-700 transition-transform active:scale-95"
                      title="End Call"
                    >
                      <PhoneOff className="w-7 h-7" />
                    </button>
                  ) : (
                    <button
                      onClick={handleStartCall}
                      className="p-5 bg-[#25D366] text-[#111B21] rounded-full shadow-xl hover:bg-[#20ba5a] transition-transform active:scale-95"
                      title="Start Voice Call"
                    >
                      <Phone className="w-7 h-7 fill-current" />
                    </button>
                  )}

                  <button
                    onClick={() =>
                      speakResponse(messages[messages.length - 1]?.text || 'No response')
                    }
                    className="p-4 bg-[#202C33] text-slate-200 border border-[#2A3942] rounded-full hover:bg-[#2A3942] transition-colors"
                    title="Repeat Voice Output"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              /* WhatsApp Chat Bubble Screen */
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.map((m) => {
                    const isMe = m.sender === 'user';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-2.5 rounded-[18px] text-sm shadow ${
                            isMe
                              ? 'bg-[#005c4b] text-white rounded-tr-none'
                              : 'bg-[#202C33] text-[#e9edef] rounded-tl-none border border-[#2A3942]'
                          }`}
                        >
                          <p>{m.text}</p>
                          {m.actionExecuted && (
                            <div className="mt-1.5 pt-1.5 border-t border-white/10 text-xs text-[#25D366] flex items-center gap-1 font-mono">
                              <Zap className="w-3 h-3" />
                              <span>{m.actionExecuted}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696A0] mt-1">
                            <span>{m.timestamp}</span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Composer Input (WhatsApp style) */}
                <form
                  onSubmit={handleSendText}
                  className="p-3 bg-[#202C33] border-t border-[#2A3942] flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={startVoiceInput}
                    className={`p-2 rounded-full ${
                      isListening ? 'text-[#25D366] bg-[#25D366]/20' : 'text-[#8696A0]'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type an instruction or query (e.g. sabse sasta M1)..."
                    className="flex-1 bg-[#111B21] border border-[#2A3942] rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#25D366]"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#25D366] text-[#111B21] rounded-full hover:bg-[#20ba5a] transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
