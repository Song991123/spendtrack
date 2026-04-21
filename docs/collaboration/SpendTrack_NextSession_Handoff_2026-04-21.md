# SpendTrack 다음 세션 인수인계 프롬프트

작성일: 2026-04-21
작성자: `design-update` 브랜치 → `main` 머지 직후
대상: SpendTrack 프런트엔드 v1을 이어받을 다음 AI/팀원 세션

이 문서는 **다음 세션에서 바로 붙여넣어 작업을 시작할 수 있는 브리핑**입니다.
`docs/SpendTrack_Planning_Document.md`(v3)는 열람만 하고 **수정 금지**입니다.
현재 상태 스냅샷은 `docs/collaboration/SpendTrack_V1_Tech_Summary.md` 10장을 참고하세요.

---

## 0. 브랜치와 시작점
- `main`에 최신 UI/데이터 파이프라인 정리가 반영된 상태입니다 (`design-update` 머지 완료).
- **새 브랜치 이름 제안**: `feature/mobile-and-mocklogin` (실제 브랜치 작명은 상황에 맞게 변경 가능).
- 시작 전 `git pull origin main`으로 최신 상태 확보하세요.

---

## 1. 이번 세션에서 해결할 목표 2가지

### 목표 A — 모바일 레이아웃 최적화
현재 `media` 토큰(`src/tokens/breakpoints.ts`)과 `AppShell`의 `MobileNav`가 **뼈대는 잡혀 있지만 화면별 검증이 부족**합니다. 실제 모바일(360–430px)과 태블릿(768–1024px)에서 다음 화면을 훑어보고 실사용 가능 수준까지 다듬어 주세요.

검증 대상 화면 (우선순위 순):
1. `Home` (`/`) — 상단 KPI 스트립, PlatformDonut/TrendChart 2열 → 세로 스택 동작, RecentTransactions 행 가로 스크롤/축약
2. `Transactions` (`/transactions`) — 필터바 랩, 표의 6컬럼 고정 폭, 상세 패널(`DetailPanel`) 오버레이 전환
3. `Analysis` (`/analysis`) — Row2/Row3 그리드 접힘, PlatformBars/CategoryBars 가로 막대 길이, WeeklyPattern 차트 축 라벨
4. `OcrEdit` (`/ocr-edit`) — 현재 1200px 미만에서 1열로 스택됨. 모바일에서 ImageList·Preview·EditForm 순서·접힘 제스처 검토
5. `ManualEntry` (`/manual-entry`) — SaveBar 하단 고정 여부, 상품 추가 모달 풀스크린 전환
6. `Upload`(`/upload`), `CsvUpload`, `OcrUpload` — MethodCard 3열 → 1열
7. `Settings` (`/settings`) — 섹션 간 스크롤, 아바타 업로드 버튼 영역
8. `Login` / `Register` — AuthLayout 카드의 viewport padding, 키보드 가릴 때 스크롤

확인 포인트:
- 가로 스크롤 바 발생 여부 (모든 `.grid-template-columns`에 `minmax(0, 1fr)` 사용하는지)
- 터치 히트 영역 최소 44px × 44px
- 모달/드로어의 닫기 버튼 접근성
- 사이드바 대신 `MobileNav`가 나오는지 (`max-width: 640px`에서)
- 헤더의 `MonthPicker`가 좁은 폭에서도 잘리지 않는지
- 차트의 `ResponsiveContainer`가 부모 너비에 맞춰 리플로우되는지

작업 규칙:
- **공통 토큰 기반**: 인라인 미디어 쿼리 새로 쓰지 말고 `media.tablet`, `media.mobile`을 먼저 활용
- **기존 폴더 구조 유지**: `pages/*/components/*.tsx`에 국한된 수정이면 해당 파일에서 스타일만 조정
- 데스크톱 레이아웃을 깨뜨리지 말 것 (1280px+ 에서 회귀 검증 필수)

### 목표 B — 목업(테스트용) 로그인 분기
현재 `Login` 제출은 무조건 `/`로 이동하고, 홈은 `transactionsStore`의 시드 데이터를 보여줍니다.
아래 **테스트용 로그인 규칙**을 넣어 주세요.

| 입력 | 기대 동작 |
| --- | --- |
| 이메일·비밀번호 **빈 값** 또는 **1111/1111 외 아무 값** | 기존 시드 계정으로 로그인 → 홈 진입, 모든 데이터·프로필·거래가 이전 세션 그대로 유지 |
| 이메일 `1111` + 비밀번호 `1111` | **새 계정 취급**: 프로필/거래 전부 초기화, 첫 로그인 튜토리얼 오버레이 표시, 거래·집계 모두 빈 상태 |

구현 지침:
- 목업 자격 증명 상수는 **단 한 곳**에 모을 것. 제안 위치: `src/mocks/auth.ts` (신규 파일).
  ```ts
  // src/mocks/auth.ts
  /**
   * ⚠️ 테스트 전용 목업 자격 증명
   * 실제 인증(예: Firebase Auth) 연결 시 이 파일을 삭제하고
   * LoginForm/RegisterForm의 import와 사용 지점을 실제 auth SDK 호출로 교체하세요.
   * 교체 체크리스트는 docs/collaboration/SpendTrack_MockAuth_Replacement.md 참고.
   */
  export const NEW_ACCOUNT_EMAIL = "1111";
  export const NEW_ACCOUNT_PASSWORD = "1111";
  ```
- 로그인 핸들러에서 `NEW_ACCOUNT_EMAIL / PASSWORD` 매칭 시:
  1. `transactionsStore.replaceAll([])`
  2. `profileStore.reset()` 후 이메일만 `"1111"`(혹은 그대로 둬도 무관)로 덮어쓰기
  3. `localStorage`에 `spendtrack:onboarding:seen` 같은 플래그를 **삭제**
  4. `/`로 이동하면 Home이 비어 있고 튜토리얼 오버레이가 떠야 함
- 그 외 입력은 **현재 동작과 동일**: `transactionsStore`의 기존 시드 유지.

튜토리얼 오버레이 (새 컴포넌트 제안: `src/components/onboarding/WelcomeTutorial.tsx`):
- 3–4단계 슬라이드 또는 스포트라이트
  1. "수동 입력으로 첫 거래 기록하기" → `/manual-entry` 링크
  2. "쇼핑몰 주문내역 OCR" → `/ocr-upload`
  3. "카드 CSV 업로드" → `/csv-upload`
  4. "분석 화면에서 다음달 한눈에" → `/analysis`
- 닫으면 `localStorage.setItem("spendtrack:onboarding:seen", "1")`
- Home 진입 시 플래그 없으면 자동 표시

목업 로그인·튜토리얼 **모두** 실제 인증 붙이면 제거해야 한다는 문구를 다음 위치에 남길 것:
1. `src/mocks/auth.ts` 파일 상단 주석 (위 예시 참고)
2. `LoginForm` 내부 `// TODO(auth): src/mocks/auth.ts 제거 시 이 분기 통째로 교체` 주석
3. **전용 MD 파일** `docs/collaboration/SpendTrack_MockAuth_Replacement.md` 신규 생성:
   - 현재 목업 규칙 요약
   - 실제 인증 붙일 때의 교체 체크리스트 (파일 목록, 삭제할 파일, 남겨도 되는 파일)
   - 영향 받는 스토어/페이지

---

## 2. 참고할 현재 상태 지도

- 라우트: `src/App.tsx`
- 공통 셸: `src/components/layout/AppShell.tsx`, `Sidebar.tsx`
- 반응형 토큰: `src/tokens/breakpoints.ts`
- 스토어:
  - `src/stores/transactionsStore.ts` — localStorage key `spendtrack:transactions:v1`
  - `src/stores/profileStore.ts` — localStorage key `spendtrack:profile:v1`, `reset()` 메서드 있음
- 로그인 폼: `src/pages/Login/components/LoginForm.tsx` (현재 `onSubmit`에서 바로 `navigate("/")`)
- Home 진입점: `src/pages/Home/index.tsx` — 여기서 튜토리얼 오버레이를 마운트하는 것이 가장 자연스러움
- 디자인 토큰: `src/styles/tokens.ts` (색·그림자·모션)

---

## 3. 진행 순서 제안

1. 새 브랜치 생성: `git checkout main && git pull && git checkout -b feature/mobile-and-mocklogin`
2. 모바일 레이아웃 점검 — 한 화면씩 Chrome DevTools iPhone 14 Pro(393×852) 기준 스크린샷 비교, 회귀 없는 범위에서 CSS만 조정
3. 중간 커밋: `style(mobile): Home/Transactions/Analysis 모바일 레이아웃 다듬기` 등 화면 단위로 쪼개기
4. `src/mocks/auth.ts` 추가, `LoginForm`에 분기 추가
5. `WelcomeTutorial` 컴포넌트 + `Home` 마운트
6. `docs/collaboration/SpendTrack_MockAuth_Replacement.md` 작성
7. 타입체크: `npx tsc -b --force`
8. PR 제목 제안: `feat: 모바일 레이아웃 대응 + 목업(1111/1111) 신규 계정 튜토리얼 분기`

---

## 4. 절대 지키기
- `docs/SpendTrack_Planning_Document.md` 수정 **금지**
- 기존 데스크톱 레이아웃·기능 회귀 **금지**
- 목업 인증 코드는 **반드시 단일 파일**로 모아 제거 용이하게 유지
- 실제 비밀번호는 어디에도 저장하지 않음 (목업조차도 평문 문자열 상수로만)

---

## 5. 새 세션 시작 시 복사할 프롬프트 (한국어)

```
SpendTrack 프로젝트의 `main` 브랜치에서 작업을 이어받아 주세요.

(1) `docs/collaboration/SpendTrack_V1_Tech_Summary.md`를 먼저 읽어 현재 구현 상태를 파악한 뒤,
(2) `docs/collaboration/SpendTrack_NextSession_Handoff_2026-04-21.md`를 읽고 그 문서에 정의된
    "목표 A (모바일 레이아웃 최적화)"와 "목표 B (목업 로그인 분기 + 튜토리얼)"을 구현하세요.

`docs/SpendTrack_Planning_Document.md`는 절대 수정하지 말고 참조만 하세요.
새 브랜치 `feature/mobile-and-mocklogin`에서 진행하고,
작업이 끝나면 타입체크(`npx tsc -b --force`) 통과한 상태로 커밋하세요.

목업 자격 증명(1111/1111)은 반드시 `src/mocks/auth.ts` 한 파일에만 두고,
실제 인증으로 교체할 때의 체크리스트를
`docs/collaboration/SpendTrack_MockAuth_Replacement.md`로 따로 남겨 주세요.
```
