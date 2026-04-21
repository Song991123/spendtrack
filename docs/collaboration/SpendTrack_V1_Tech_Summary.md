# SpendTrack V1 기술 요약

작성일: 2026-04-20  
대상: SpendTrack React Publisher v1 협업용 문서

## 1. 현재 프로젝트 한 줄 요약
SpendTrack v1은 쇼핑 주문내역 기반 소비관리 서비스를 가정하고, 목업 데이터를 사용해 사용자 흐름과 화면 구조를 React로 먼저 구현한 프론트엔드 퍼블리싱 버전입니다.

## 2. 사용 기술

| 영역 | 기술 | 현재 사용 방식 |
| --- | --- | --- |
| 프론트엔드 | React 19 | 화면 컴포넌트 구성, 상태 관리 |
| 언어 | TypeScript | props, 데이터 구조, UI 로직 타입 안정성 확보 |
| 번들러 | Vite 8 | 개발 서버와 빌드 환경 제공 |
| 라우팅 | React Router DOM 7 | 화면 전환과 경로 관리 |
| 스타일링 | styled-components 6 | 컴포넌트 단위 스타일 작성 |
| 차트 | Recharts 3 | Home, Analysis 화면의 시각화 UI 구현 |
| 데이터 | 페이지별 mock 시드 + localStorage 기반 전역 스토어 | 서버 없이 화면 흐름 검증, CSV/OCR 반입 결과의 세션 간 유지 |

## 3. 프로젝트 구조
- `src/App.tsx`
  전체 라우트 진입점입니다.
- `src/components/`
  재사용 UI를 역할별 9개 카테고리로 분리합니다.
  - `primitives/` — Button, Card, Chip, Tag, Toggle, SegmentedControl 등 최소 단위 UI
  - `layout/` — AppShell, Sidebar, TopHeader 같은 공통 셸
  - `form/` — TextInput, FormField, SearchInput, FilterPill, UploadDropzone, EditableFieldRow 등 입력 UI
  - `list/` — TransactionRow, SubscriptionRow, RepeatRankRow 등 목록 행 컴포넌트
  - `modal/` — Modal, MatchTransactionModal, ProductAddModal 등 모달 계층
  - `display/` — StatCard, EmptyState, ImagePreview, PlatformBadge 등 표시 컴포넌트
  - `composite/` — OrderInfoCard 같은 조합 컴포넌트
  - `charts/` — CategoryBar, StackedBar, HorizontalBar, LegendItem 등 차트 컴포넌트
  - `auth/` — AuthLayout 등 인증 전용 레이아웃
- `src/pages/`
  화면별 폴더 단위로 UI를 나눕니다.
  각 화면은 `index.tsx`(조립) + `components/`(화면 전용 세부 UI) + `data.ts`(목업·계산 로직) 의 3단 구조로 구성합니다.
  `pages/*Page.tsx` 는 라우터 레벨 래퍼로 조립층과 분리합니다.
- `src/styles/tokens.ts`
  색상, 간격, 타이포, 그림자 등 디자인 토큰을 관리합니다.
- `src/tokens/`
  `breakpoints.ts` 반응형 기준, `platforms.ts` 플랫폼 이름/색상 정의를 관리합니다.
- `src/types/`
  거래, 상품, 주문, 플랫폼 등 핵심 타입을 관리합니다.
- `src/utils/`
  포맷팅, 거래 계산, 다중 플랫폼 CSV 파싱(`csvParse`, `csvImport`, `xlsxImport`, `fileImport`), 상인명 정규화(`merchantNormalize`), 매칭(`matchTransaction`), import 헤더 스키마(`importHeaders`) 같은 공통 로직을 관리합니다.
- `src/stores/`
  여러 화면이 공유하는 데이터를 localStorage 기반으로 보관하는 전역 스토어를 관리합니다.
  - `transactionsStore` — 거래 레코드 CRUD (`spendtrack:transactions:v1`)
  - `profileStore` — 프로필/계정 정보 (`spendtrack:profile:v1`, 이름·닉네임·이메일·비밀번호 변경일·아바타 DataURL)
  추후 Firestore/Auth 등 원격 저장소로 교체할 때 이 레이어의 공개 API만 유지하면 됩니다.
- `src/data/`
  초기 mock 거래 시드를 관리합니다.
- `src/constants/`
  라벨, 월 이름 같은 정적 상수를 관리합니다.
- `public/samples`
  CSV 업로드 기능 시연/테스트용 샘플 CSV와 포맷 설명을 둡니다.

## 4. 현재 구현된 화면
- `Login`
- `Register`
- `Home`
- `Upload`
- `OCR Upload`
- `Manual Entry`
- `OCR Edit`
- `CSV Upload`
- `Transactions`
- `Analysis`
- `Settings`

## 5. 구현 방식 특징
- 실제 서버 대신 목업 데이터를 사용합니다.
- 각 화면은 `index.tsx`에서 조립하고, 세부 블록은 `components`로 분리합니다.
- 입력, 조회, 분석 흐름이 분리되어 있어 역할을 읽기 쉽습니다.
- `AppShell`이 데스크톱/모바일 공통 구조를 잡아줍니다.
- 디자인 토큰을 통해 화면 톤을 통일합니다.

## 6. 현재 포함된 기능 범위
- 로그인/회원가입 UI
- OCR 업로드 UI
- OCR 결과 수정 UI (상품명·금액·링크·주문일자 수정)
- 수동 거래 입력 UI
- 카드 CSV 업로드 UI (결제내역 벌크 반입)
- 다중 플랫폼 CSV 자동 파싱 (쿠팡·네이버·무신사 포맷 인식)
- BOM + UTF-8 / EUC-KR 인코딩 자동 감지
- CSV/OCR 결합: 기존 거래에 상품 병합 vs 새 거래 저장 선택 모달
- 거래 검색 및 필터 UI
- 월별 소비/수입 요약 UI
- 플랫폼/카테고리 분석 UI
- 설정 화면 UI

## 7. 현재 제외된 기능
- 실제 OCR 추출 엔진 (UI와 편집 흐름만 구현)
- 실제 인증
- 원격 데이터베이스 저장 (localStorage 기반 임시 저장까지만 제공)
- AI 인사이트 실연동
- 외부 쇼핑몰/카드사 API 직접 연동 (CSV 업로드로 대체)

## 8. 팀원이 코드를 읽는 추천 순서
1. `src/App.tsx`에서 전체 화면 구성을 확인합니다.
2. `src/components/layout/AppShell.tsx`로 공통 레이아웃을 확인합니다.
3. 각 페이지의 `index.tsx`에서 상태와 화면 조립 방식을 확인합니다.
4. 필요한 경우 페이지별 `components`와 `data.ts`를 확인합니다.
5. 마지막으로 `types`, `utils`, `styles`를 확인합니다.

## 9. 다음 단계로 자연스럽게 이어질 기술
- Firebase Authentication
- Firestore 또는 다른 저장소 연동 (현재 transactionsStore의 공개 API를 그대로 유지하면서 교체 가능)
- OCR 엔진 연결 (Tesseract.js 또는 CLOVA)
- AI 인사이트 API 연결
- 실제 배포 파이프라인 구성

현재 v1은 위 기술을 바로 연결하기 위한 사전 구조 정리 단계로 보면 됩니다.

## 10. `design-update` 브랜치 현재 상태 (2026-04-21 기준)

이 섹션은 `main`에 머지되기 직전 시점의 `design-update` 브랜치 스냅샷입니다.
새로 합류하는 사람이나 다른 AI 세션이 혼동 없이 이어받을 수 있도록,
UI 정리 이후 **데이터·상호작용을 실제로 연결한 변경**을 기록해 둡니다.

### 10-1. 데이터 파이프라인 — 하드코딩 제거
- `Home`과 `Analysis`의 월별 목업 딕셔너리(`MONTHLY_HOME_DATA`, `MONTHLY_ANALYSIS_DATA`, `WEEKLY_BY_MONTH`)를 삭제했습니다.
- 두 화면 모두 `useTransactionsStore()`로 현재 `rows[]`를 구독하고, `buildHomeData(rows, monthKey)` / `buildAnalysisData(rows, monthKey)`로 파생 데이터를 만듭니다.
- KPI, 도넛, 월별 추이, 최근 거래, 인사이트, 플랫폼/카테고리 막대, 반복구매 Top3, 정기결제, 요일 패턴, 6개월 트렌드까지 전부 스토어 집계로 교체됐습니다.
- 사용자가 수동 입력 / CSV / OCR로 거래를 추가하거나 삭제하면 홈·분석이 실시간 반영됩니다.

### 10-2. 수동 입력(ManualEntry) 저장 동작
- 상품/메타 입력 폼을 controlled 컴포넌트로 전환했습니다.
- `거래 저장하기` 버튼이 `transactionsStore.addOne(...)`을 호출하도록 연결됐고, 최소 검증 실패 시 폼 상단에 `ErrorLine`으로 메시지를 띄웁니다.

### 10-3. 설정(Settings) 실동작 연결
- `profileStore`를 신설해 이름·닉네임·이메일·비밀번호 변경일·아바타(DataURL)를 localStorage에 영속화합니다.
- `ProfileSection`: 아바타 업로드는 `FileReader.readAsDataURL`로 1MB 제한 내에서 저장합니다. 이름/닉네임 편집은 로컬 드래프트를 유지하다 저장 시 `profileStore.save(...)`로 반영됩니다.
- `AccountSection`: 이메일 정규식 검증 + 비밀번호 8자 이상/확인 일치 검증. 비밀번호 원문은 저장하지 않고 `passwordChangedAt`만 갱신합니다.
- `DangerSection`: `계정 삭제` 2단계 확인 후 `profileStore.reset()` + `transactionsStore.replaceAll([])`로 세션 데이터를 전부 비웁니다.
- `AppShell`/`Sidebar`는 `useProfile()`로 현재 프로필을 구독해 아바타·이름·이메일 표시를 동기화합니다.

### 10-4. OCR 결과 확인 화면(OcrEdit) 레이아웃
- 사용 맥락상 미리보기보다 **데이터 확인·수정**이 주이므로 3단 그리드를 `240px / minmax(280px, 0.9fr) / minmax(440px, 1.6fr)`로 재배분해 오른쪽 편집 폼에 가장 큰 지분을 주었습니다.
- `ImageList` 썸네일을 60→44px로 축소하고 `Meta`에 `min-width: 0 + ellipsis`를 적용해 "이미지 N / 분석 완료" 라벨이 세로로 잘리지 않습니다.
- `ProductTable`의 컬럼은 `minmax(0, 1.1fr) / 120px / minmax(0, 1fr) / 28px`에 `column-gap: 8px`를 추가해 상품명과 URL 입력이 충분한 폭을 얻습니다.

### 10-5. 거래 내역(Transactions) 정렬
- 기본 정렬은 **날짜 내림차순(최신이 위)**입니다.
- `주문일` 헤더가 `<button>` 형태의 `SortableHeader`로 바뀌었고, 브랜드 액센트 컬러의 셰브런 SVG가 붙어 `desc`→아래, `asc`→위로 180° 회전합니다. 접근성: `aria-pressed`, 한국어 `aria-label` 포함.
- 정렬은 `filter` 이후 순수한 `sort(copy)`로 수행되며, `"YYYY.MM.DD"` / `"YYYY-MM-DD"` 포맷을 공통 키(`Y*10000 + M*100 + D`)로 환산해 비교합니다.

### 10-6. 타입체크 기준선
- 위 변경은 모두 `npx tsc -b --force` 통과 상태입니다.
- Vite 빌드는 현 샌드박스에서 rolldown 바이너리 누락으로 실패할 수 있으나 **코드 문제 아님**. 로컬/CI에서는 정상 빌드됩니다.
