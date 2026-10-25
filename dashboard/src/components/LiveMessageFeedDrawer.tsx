import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  X, 
  RefreshCw, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface RawWhatsAppMessage {
  id: string;
  chat_jid: string;
  sender: string;
  sender_phone: string;
  sender_name: string;
  content: string;
  timestamp: string;
  media_type: string | null;
  filename: string | null;
  is_from_me: boolean;
}

interface LiveMessageFeedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncNow: () => void;
  isSyncing: boolean;
  totalDbMessages: number;
}

export const LiveMessageFeedDrawer: React.FC<LiveMessageFeedDrawerProps> = ({
  isOpen,
  onClose,
  onSyncNow,
  isSyncing,
  totalDbMessages,
}) => {
  const [messages, setMessages] = useState<RawWhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState('');

  const fetchLiveMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8765/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      // Fallback: If live server is starting or offline
      console.log('Live sync server poll in progress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLiveMessages();
      const interval = setInterval(fetchLiveMessages, 8000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = messages.filter((m) =>
    m.content.toLowerCase().includes(filterText.toLowerCase()) ||
    m.sender_name.toLowerCase().includes(filterText.toLowerCase()) ||
    m.sender_phone.includes(filterText)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-[var(--wa-surface)] text-[var(--wa-ink)] border-l border-[var(--wa-border)] shadow-2xl h-full flex flex-col animate-slideLeft">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--wa-border)] flex items-center justify-between bg-[var(--wa-surface-subtle)]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 flex items-center justify-center text-[#25D366]">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] ring-2 ring-[var(--wa-surface)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-normal text-[var(--wa-ink)]">
                  Live WhatsApp SQLite Stream
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] font-mono">
                  messages.db
                </span>
              </div>
              <p className="text-[11px] text-[var(--wa-ink-muted)]">
                {totalDbMessages} total real messages stored in WhatsApp bridge
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchLiveMessages();
                onSyncNow();
              }}
              disabled={isSyncing || loading}
              className="p-2 rounded-full border border-[var(--wa-border)] text-[var(--wa-ink)] hover:bg-[var(--wa-surface)] transition-all disabled:opacity-50"
              title="Refresh / Sync Now"
            >
              <RefreshCw className={`w-4 h-4 ${(isSyncing || loading) ? 'animate-spin text-[#25D366]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--wa-ink-muted)] hover:text-[var(--wa-ink)] hover:bg-[var(--wa-surface)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-3 border-b border-[var(--wa-border)] bg-[var(--wa-surface)]">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter by keyword (e.g. Dell, price, Hamza, Quetta)..."
            className="w-full px-3.5 py-1.5 text-xs bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] rounded-full text-[var(--wa-ink)] focus:outline-none focus:border-[#25D366]"
          />
        </div>

        {/* Message Stream */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {filtered.length > 0 ? (
            filtered.map((msg) => {
              const hasPrice = /(?:price|rs\.?|\*[\d,]+\*)/i.test(msg.content);
              return (
                <div
                  key={msg.id}
                  className={`p-3.5 wa-tile border transition-all ${
                    hasPrice
                      ? 'border-[#25D366]/40 bg-[#25D366]/5 shadow-sm'
                      : 'border-[var(--wa-border)] bg-[var(--wa-surface-subtle)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#005C4B]/20 flex items-center justify-center text-[#25D366] text-[10px]">
                        <MessageSquare className="w-3 h-3" />
                      </div>
                      <span className="font-normal text-[var(--wa-ink)]">
                        {msg.sender_name}
                      </span>
                      {msg.sender_phone && msg.sender_phone !== msg.sender_name && (
                        <span className="text-[10px] text-[var(--wa-ink-muted)] font-mono">
                          (+{msg.sender_phone})
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[var(--wa-ink-muted)] whitespace-nowrap">
                      {msg.timestamp.split('+')[0].trim()}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--wa-ink)] whitespace-pre-line font-sans leading-relaxed">
                    {msg.content}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[var(--wa-border)]/50 flex items-center justify-between text-[10px]">
                    <span className="text-[var(--wa-ink-muted)] font-mono">
                      ID: {msg.id.slice(0, 16)}...
                    </span>
                    {hasPrice && (
                      <span className="px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3" />
                        Commercial Listing Detected
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-[var(--wa-ink-muted)]">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No messages match your filter.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] flex items-center justify-between text-[11px]">
          <span className="text-[var(--wa-ink-muted)]">
            Auto-polling SQLite store every 8s
          </span>
          <a
            href="http://127.0.0.1:8765/api/status"
            target="_blank"
            rel="noreferrer"
            className="text-[#25D366] hover:underline flex items-center gap-1"
          >
            <span>Raw JSON Endpoint</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
