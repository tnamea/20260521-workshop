import { useEffect, useRef, useState } from 'react';
import type { LogEntry } from '../types/index';

// ─── Level colors ────────────────────────────────────────────────────────────

const LEVEL_COLORS = {
  info: 'text-[#64748b]',
  warn: 'text-amber-400',
  error: 'text-red-400',
} as const;

const LEVEL_PREFIX = {
  info: '[INFO]',
  warn: '[WARN]',
  error: '[ERR!]',
} as const;

// ─── MemoInput ───────────────────────────────────────────────────────────────

interface MemoInputProps {
  onSend: (entry: LogEntry) => void;
}

function MemoInput({ onSend }: MemoInputProps) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSending(true);
    try {
      const res = await fetch('http://localhost:3001/api/logs/memo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      if (res.ok) {
        const entry: LogEntry = await res.json();
        onSend(entry);
        setText('');
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex gap-2 mt-3 pt-3 border-t border-white/8">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메모를 입력하세요..."
        className="flex-1 bg-[#0a0e1a] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-[Outfit] text-[#e2e8f0] placeholder:text-[#4a5568] outline-none focus:border-[#0ff0a0]/50 transition-colors"
      />
      <button
        onClick={handleSend}
        disabled={sending || !text.trim()}
        className="bg-[#0ff0a0] text-[#0a0e1a] font-semibold rounded-lg px-4 py-1.5 text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        전송
      </button>
    </div>
  );
}

// ─── LogChannel ──────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function LogChannel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    fetch('http://localhost:3001/api/logs')
      .then(res => res.json())
      .then((data: LogEntry[]) => {
        setLogs(data.slice(-100));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // SSE stream
  useEffect(() => {
    const es = new EventSource('http://localhost:3001/api/logs/stream');

    es.onmessage = (e: MessageEvent) => {
      try {
        const entry: LogEntry = JSON.parse(e.data);
        setLogs(prev => {
          const next = [...prev, entry];
          return next.slice(-100);
        });
      } catch {
        // ignore malformed events
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, []);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleMemoSend = (entry: LogEntry) => {
    setLogs(prev => {
      const next = [...prev, entry];
      return next.slice(-100);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 font-[DM_Mono]">
        {loading ? (
          <div className="text-[#64748b] text-xs py-4 text-center">로그 불러오는 중...</div>
        ) : logs.length === 0 ? (
          <div className="text-[#64748b] text-xs py-4 text-center">로그가 없습니다.</div>
        ) : (
          logs.map(log => (
            <div
              key={log.id}
              data-testid="log-entry"
              className="flex gap-2 text-xs py-0.5 hover:bg-white/5 rounded px-1 transition-colors"
            >
              <span className="text-[#4a5568] shrink-0 tabular-nums">
                {formatTime(log.timestamp)}
              </span>
              <span className={`shrink-0 font-medium ${LEVEL_COLORS[log.level]}`}>
                {LEVEL_PREFIX[log.level]}
              </span>
              <span className="text-[#94a3b8] truncate">
                <span className="text-[#64748b]">[{log.agentName}]</span>{' '}
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <MemoInput onSend={handleMemoSend} />
    </div>
  );
}
