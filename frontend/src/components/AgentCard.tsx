import { useEffect, useState } from 'react';
import type { Agent, AgentStatus } from '../types/index';

// ─── Status Badge ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<AgentStatus, string> = {
  idle: 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50',
  running: 'bg-amber-900/30 text-amber-400 border border-amber-800/50 status-running',
  error: 'bg-red-900/30 text-red-400 border border-red-800/50',
};

const STATUS_LABELS: Record<AgentStatus, string> = {
  idle: 'idle',
  running: 'running',
  error: 'error',
};

// ─── AgentCard ───────────────────────────────────────────────────────────────

interface AgentCardProps {
  agent: Agent;
}

function AgentCard({ agent }: AgentCardProps) {
  return (
    <div
      data-testid="agent-card"
      className="rounded-xl p-4 border bg-[#111827] border-white/8 shadow-lg shadow-black/50 flex flex-col gap-2"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-[Syne] font-semibold text-[#e2e8f0] text-sm leading-tight truncate">
            {agent.name}
          </div>
          <div className="font-[DM_Mono] text-xs text-[#64748b] mt-0.5">
            {agent.role}
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-[DM_Mono] font-medium shrink-0 ${STATUS_STYLES[agent.status]}`}
        >
          {STATUS_LABELS[agent.status]}
        </span>
      </div>
      <p className="text-xs text-[#64748b] font-[Outfit] leading-relaxed line-clamp-2">
        {agent.description}
      </p>
    </div>
  );
}

// ─── AgentGrid ───────────────────────────────────────────────────────────────

export default function AgentGrid() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/agents')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Agent[]) => {
        setAgents(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-[#64748b] font-[DM_Mono] text-sm">
        에이전트 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-red-400 font-[DM_Mono] text-sm">
        에이전트 목록을 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
