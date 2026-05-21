import { useEffect, useState } from 'react';
import type { Task, TaskStatus } from '../types/index';

const STATUS_STYLES: Record<TaskStatus, string> = {
  pending: 'bg-slate-800 text-slate-400 border border-slate-700',
  in_progress: 'bg-blue-900/30 text-blue-400 border border-blue-800/50',
  completed: 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50',
  failed: 'bg-red-900/30 text-red-400 border border-red-800/50',
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: '대기',
  in_progress: '진행 중',
  completed: '완료',
  failed: '실패',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/tasks')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Task[]) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24 text-[#64748b] font-[DM_Mono] text-sm">
        작업 목록 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-24 text-red-400 font-[DM_Mono] text-sm">
        작업 목록을 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-[DM_Mono]">
        <thead>
          <tr className="border-b border-white/8">
            <th className="text-left text-xs text-[#64748b] uppercase tracking-wider py-2 pr-3 font-medium">
              요약
            </th>
            <th className="text-left text-xs text-[#64748b] uppercase tracking-wider py-2 pr-3 font-medium">
              상태
            </th>
            <th className="text-left text-xs text-[#64748b] uppercase tracking-wider py-2 pr-3 font-medium">
              담당
            </th>
            <th className="text-left text-xs text-[#64748b] uppercase tracking-wider py-2 font-medium">
              시간
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr
              key={task.id}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-2 pr-3 text-[#e2e8f0] text-xs max-w-[160px] truncate">
                {task.summary}
              </td>
              <td className="py-2 pr-3">
                <span
                  data-testid="task-status"
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[task.status]}`}
                >
                  {STATUS_LABELS[task.status]}
                </span>
              </td>
              <td className="py-2 pr-3 text-[#64748b] text-xs">
                {task.assignedAgent}
              </td>
              <td className="py-2 text-[#4a5568] text-xs">
                {formatDate(task.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
