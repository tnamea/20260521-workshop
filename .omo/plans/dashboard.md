# 멀티 에이전트 오케스트레이션 관리 대시보드

## TL;DR

> **Quick Summary**: React + Node.js로 11개 에이전트의 상태, 작업, 로그, 전략을 한 화면에서 관리하는 멀티 에이전트 오케스트레이션 대시보드를 Mock 데이터 기반으로 구축한다. "Mission Control" 다크 테마, 각 태스크는 10분 내 수행 가능한 단일 관심사 단위.
>
> **Deliverables**:
> - `frontend/` — Vite + React 18 + TypeScript + Tailwind CSS v4 앱
> - `backend/` — Express + TypeScript REST API + SSE 스트리밍
> - 4개 UI 패널: 에이전트 카드 그리드, 작업 상태 목록, 로그/메모 채널, 전략 체크리스트
> - Mission Control 다크 테마 (Syne + DM Mono 폰트, teal 액센트)
>
> **Estimated Effort**: Medium (10개 구현 태스크 + 4개 최종 검증)
> **Parallel Execution**: YES — 4개 Wave
> **Critical Path**: T1(10분) → T3(10분) → T6~T9(10분) → T10(10분) = 40분

---

## Context

### Original Request
멀티 에이전트 오케스트레이션 관리 대시보드 (React + Node.js). 10~20분 단위 계획. 소형 모델 친화. 총 구현 시간 35~40분. 깔끔하고 심플하고 멋진 디자인.

### Interview Summary
- Stack: Vite + React 18 + TypeScript / Express + TypeScript
- Layout: 2×2 그리드 (좌상: 에이전트, 우상: 전략, 좌하: 작업, 우하: 로그)
- 전략 체크리스트: 독립 체크박스, 새로고침 시 초기화
- 로그: SSE 스트리밍 + 사용자 메모 추가
- 에이전트 수: 11개, 작업 수: 8개, 로그 최대: 100개
- 테스트: 없음, Playwright QA

### Design Direction (frontend-design skill 기반)
- **Aesthetic Tone**: Industrial Utilitarian — "Mission Control" / 우주 관제 센터
- **Color Palette**:
  - Background: `#0a0e1a` (deep navy-black)
  - Card surface: `#111827` (dark slate)
  - Border: `rgba(255,255,255,0.08)` (subtle glass border)
  - Accent: `#0ff0a0` (neon teal) — status, active elements
  - Text primary: `#e2e8f0`
  - Text muted: `#64748b`
- **Typography**:
  - 헤딩: `Syne` (Google Fonts — geometric, distinctive)
  - 데이터/상태: `DM Mono` (monospace — terminal feel)
  - 본문: `Outfit` (clean, modern)
- **Status Colors**:
  - idle: `#10b981` (emerald) with `bg-emerald-900/30`
  - running: `#f59e0b` (amber) with pulsing animation
  - error: `#ef4444` (red) with `bg-red-900/30`
- **Visual Effects**:
  - Cards: `shadow-lg shadow-black/50`, `border border-white/8`
  - Running 상태: `@keyframes pulse` 애니메이션
  - 레이아웃: `bg-gradient-to-br from-[#0a0e1a] to-[#0f172a]`

### Metis/Oracle Review Summary
- Tailwind v4 설치 방식 명시 필요 (`@tailwindcss/vite`)
- 단일 관심사 원칙 (T3/T5/T10은 밀접한 파일 묶음)
- PATCH 엔드포인트 금지 (읽기 전용)
- F1~F4 구체적 수락 기준 필요

---

## Work Objectives

### Core Objective
React + Node.js로 11개 에이전트의 상태·작업·로그·전략을 한 화면에서 관리하는 Mission Control 다크 테마 오케스트레이션 대시보드를 Mock 데이터 기반으로 구축한다.

### Concrete Deliverables
- `frontend/src/components/AgentCard.tsx` — 에이전트 카드 + AgentGrid
- `frontend/src/components/TaskList.tsx` — 작업 상태 목록
- `frontend/src/components/LogChannel.tsx` — 로그/메모 채널
- `frontend/src/components/StrategyChecklist.tsx` — 전략 체크리스트
- `frontend/src/App.tsx` — 2×2 대시보드 레이아웃
- `backend/src/index.ts` — Express 서버 (포트 3001)
- `backend/src/routes/` — API 라우터 4종

### Definition of Done
- [ ] `npm run dev` (루트) → frontend:5173 + backend:3001 동시 실행
- [ ] 브라우저에서 4개 패널, Mission Control 다크 테마 확인
- [ ] `GET /api/agents` → 11개 반환
- [ ] SSE 로그 스트리밍, 메모 전송 동작

### Must Have
- 4개 패널 (에이전트/작업/로그/전략) 2×2 그리드
- Mission Control 다크 테마 (Syne + DM Mono 폰트)
- 에이전트 상태 색상 구분 (idle/running/error)
- running 상태 펄스 애니메이션
- SSE 로그 스트리밍 + 메모 입력 전송
- 전략 체크박스 토글

### Must NOT Have (Guardrails)
- 실제 AI API 연동, 인증, DB, 배포 코드
- 에이전트 카드 클릭 모달/편집 폼
- 작업 CRUD (읽기 전용만)
- `tailwind.config.js` 파일 (v4 금지)
- localStorage 저장
- PATCH/POST/DELETE 작업 관련 엔드포인트
- 필터링, 검색, 성공률 통계 기능
- 배정된 파일 외 다른 파일 수정

---

## 전체 디렉토리 구조 (고정)

```
20260521-workshop/
├── frontend/
│   ├── index.html                ← Google Fonts import
│   ├── package.json
│   ├── vite.config.ts            ← @tailwindcss/vite 플러그인
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx
│       ├── index.css             ← @import "tailwindcss" + CSS 변수
│       ├── types/
│       │   └── index.ts
│       ├── components/
│       │   ├── AgentCard.tsx     ← AgentCard + AgentGrid 둘 다
│       │   ├── TaskList.tsx
│       │   ├── LogChannel.tsx    ← LogChannel + MemoInput 둘 다
│       │   └── StrategyChecklist.tsx
│       └── App.tsx
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts              ← Express 서버 + 라우터 등록
│       ├── types/
│       │   └── index.ts
│       ├── mocks/
│       │   └── index.ts          ← 4종 목 데이터 통합 (agents, tasks, logs, strategies)
│       └── routes/
│           ├── agents.ts
│           ├── tasks.ts
│           ├── logs.ts
│           └── strategies.ts
└── package.json                  ← concurrently 워크스페이스
```

---

## Verification Strategy

- **Automated tests**: None
- **Agent-Executed QA**: YES — Playwright (UI), curl (API)
- Evidence path: `.omo/evidence/`

---

## Execution Strategy

### Parallel Execution Waves (총 40분 크리티컬 패스)

```
Wave 1 (즉시 병렬 — 10분):
├── T1: frontend 전체 스캐폴딩 [quick, 10분]
└── T2: backend 전체 스캐폴딩 [quick, 10분]

Wave 2 (T1+T2 완료 후 병렬 — 10분):
├── T3: 공유 타입 + Tailwind CSS 설정 [quick, 10분]
└── T4: 목 데이터 통합 파일 [quick, 10분]

Wave 3 (T3+T4 완료 후 병렬 — 10분):
├── T5:  모든 API 라우터 + 서버 등록 [unspecified-low, 10분]
├── T6:  AgentCard + AgentGrid 컴포넌트 [visual-engineering, 10분]
├── T7:  TaskList 컴포넌트 [visual-engineering, 10분]
├── T8:  LogChannel + MemoInput 컴포넌트 [visual-engineering, 10분]
└── T9:  StrategyChecklist 컴포넌트 [visual-engineering, 10분]

Wave 4 (T5~T9 완료 후 — 10분):
└── T10: App.tsx 2×2 레이아웃 + concurrently 설정 [visual-engineering, 10분]

Wave FINAL (T10 완료 후 — 병렬):
├── F1: 계획 준수 감사 [oracle]
├── F2: 코드 품질 검토 [unspecified-high]
├── F3: Playwright QA [unspecified-high + playwright]
└── F4: 범위 충실도 [deep]

크리티컬 패스: T1(10) → T3(10) → T6~T9(10) → T10(10) = 40분
백엔드 패스:   T2(10) → T4(10) → T5(10) → T10(10) = 40분
```

### Agent Dispatch Summary

| Wave | 태스크 | 에이전트 | 동시 실행 |
|------|--------|---------|----------|
| 1 | T1, T2 | `quick` × 2 | 2 |
| 2 | T3, T4 | `quick` × 2 | 2 |
| 3 | T5~T9 | `unspecified-low` + `visual-engineering` × 4 | 5 |
| 4 | T10 | `visual-engineering` | 1 |
| Final | F1~F4 | `oracle`, `unspecified-high` × 2, `deep` | 4 |

---

## TODOs

> **단일 관심사 원칙**: 각 태스크는 하나의 관심사(컴포넌트, API 레이어, 설정)만 다룬다. T3(타입+CSS), T5(라우터들), T10(App+설정)처럼 밀접한 파일은 묶인다. 범위를 벗어난 파일 수정은 금지.
> **디자인 원칙**: 모든 UI 태스크는 "Mission Control 다크 테마" 스타일 가이드를 따른다.

- [x] 1. frontend 전체 스캐폴딩

  **What to do**:
  - `frontend/` 에서 `npm create vite@latest . -- --template react-ts` 실행
  - 생성된 `frontend/src/App.css`, `frontend/src/assets/`, `frontend/src/App.tsx` 삭제 (App.tsx는 T10에서 새로 작성)
  - `frontend/package.json`에 Tailwind v4 의존성 추가: `npm install -D tailwindcss @tailwindcss/vite`
  - `frontend/vite.config.ts` 업데이트:
    ```typescript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import tailwindcss from '@tailwindcss/vite'
    export default defineConfig({ plugins: [react(), tailwindcss()] })
    ```
  - `frontend/index.html` `<head>`에 Google Fonts 추가:
    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">
    ```
  - `frontend/src/main.tsx` 내용: `import './index.css'` + `ReactDOM.createRoot(...).render(<App />)` (App은 나중에 추가)

  **Must NOT do**:
  - `tailwind.config.js` 생성 금지
  - 의존성 외 다른 파일 수정 금지
  - App.tsx 완성하지 말 것 (T10에서 작성)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (T2와 병렬)
  - **Parallel Group**: Wave 1
  - **Blocks**: T3
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] `frontend/vite.config.ts`에 `tailwindcss()` 플러그인 포함
  - [ ] `frontend/index.html`에 Syne, DM Mono, Outfit 폰트 링크 포함
  - [ ] `cd frontend && npm install` 성공

  **QA Scenarios**:
  ```
  Scenario: 빌드 성공 확인
    Tool: Bash
    Steps:
      1. cd frontend && npm install && npm run build 2>&1
    Expected Result: dist/ 폴더 생성, 에러 없음
    Evidence: .omo/evidence/task-1-build.txt
  ```

  **Commit**: NO

- [x] 2. backend 전체 스캐폴딩

  **What to do**:
  - `backend/` 디렉토리 생성
  - `backend/package.json` 생성:
    ```json
    {
      "name": "dashboard-backend",
      "scripts": { "dev": "tsx watch src/index.ts", "build": "tsc" },
      "dependencies": { "express": "^4.18.0", "cors": "^2.8.5" },
      "devDependencies": { "typescript": "^5.0.0", "tsx": "^4.0.0", "@types/express": "^4.17.0", "@types/cors": "^2.8.0", "@types/node": "^20.0.0" }
    }
    ```
  - `backend/tsconfig.json` 생성: `target: ES2020`, `module: commonjs`, `strict: false`, `outDir: dist`, `rootDir: src`
  - `backend/src/index.ts` 생성:
    ```typescript
    import express from 'express';
    import cors from 'cors';
    const app = express();
    app.use(cors({ origin: 'http://localhost:5173' }));
    app.use(express.json());
    app.get('/health', (_, res) => res.json({ status: 'ok' }));
    app.listen(3001, () => console.log('Server running on port 3001'));
    export default app;
    ```
  - `backend/src/types/`, `backend/src/mocks/`, `backend/src/routes/` 디렉토리 생성 (빈 상태)

  **Must NOT do**:
  - 라우터 등록 금지 (T5에서 처리)
  - DB 연결 코드 추가 금지

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (T1과 병렬)
  - **Parallel Group**: Wave 1
  - **Blocks**: T4
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] `backend/src/index.ts` 존재, 포트 3001 리슨
  - [ ] `cd backend && npm install` 성공
  - [ ] `cd backend && npm run dev` → "Server running on port 3001" 출력

  **QA Scenarios**:
  ```
  Scenario: 헬스체크
    Tool: Bash (curl)
    Steps:
      1. cd backend && npm run dev &
      2. sleep 2 && curl http://localhost:3001/health
    Expected Result: {"status":"ok"}
    Evidence: .omo/evidence/task-2-health.txt
  ```

  **Commit**: NO

- [x] 3. 공유 타입 + Tailwind CSS 설정

  **What to do**:
  - **파일 1**: `frontend/src/types/index.ts` 생성:
    ```typescript
    export type AgentStatus = 'idle' | 'running' | 'error';
    export interface Agent {
      id: string; name: string; role: string;
      status: AgentStatus; description: string;
    }
    export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
    export interface Task {
      id: string; summary: string; status: TaskStatus;
      assignedAgent: string; createdAt: string;
    }
    export interface LogEntry {
      id: string; agentId: string; agentName: string;
      message: string; level: 'info' | 'warn' | 'error'; timestamp: string;
    }
    export type StrategyType = 'committee' | 'leader';
    export interface Strategy {
      id: StrategyType; name: string; description: string; checked: boolean;
    }
    ```
  - **파일 2**: `backend/src/types/index.ts` — 동일 내용 복사
  - **파일 3**: `frontend/src/index.css` 생성:
    ```css
    @import "tailwindcss";

    :root {
      --color-bg: #0a0e1a;
      --color-surface: #111827;
      --color-border: rgba(255, 255, 255, 0.08);
      --color-accent: #0ff0a0;
      --color-text: #e2e8f0;
      --color-muted: #64748b;
      --font-heading: 'Syne', sans-serif;
      --font-mono: 'DM Mono', monospace;
      --font-body: 'Outfit', sans-serif;
    }

    body {
      background-color: var(--color-bg);
      color: var(--color-text);
      font-family: var(--font-body);
    }

    @keyframes pulse-ring {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .status-running {
      animation: pulse-ring 1.5s ease-in-out infinite;
    }
    ```

  **Must NOT do**:
  - `tailwind.config.js` 생성 금지
  - CSS 변수 외 추가 스타일 작성 금지 (컴포넌트별 스타일은 각 컴포넌트에서)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (T4와 병렬, T1 완료 후)
  - **Parallel Group**: Wave 2
  - **Blocks**: T5, T6, T7, T8, T9
  - **Blocked By**: T1, T2

  **Acceptance Criteria**:
  - [ ] `frontend/src/types/index.ts` — 4개 인터페이스 포함
  - [ ] `backend/src/types/index.ts` — 동일 내용
  - [ ] `frontend/src/index.css` — `@import "tailwindcss"` 첫 줄, CSS 변수 포함

  **QA Scenarios**:
  ```
  Scenario: TypeScript 타입 검증
    Tool: Bash
    Steps:
      1. cd frontend && npx tsc --noEmit 2>&1
    Expected Result: 에러 없음 (또는 App.tsx 없음 에러만)
    Evidence: .omo/evidence/task-3-tsc.txt
  ```

  **Commit**: NO

- [x] 4. 목 데이터 통합 파일

  **What to do**:
  - `backend/src/mocks/index.ts` 단일 파일에 모든 목 데이터 작성
  - **에이전트 11개** (agent-team.md 기준):
    ```typescript
    import { Agent, Task, LogEntry, Strategy } from '../types/index';

    export const mockAgents: Agent[] = [
      { id: 'classifier', name: '작업 분류기', role: 'Classifier', status: 'idle', description: '새 요청을 적절한 에이전트 유형으로 분류한다.' },
      { id: 'status-summarizer', name: '상태 요약자', role: 'Summarizer', status: 'running', description: '여러 에이전트의 진행 상황을 압축한다.' },
      { id: 'notifier', name: '알림 전달자', role: 'Notifier', status: 'idle', description: '이벤트를 적절한 대상에게 전달한다.' },
      { id: 'orchestrator', name: '오케스트레이터', role: 'Orchestrator', status: 'running', description: '요청을 분해하고 에이전트에게 배분한다.' },
      { id: 'planner', name: '플래너', role: 'Planner', status: 'running', description: '목표를 실행 가능한 단계로 나눈다.' },
      { id: 'researcher', name: '리서처', role: 'Researcher', status: 'idle', description: '필요한 맥락과 참고 사례를 수집한다.' },
      { id: 'implementer', name: '구현 에이전트', role: 'Implementer', status: 'idle', description: '계획에 따라 실제 산출물을 만든다.' },
      { id: 'tdd-agent', name: 'TDD 에이전트', role: 'TDD', status: 'idle', description: '구현을 검증할 테스트 초안을 만든다.' },
      { id: 'code-reviewer', name: '코드 리뷰어', role: 'Reviewer', status: 'idle', description: '변경 내용을 비판적으로 검토한다.' },
      { id: 'qa-agent', name: 'QA 에이전트', role: 'QA', status: 'error', description: '실제 사용자 관점에서 결과를 검증한다.' },
      { id: 'observer', name: '운영 관찰자', role: 'Observer', status: 'idle', description: '실행 중인 에이전트의 상태와 병목을 감시한다.' },
    ];
    ```
  - **작업 8개**: pending 2, in_progress 3, completed 2, failed 1
  - **로그 10개**: info 7, warn 2, error 1 + `generateRandomLog()` 함수
  - **전략 2개**: committee(위원회형), leader(리더형), 각 checked: false
  - 모두 `export const` 로 내보내기

  **Must NOT do**:
  - 파일을 분리하지 말 것 (4종 데이터 모두 이 파일 하나에)
  - routes/ 파일 건드리지 말 것

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (T3와 병렬)
  - **Parallel Group**: Wave 2
  - **Blocks**: T5
  - **Blocked By**: T2, T3

  **References**:
  - `agent-team.md` — 11개 에이전트 이름/역할

  **Acceptance Criteria**:
  - [ ] `backend/src/mocks/index.ts` 존재
  - [ ] `mockAgents.length === 11`
  - [ ] `mockTasks.length === 8`, 4가지 status 모두 포함
  - [ ] `generateRandomLog()` 함수 export 됨

  **QA Scenarios**:
  ```
  Scenario: 목 데이터 유효성
    Tool: Bash
    Steps:
      1. cd backend && node -e "const m=require('./src/mocks/index'); console.log(m.mockAgents.length, m.mockTasks.length, m.mockStrategies.length)"
    Expected Result: 11 8 2
    Evidence: .omo/evidence/task-4-mocks.txt
  ```

  **Commit**: NO

- [x] 5. 모든 API 라우터 + 서버 등록

  **What to do**:
  - **파일 1**: `backend/src/routes/agents.ts`
    ```typescript
    import { Router } from 'express';
    import { mockAgents } from '../mocks/index';
    const router = Router();
    router.get('/', (_, res) => res.json(mockAgents));
    router.get('/:id', (req, res) => {
      const agent = mockAgents.find(a => a.id === req.params.id);
      agent ? res.json(agent) : res.status(404).json({ error: 'Not found' });
    });
    export default router;
    ```
  - **파일 2**: `backend/src/routes/tasks.ts` — 동일 패턴, mockTasks, GET /와 GET /:id만
  - **파일 3**: `backend/src/routes/logs.ts`
    ```typescript
    import { Router } from 'express';
    import { mockLogs, generateRandomLog } from '../mocks/index';
    const router = Router();
    const logs = [...mockLogs];
    router.get('/', (_, res) => res.json(logs));
    router.post('/memo', (req, res) => {
      const entry = { ...generateRandomLog(), message: req.body.message, level: 'info' as const, agentId: 'user', agentName: '사용자' };
      logs.push(entry);
      res.status(201).json(entry);
    });
    router.get('/stream', (req, res) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      const interval = setInterval(() => {
        const log = generateRandomLog();
        logs.push(log);
        if (logs.length > 100) logs.shift();
        res.write(`data: ${JSON.stringify(log)}\n\n`);
      }, 15000);
      req.on('close', () => clearInterval(interval));
    });
    export default router;
    ```
  - **파일 4**: `backend/src/routes/strategies.ts` — GET / 만, mockStrategies 반환
  - **파일 5**: `backend/src/index.ts` 수정 — 라우터 등록 추가:
    ```typescript
    import agentsRouter from './routes/agents';
    import tasksRouter from './routes/tasks';
    import logsRouter from './routes/logs';
    import strategiesRouter from './routes/strategies';
    app.use('/api/agents', agentsRouter);
    app.use('/api/tasks', tasksRouter);
    app.use('/api/logs', logsRouter);
    app.use('/api/strategies', strategiesRouter);
    ```

  **Must NOT do**:
  - PATCH/PUT/DELETE 엔드포인트 추가 금지
  - tasks 변경 엔드포인트 금지 (읽기 전용)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (T6~T9와 병렬)
  - **Parallel Group**: Wave 3
  - **Blocks**: T10
  - **Blocked By**: T4

  **Acceptance Criteria**:
  - [ ] 4개 라우터 파일 + index.ts 업데이트 완료
  - [ ] `curl http://localhost:3001/api/agents` → 11개 배열 (HTTP 200)
  - [ ] `curl -I http://localhost:3001/api/logs/stream` → `Content-Type: text/event-stream`

  **QA Scenarios**:
  ```
  Scenario: 4개 API 응답 확인
    Tool: Bash (curl)
    Steps:
      1. cd backend && npm run dev &; sleep 3
      2. for ep in agents tasks strategies; do echo -n "$ep: "; curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/$ep; echo; done
    Expected Result: agents: 200 / tasks: 200 / strategies: 200
    Evidence: .omo/evidence/task-5-api-check.txt

  Scenario: SSE 헤더 확인
    Tool: Bash
    Steps:
      1. curl -s -I http://localhost:3001/api/logs/stream
    Expected Result: content-type: text/event-stream 포함
    Evidence: .omo/evidence/task-5-sse-header.txt
  ```

  **Commit**: YES (Wave 1~3 backend)
  - Message: `feat(api): scaffold backend with express routes and mock data`
  - Files: `backend/**/*`

- [x] 6. AgentCard + AgentGrid 컴포넌트

  **What to do**:
  - `frontend/src/components/AgentCard.tsx` 생성 (AgentCard + AgentGrid 모두 포함)
  - **AgentCard** (props: `agent: Agent`):
    - 카드 스타일: `rounded-xl p-4 border bg-[#111827] border-white/8 shadow-lg shadow-black/50`
    - 상단: 에이전트 이름 (`font-[Syne] font-semibold text-[#e2e8f0]`) + 역할 배지 (`font-[DM_Mono] text-xs text-[#64748b]`)
    - 상태 배지:
      - idle: `bg-emerald-900/30 text-emerald-400 border border-emerald-800/50`
      - running: `bg-amber-900/30 text-amber-400 border border-amber-800/50 status-running`
      - error: `bg-red-900/30 text-red-400 border border-red-800/50`
    - 설명: `text-sm text-[#64748b] font-[Outfit] line-clamp-2 mt-2`
  - **AgentGrid** (props 없음, 자체 fetch):
    - `useEffect` + `useState<Agent[]>` → `fetch('http://localhost:3001/api/agents')`
    - 로딩: "에이전트 불러오는 중..." (텍스트)
    - 그리드: `grid grid-cols-3 gap-3`
    - `data-testid="agent-card"` 속성 각 AgentCard에 추가

  **Must NOT do**:
  - onClick 모달/편집 금지
  - 4열 이상 그리드 금지 (3열 고정)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (T5, T7, T8, T9와 병렬)
  - **Parallel Group**: Wave 3
  - **Blocks**: T10
  - **Blocked By**: T3

  **References**:
  - `frontend/src/types/index.ts` — Agent, AgentStatus 타입
  - `frontend/src/index.css` — CSS 변수, `.status-running` 클래스

  **Acceptance Criteria**:
  - [ ] `frontend/src/components/AgentCard.tsx` 존재
  - [ ] 상태 3가지 색상 배지 포함 (emerald/amber/red)
  - [ ] running 상태에 `status-running` 클래스 적용
  - [ ] AgentGrid에 `data-testid="agent-card"` 존재

  **QA Scenarios**:
  ```
  Scenario: 에이전트 카드 렌더링
    Tool: Playwright
    Steps:
      1. await page.goto('http://localhost:5173')
      2. await page.waitForSelector('[data-testid="agent-card"]', {timeout:5000})
      3. expect(await page.locator('[data-testid="agent-card"]').count()).toBe(11)
      4. await expect(page.locator('.status-running').first()).toBeVisible()
      5. await page.screenshot({path:'.omo/evidence/task-6-agent-grid.png'})
    Expected Result: 11개 카드, running 카드 펄스 애니메이션
    Evidence: .omo/evidence/task-6-agent-grid.png
  ```

  **Commit**: NO

- [x] 7. TaskList 컴포넌트

  **What to do**:
  - `frontend/src/components/TaskList.tsx` 생성
  - `useEffect` + `useState<Task[]>` → `fetch('http://localhost:3001/api/tasks')`
  - 테이블 스타일:
    - `<table>` 전체: `w-full text-sm font-[DM_Mono]`
    - 헤더 행: `text-[#64748b] text-xs uppercase tracking-wider border-b border-white/8`
    - 데이터 행: `border-b border-white/5 hover:bg-white/5 transition-colors`
  - 컬럼: 요약, 상태, 배정 에이전트, 생성일
  - 상태 배지:
    - pending: `bg-slate-800 text-slate-400 border border-slate-700`
    - in_progress: `bg-blue-900/30 text-blue-400 border border-blue-800/50`
    - completed: `bg-emerald-900/30 text-emerald-400 border border-emerald-800/50`
    - failed: `bg-red-900/30 text-red-400 border border-red-800/50`
  - 각 배지에 `data-testid="task-status"` 속성
  - 로딩/에러 상태 처리

  **Must NOT do**:
  - 작업 생성/삭제/편집 버튼 추가 금지
  - 필터링, 정렬 기능 금지

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (T5, T6, T8, T9와 병렬)
  - **Parallel Group**: Wave 3
  - **Blocks**: T10
  - **Blocked By**: T3

  **Acceptance Criteria**:
  - [ ] `frontend/src/components/TaskList.tsx` 존재
  - [ ] 4가지 상태 색상 배지 포함
  - [ ] `data-testid="task-status"` 속성 포함

  **QA Scenarios**:
  ```
  Scenario: 작업 목록 테이블 렌더링
    Tool: Playwright
    Steps:
      1. await page.goto('http://localhost:5173')
      2. await page.waitForSelector('[data-testid="task-status"]', {timeout:5000})
      3. expect(await page.locator('[data-testid="task-status"]').count()).toBe(8)
      4. await page.screenshot({path:'.omo/evidence/task-7-task-list.png'})
    Expected Result: 8개 작업 행, 4가지 상태 색상 구분
    Evidence: .omo/evidence/task-7-task-list.png
  ```

  **Commit**: NO

- [x] 8. LogChannel + MemoInput 컴포넌트

  **What to do**:
  - `frontend/src/components/LogChannel.tsx` 생성 (LogChannel + MemoInput 모두 포함)
  - **초기 로그**: `useEffect` → `fetch('http://localhost:3001/api/logs')` → `useState<LogEntry[]>`
  - **SSE 연결**: 같은 `useEffect` 내:
    ```typescript
    const es = new EventSource('http://localhost:3001/api/logs/stream');
    es.onmessage = (e) => setLogs(prev => [...prev.slice(-99), JSON.parse(e.data)]);
    es.onerror = () => es.close();
    return () => es.close();
    ```
  - **로그 목록 스타일**:
    - 컨테이너: `overflow-y-auto max-h-56 space-y-1 pr-1`
    - 각 항목: `font-[DM_Mono] text-xs flex gap-2`
    - level 색상: info=`text-[#64748b]`, warn=`text-amber-400`, error=`text-red-400`
    - 타임스탬프: `text-[#4a5568] shrink-0`
    - `data-testid="log-entry"` 속성
  - **MemoInput** (같은 파일 하단):
    - `useState` 텍스트 상태
    - 스타일: `flex gap-2 mt-3 pt-3 border-t border-white/8`
    - 입력창: `flex-1 bg-[#0a0e1a] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-[Outfit] text-[#e2e8f0] placeholder:text-[#4a5568]`
    - 전송 버튼: `bg-[#0ff0a0] text-[#0a0e1a] font-semibold rounded-lg px-4 py-1.5 text-sm hover:brightness-110 transition-all`
    - 전송 시: `POST /api/logs/memo` → 응답을 logs 상태에 추가 → 입력창 초기화

  **Must NOT do**:
  - 로그 검색, 삭제, 내보내기 추가 금지
  - 최대 100개 제한 지키기

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (T5, T6, T7, T9와 병렬)
  - **Parallel Group**: Wave 3
  - **Blocks**: T10
  - **Blocked By**: T3

  **Acceptance Criteria**:
  - [ ] `frontend/src/components/LogChannel.tsx` 존재
  - [ ] SSE `EventSource` 연결 코드 포함
  - [ ] `data-testid="log-entry"` 속성 포함
  - [ ] 전송 버튼 `bg-[#0ff0a0]` 액센트 색상

  **QA Scenarios**:
  ```
  Scenario: 로그 표시 + 메모 전송
    Tool: Playwright
    Steps:
      1. await page.goto('http://localhost:5173')
      2. expect(await page.locator('[data-testid="log-entry"]').count()).toBeGreaterThanOrEqual(1)
      3. await page.fill('input[placeholder*="메모"]', '테스트 메모')
      4. await page.click('button:has-text("전송")')
      5. await page.waitForTimeout(500)
      6. await expect(page.locator('text=테스트 메모')).toBeVisible()
      7. await page.screenshot({path:'.omo/evidence/task-8-log-channel.png'})
    Expected Result: 로그 표시, 메모 전송 후 로그에 추가
    Evidence: .omo/evidence/task-8-log-channel.png
  ```

  **Commit**: NO

- [x] 9. StrategyChecklist 컴포넌트

  **What to do**:
  - `frontend/src/components/StrategyChecklist.tsx` 생성
  - `GET /api/strategies` fetch → `useState<Strategy[]>`
  - `useState<Record<string, boolean>>` — 체크 상태 관리 (UI 전용)
  - 각 전략 렌더링:
    ```
    <div className={`rounded-xl p-4 border transition-all cursor-pointer
      ${checked[s.id]
        ? 'border-[#0ff0a0] bg-[#0ff0a0]/5 shadow-[0_0_20px_rgba(15,240,160,0.1)]'
        : 'border-white/8 bg-[#111827]'
      }`}
    >
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={checked[s.id]} onChange={...} className="mt-1 accent-[#0ff0a0]" />
        <div>
          <div className="font-[Syne] font-semibold text-[#e2e8f0]">{s.name}</div>
          <div className="text-sm text-[#64748b] font-[Outfit] mt-1">{s.description}</div>
        </div>
      </div>
    </div>
    ```
  - 체크 시 서버 호출 없음, UI state만 업데이트
  - `data-testid="strategy-item"` 속성

  **Must NOT do**:
  - 전략 추가/삭제 금지
  - localStorage 저장 금지
  - 서버에 체크 상태 저장 금지 (PATCH 등)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (T5, T6, T7, T8과 병렬)
  - **Parallel Group**: Wave 3
  - **Blocks**: T10
  - **Blocked By**: T3

  **Acceptance Criteria**:
  - [ ] `frontend/src/components/StrategyChecklist.tsx` 존재
  - [ ] 2개 전략 카드 렌더링
  - [ ] 체크 시 `border-[#0ff0a0]` 하이라이트 토글
  - [ ] `data-testid="strategy-item"` 속성 포함

  **QA Scenarios**:
  ```
  Scenario: 전략 체크박스 토글
    Tool: Playwright
    Steps:
      1. await page.goto('http://localhost:5173')
      2. const items = page.locator('[data-testid="strategy-item"]')
      3. expect(await items.count()).toBe(2)
      4. await items.first().locator('input[type="checkbox"]').click()
      5. await expect(items.first().locator('input[type="checkbox"]')).toBeChecked()
      6. await page.screenshot({path:'.omo/evidence/task-9-strategy.png'})
    Expected Result: 체크 시 teal 하이라이트 + 체크 상태 유지
    Evidence: .omo/evidence/task-9-strategy.png
  ```

  **Commit**: NO

- [x] 10. App.tsx — 2×2 대시보드 레이아웃 + 최종 연결

  **What to do**:
  - `frontend/src/App.tsx` 작성 (전체 대시보드 레이아웃):
    ```tsx
    import AgentCard from './components/AgentCard';  // AgentGrid
    import TaskList from './components/TaskList';
    import LogChannel from './components/LogChannel';
    import StrategyChecklist from './components/StrategyChecklist';

    export default function App() {
      return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-[#0a0e1a] to-[#0f172a]">
          {/* 헤더 */}
          <header className="mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-[#0ff0a0] rounded-full" />
            <h1 className="font-[Syne] text-2xl font-bold text-[#e2e8f0] tracking-tight">
              Agent Orchestration
              <span className="text-[#0ff0a0] ml-2">Control</span>
            </h1>
          </header>

          {/* 2×2 그리드 */}
          <div className="grid grid-cols-2 gap-4 h-[calc(100vh-120px)]">
            {/* 좌상: 에이전트 카드 */}
            <Panel title="에이전트 상태">
              <AgentGrid />  {/* AgentCard.tsx에서 export */}
            </Panel>

            {/* 우상: 전략 */}
            <Panel title="모델 전략">
              <StrategyChecklist />
            </Panel>

            {/* 좌하: 작업 목록 */}
            <Panel title="작업 목록">
              <TaskList />
            </Panel>

            {/* 우하: 로그 채널 */}
            <Panel title="실행 로그">
              <LogChannel />
            </Panel>
          </div>
        </div>
      );
    }

    function Panel({ title, children }: { title: string; children: React.ReactNode }) {
      return (
        <div className="bg-[#111827] border border-white/8 rounded-2xl p-4 shadow-xl shadow-black/50 overflow-hidden flex flex-col">
          <h2 className="font-[Syne] text-sm font-semibold text-[#64748b] uppercase tracking-widest mb-3">
            {title}
          </h2>
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      );
    }
    ```
  - 루트 `package.json` 업데이트 — concurrently 설치 + dev 스크립트:
    ```json
    {
      "scripts": {
        "dev": "concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\""
      },
      "devDependencies": { "concurrently": "^8.0.0" }
    }
    ```
  - `npm install -D concurrently` (루트)

  **Must NOT do**:
  - 새로운 fetch 로직 추가 금지 (각 컴포넌트가 자체 fetch)
  - 전역 상태 라이브러리 설치 금지

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (단독)
  - **Blocks**: F1~F4
  - **Blocked By**: T5, T6, T7, T8, T9

  **References**:
  - `frontend/src/components/AgentCard.tsx` — AgentGrid export 확인
  - `frontend/src/index.css` — CSS 변수 (`--color-bg`, `--color-accent` 등)

  **Acceptance Criteria**:
  - [ ] `frontend/src/App.tsx` 존재, 4개 컴포넌트 import
  - [ ] `grid grid-cols-2 gap-4` 2×2 레이아웃
  - [ ] 헤더에 "Agent Orchestration Control" 표시
  - [ ] 루트에서 `npm run dev` → frontend:5173 + backend:3001 동시 시작

  **QA Scenarios**:
  ```
  Scenario: 최종 대시보드 전체 렌더링
    Tool: Playwright
    Steps:
      1. await page.goto('http://localhost:5173')
      2. await page.waitForLoadState('networkidle')
      3. await expect(page.locator('h1')).toContainText('Control')
      4. await expect(page.locator('h2:has-text("에이전트 상태")')).toBeVisible()
      5. await expect(page.locator('h2:has-text("모델 전략")')).toBeVisible()
      6. await expect(page.locator('h2:has-text("작업 목록")')).toBeVisible()
      7. await expect(page.locator('h2:has-text("실행 로그")')).toBeVisible()
      8. await page.screenshot({path:'.omo/evidence/task-10-final-dashboard.png', fullPage:true})
    Expected Result: 4개 패널 모두 표시, Mission Control 다크 테마
    Evidence: .omo/evidence/task-10-final-dashboard.png
  ```

  **Commit**: YES (Wave 3 frontend + Wave 4)
  - Message: `feat(dashboard): add ui components with mission control theme`
  - Files: `frontend/src/**`, `package.json`

---

## Final Verification Wave

> 4개 검토 에이전트가 병렬로 실행된다. 전부 승인 후 사용자에게 결과를 제시하고 명시적 승인을 기다린다.

- [x] F1. **계획 준수 감사** — `oracle`
  플랜의 Must Have 항목마다 구현 파일 존재 확인 (Read). Must NOT Have 항목마다 금지 패턴 검색.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

  **Acceptance Criteria**:
  - [ ] Must Have 항목 7개 모두 PASS
  - [ ] tailwind.config.js 존재 안 함
  - [ ] PATCH /tasks 엔드포인트 없음
  - [ ] VERDICT: APPROVE

- [x] F2. **코드 품질 검토** — `unspecified-high`
  `npx tsc --noEmit` 실행. `as any`, `@ts-ignore`, `console.log` 검색. AI 슬롭 패턴 확인.
  Output: `Build [PASS/FAIL] | Issues [N] | VERDICT`

  **Acceptance Criteria**:
  - [ ] `cd frontend && npx tsc --noEmit` → 0 에러
  - [ ] `as any` 또는 `@ts-ignore` 없음
  - [ ] VERDICT: APPROVE

- [x] F3. **Playwright 실제 QA** — `unspecified-high` + `playwright` skill
  양측 dev server 시작. 4개 패널 렌더링 확인. 인터랙션 검증. 스크린샷 저장.
  Output: `Scenarios [N/N pass] | VERDICT`

  **Acceptance Criteria**:
  - [ ] 4개 패널 h2 제목 모두 표시
  - [ ] 에이전트 카드 11개, running 상태 펄스 애니메이션
  - [ ] 메모 전송 → 로그 채널에 표시
  - [ ] 전략 체크박스 2개 토글 동작
  - [ ] 스크린샷 `.omo/evidence/final-qa/dashboard-final.png`
  - [ ] VERDICT: APPROVE

- [x] F4. **범위 충실도 검사** — `deep`
  각 태스크 명세 vs 실제 구현 비교. 파일 간 오염 없는지 확인.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

  **Acceptance Criteria**:
  - [ ] 10개 구현 태스크 전부 명세 준수
  - [ ] cross-task 파일 오염 없음
  - [ ] VERDICT: APPROVE

---

## Commit Strategy

- T1~T5 완료: `feat(api): scaffold backend with express routes and mock data`
- T6~T10 완료: `feat(dashboard): add ui components with mission control theme`

## Success Criteria

```bash
# Backend
curl http://localhost:3001/api/agents     # Expected: 11개 배열
curl http://localhost:3001/api/tasks      # Expected: 8개 배열
curl -I http://localhost:3001/api/logs/stream  # Expected: text/event-stream

# Frontend
cd frontend && npm run build              # Expected: 에러 없음
```

### Final Checklist
- [ ] 4개 패널 2×2 그리드 표시
- [ ] Mission Control 다크 테마 (배경 #0a0e1a, 액센트 #0ff0a0)
- [ ] Syne + DM Mono 폰트 적용
- [ ] 에이전트 상태 색상 + running 펄스 애니메이션
- [ ] SSE 로그 스트리밍, 메모 전송 동작
- [ ] TypeScript 컴파일 에러 없음
