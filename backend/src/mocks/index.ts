import { Agent, Task, LogEntry, Strategy } from '../types/index';

// ─── Agents (11 from agent-team.md) ─────────────────────────────────────────

export const mockAgents: Agent[] = [
  {
    id: 'classifier',
    name: '작업 분류기',
    role: 'Classifier',
    status: 'idle',
    description: '새 요청을 적절한 에이전트 유형으로 분류한다.',
  },
  {
    id: 'status-summarizer',
    name: '상태 요약자',
    role: 'Summarizer',
    status: 'running',
    description: '여러 에이전트의 진행 상황을 짧게 압축한다.',
  },
  {
    id: 'notifier',
    name: '알림 전달자',
    role: 'Notifier',
    status: 'idle',
    description: '완료·실패·지연 이벤트를 적절한 대상에게 전달한다.',
  },
  {
    id: 'orchestrator',
    name: '오케스트레이터',
    role: 'Orchestrator',
    status: 'running',
    description: '요청을 분해하고 적절한 에이전트에게 배분한다.',
  },
  {
    id: 'planner',
    name: '플래너',
    role: 'Planner',
    status: 'running',
    description: '목표를 실행 가능한 단계로 나눈다.',
  },
  {
    id: 'researcher',
    name: '리서처',
    role: 'Researcher',
    status: 'idle',
    description: '필요한 맥락, 패턴, 참고 사례를 수집한다.',
  },
  {
    id: 'implementer',
    name: '구현 에이전트',
    role: 'Implementer',
    status: 'idle',
    description: '계획에 따라 실제 코드·설정·문서를 만든다.',
  },
  {
    id: 'tdd-agent',
    name: 'TDD 에이전트',
    role: 'TDD',
    status: 'idle',
    description: '구현을 검증할 테스트 초안을 작성한다.',
  },
  {
    id: 'code-reviewer',
    name: '코드 리뷰어',
    role: 'Reviewer',
    status: 'idle',
    description: '변경 내용을 비판적으로 검토한다.',
  },
  {
    id: 'qa-agent',
    name: 'QA 에이전트',
    role: 'QA',
    status: 'error',
    description: '실제 사용자 관점에서 결과를 검증한다.',
  },
  {
    id: 'observer',
    name: '운영 관찰자',
    role: 'Observer',
    status: 'idle',
    description: '실행 중인 에이전트의 상태와 병목을 감시한다.',
  },
];

// ─── Tasks (8 items, all 4 statuses covered) ────────────────────────────────

export const mockTasks: Task[] = [
  {
    id: 'task-001',
    summary: '요청 분류 및 에이전트 라우팅 설계',
    status: 'completed',
    assignedAgent: 'classifier',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'task-002',
    summary: '대시보드 API 엔드포인트 구현',
    status: 'completed',
    assignedAgent: 'implementer',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'task-003',
    summary: '에이전트 상태 모니터링 로직 개발',
    status: 'in_progress',
    assignedAgent: 'orchestrator',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'task-004',
    summary: '작업 큐 우선순위 정책 수립',
    status: 'in_progress',
    assignedAgent: 'planner',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'task-005',
    summary: 'SSE 스트리밍 연결 안정성 테스트',
    status: 'in_progress',
    assignedAgent: 'tdd-agent',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    id: 'task-006',
    summary: '실시간 로그 채널 코드 리뷰',
    status: 'pending',
    assignedAgent: 'code-reviewer',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'task-007',
    summary: '전략 체크리스트 UI 검증',
    status: 'pending',
    assignedAgent: 'qa-agent',
    createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
  },
  {
    id: 'task-008',
    summary: 'QA 에이전트 오류 복구 재시도',
    status: 'failed',
    assignedAgent: 'qa-agent',
    createdAt: new Date(Date.now() - 3600000 * 0.25).toISOString(),
  },
];

// ─── Logs (10 initial entries) ───────────────────────────────────────────────

export const mockLogs: LogEntry[] = [
  {
    id: 'log-001',
    agentId: 'orchestrator',
    agentName: '오케스트레이터',
    message: '새 작업 수신: 대시보드 API 구현 요청',
    level: 'info',
    timestamp: new Date(Date.now() - 60000 * 10).toISOString(),
  },
  {
    id: 'log-002',
    agentId: 'classifier',
    agentName: '작업 분류기',
    message: '작업 분류 완료 → implementer 배정',
    level: 'info',
    timestamp: new Date(Date.now() - 60000 * 9).toISOString(),
  },
  {
    id: 'log-003',
    agentId: 'planner',
    agentName: '플래너',
    message: '실행 계획 수립 중: Wave 3 병렬 태스크 5개',
    level: 'info',
    timestamp: new Date(Date.now() - 60000 * 8).toISOString(),
  },
  {
    id: 'log-004',
    agentId: 'implementer',
    agentName: '구현 에이전트',
    message: "backend/src/routes/agents.ts 작성 시작",
    level: 'info',
    timestamp: new Date(Date.now() - 60000 * 7).toISOString(),
  },
  {
    id: 'log-005',
    agentId: 'status-summarizer',
    agentName: '상태 요약자',
    message: '현재 진행률: 2/10 태스크 완료',
    level: 'info',
    timestamp: new Date(Date.now() - 60000 * 6).toISOString(),
  },
  {
    id: 'log-006',
    agentId: 'observer',
    agentName: '운영 관찰자',
    message: '메모리 사용량 정상 범위 유지 중',
    level: 'info',
    timestamp: new Date(Date.now() - 60000 * 5).toISOString(),
  },
  {
    id: 'log-007',
    agentId: 'qa-agent',
    agentName: 'QA 에이전트',
    message: '테스트 실행 중 타임아웃 발생 — 재시도 예정',
    level: 'warn',
    timestamp: new Date(Date.now() - 60000 * 4).toISOString(),
  },
  {
    id: 'log-008',
    agentId: 'orchestrator',
    agentName: '오케스트레이터',
    message: '병렬 Wave 3 실행 시작 (5 agents)',
    level: 'info',
    timestamp: new Date(Date.now() - 60000 * 3).toISOString(),
  },
  {
    id: 'log-009',
    agentId: 'qa-agent',
    agentName: 'QA 에이전트',
    message: 'task-008 실패: 예외 처리 로직 누락 확인',
    level: 'error',
    timestamp: new Date(Date.now() - 60000 * 2).toISOString(),
  },
  {
    id: 'log-010',
    agentId: 'status-summarizer',
    agentName: '상태 요약자',
    message: '경고: qa-agent 연속 2회 실패 감지',
    level: 'warn',
    timestamp: new Date(Date.now() - 60000 * 1).toISOString(),
  },
];

// ─── Random Log Generator (for SSE streaming) ────────────────────────────────

const LOG_TEMPLATES = [
  { agentId: 'orchestrator', agentName: '오케스트레이터', messages: ['작업 큐 처리 중', '새 요청 라우팅 완료', '에이전트 상태 확인 중'], level: 'info' as const },
  { agentId: 'planner', agentName: '플래너', messages: ['계획 단계 업데이트', '의존성 그래프 재계산', '다음 Wave 준비 완료'], level: 'info' as const },
  { agentId: 'implementer', agentName: '구현 에이전트', messages: ['파일 작성 완료', '코드 생성 중', '구현 단계 진행 중'], level: 'info' as const },
  { agentId: 'observer', agentName: '운영 관찰자', messages: ['시스템 메트릭 수집', '응답 시간 정상', '리소스 사용량 점검'], level: 'info' as const },
  { agentId: 'status-summarizer', agentName: '상태 요약자', messages: ['진행률 업데이트', '에이전트 상태 요약 완료'], level: 'info' as const },
  { agentId: 'qa-agent', agentName: 'QA 에이전트', messages: ['테스트 케이스 실행 중', '재시도 중...'], level: 'warn' as const },
];

let logCounter = 100;

export function generateRandomLog(): LogEntry {
  const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
  const message = template.messages[Math.floor(Math.random() * template.messages.length)];
  logCounter++;
  return {
    id: `log-${String(logCounter).padStart(3, '0')}`,
    agentId: template.agentId,
    agentName: template.agentName,
    message,
    level: template.level,
    timestamp: new Date().toISOString(),
  };
}

// ─── Strategies (2 options) ──────────────────────────────────────────────────

export const mockStrategies: Strategy[] = [
  {
    id: 'committee',
    name: '위원회형',
    description: '여러 에이전트가 합의하여 결정한다. 오류 가능성을 낮추지만 속도가 느리다.',
    checked: false,
  },
  {
    id: 'leader',
    name: '리더형',
    description: '오케스트레이터가 모든 에이전트에게 지시한다. 빠르지만 단일 실패 지점이 생긴다.',
    checked: false,
  },
];
