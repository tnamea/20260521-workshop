export type AgentStatus = 'idle' | 'running' | 'error';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  description: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface Task {
  id: string;
  summary: string;
  status: TaskStatus;
  assignedAgent: string;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  agentId: string;
  agentName: string;
  message: string;
  level: 'info' | 'warn' | 'error';
  timestamp: string;
}

export type StrategyType = 'committee' | 'leader';

export interface Strategy {
  id: StrategyType;
  name: string;
  description: string;
  checked: boolean;
}
