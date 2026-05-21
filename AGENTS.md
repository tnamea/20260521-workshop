# AGENTS.md

프로젝트의 에이전트 정의는 `.opencode/agents/*.md`를 기준으로 한다.

## 에이전트 역할 요약

| 에이전트 | 역할 |
| --- | --- |
| `classifier` | 요청을 적절한 담당 에이전트로 분류한다. |
| `status-summarizer` | 여러 작업의 진행 상황을 짧게 요약한다. |
| `notifier` | 완료/실패/지연/승인 이벤트를 전달한다. |
| `orchestrator` | 요청을 분해하고 에이전트에 배분한다. |
| `planner` | 목표를 실행 가능한 단계로 나눈다. |
| `researcher` | 필요한 맥락과 참고 사례를 수집한다. |
| `implementer` | 계획에 따라 실제 코드/설정/문서를 만든다. |
| `tdd-agent` | 구현을 검증할 테스트 초안을 작성한다. |
| `code-reviewer` | 변경 내용을 비판적으로 검토한다. |
| `qa-agent` | 실제 동작 기준으로 결과를 검증한다. |
| `observer` | 실행 중인 작업의 상태와 병목을 감시한다. |
| `security-reviewer` | 인증/권한/비밀정보 노출 위험을 점검한다. |
| `failure-recovery` | 실패 작업을 재시도하거나 롤백한다. |
| `doc-manager` | 결정 사항과 규칙 변경을 문서화한다. |
| `priority-adjuster` | 새 긴급 작업이 들어오면 우선순위를 조정한다. |
| `template-manager` | 반복 작업 템플릿과 응답 형식을 관리한다. |
| `designer` | 입력된 분위기/색감을 바탕으로 디자인 초안을 만든다. |

## 운영 흐름

1. `.opencode/agents/classifier.md`가 요청을 분류한다.
2. `.opencode/agents/status-summarizer.md`가 현재 흐름을 압축한다.
3. `.opencode/agents/notifier.md`가 영향 대상에게 상태를 알린다.
4. `.opencode/agents/orchestrator.md`가 배분 방향을 잡는다.
5. `.opencode/agents/planner.md`와 `.opencode/agents/researcher.md`가 준비를 보강한다.
6. `.opencode/agents/implementer.md`와 `.opencode/agents/tdd-agent.md`가 병렬로 작업한다.
7. `.opencode/agents/code-reviewer.md`, `.opencode/agents/security-reviewer.md`, `.opencode/agents/qa-agent.md`가 검증한다.
8. `.opencode/agents/observer.md`, `.opencode/agents/failure-recovery.md`, `.opencode/agents/priority-adjuster.md`가 운영을 유지한다.
9. `.opencode/agents/doc-manager.md`, `.opencode/agents/template-manager.md`가 기준과 재사용 자산을 정리한다.

## 원칙

- 읽기 전용 역할과 실행 역할을 분리한다.
- 구현과 검토는 분리한다.
- 불확실하면 추측보다 보류 또는 질문을 우선한다.
- 각 에이전트는 자신의 책임 범위만 다룬다.
