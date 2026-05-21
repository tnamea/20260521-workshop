import AgentGrid from './components/AgentCard';
import TaskList from './components/TaskList';
import LogChannel from './components/LogChannel';
import StrategyChecklist from './components/StrategyChecklist';

interface PanelProps {
  title: string;
  children: React.ReactNode;
}

function Panel({ title, children }: PanelProps) {
  return (
    <div className="bg-[#111827] border border-white/8 rounded-2xl p-4 shadow-xl shadow-black/50 overflow-hidden flex flex-col">
      <h2 className="font-[Syne] text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-3 shrink-0">
        {title}
      </h2>
      <div className="flex-1 overflow-auto min-h-0">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0a0e1a] to-[#0f172a]">
      {/* Header */}
      <header className="mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-[#0ff0a0] rounded-full shadow-[0_0_12px_rgba(15,240,160,0.6)]" />
        <h1 className="font-[Syne] text-xl font-bold text-[#e2e8f0] tracking-tight">
          Agent Orchestration{' '}
          <span className="text-[#0ff0a0]">Control</span>
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-[DM_Mono] text-[#64748b]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0ff0a0] shadow-[0_0_6px_rgba(15,240,160,0.8)]" />
            LIVE
          </span>
        </div>
      </header>

      {/* 2x2 Grid */}
      <div
        className="grid grid-cols-2 gap-4"
        style={{ height: 'calc(100vh - 120px)' }}
      >
        {/* Top-left: Agent Status */}
        <Panel title="에이전트 상태">
          <AgentGrid />
        </Panel>

        {/* Top-right: Strategy */}
        <Panel title="모델 전략">
          <StrategyChecklist />
        </Panel>

        {/* Bottom-left: Task List */}
        <Panel title="작업 목록">
          <TaskList />
        </Panel>

        {/* Bottom-right: Log Channel */}
        <Panel title="실행 로그">
          <LogChannel />
        </Panel>
      </div>
    </div>
  );
}
