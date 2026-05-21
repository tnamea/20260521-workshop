import { useEffect, useState } from 'react';
import type { Strategy } from '../types/index';

export default function StrategyChecklist() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/strategies')
      .then(res => res.json())
      .then((data: Strategy[]) => {
        setStrategies(data);
        const initial: Record<string, boolean> = {};
        data.forEach(s => { initial[s.id] = false; });
        setChecked(initial);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24 text-[#64748b] font-[DM_Mono] text-sm">
        전략 불러오는 중...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {strategies.map(strategy => {
        const isChecked = checked[strategy.id] ?? false;
        return (
          <div
            key={strategy.id}
            data-testid="strategy-item"
            onClick={() => toggle(strategy.id)}
            className={[
              'rounded-xl p-4 border transition-all cursor-pointer select-none',
              isChecked
                ? 'border-[#0ff0a0] bg-[#0ff0a0]/5 shadow-[0_0_20px_rgba(15,240,160,0.08)]'
                : 'border-white/8 bg-[#111827] hover:border-white/20',
            ].join(' ')}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(strategy.id)}
                onClick={e => e.stopPropagation()}
                className="mt-1 w-4 h-4 accent-[#0ff0a0] cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className={[
                  'font-[Syne] font-semibold text-sm leading-tight',
                  isChecked ? 'text-[#0ff0a0]' : 'text-[#e2e8f0]',
                ].join(' ')}>
                  {strategy.name}
                </div>
                <div className="text-xs text-[#64748b] font-[Outfit] mt-1.5 leading-relaxed">
                  {strategy.description}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
