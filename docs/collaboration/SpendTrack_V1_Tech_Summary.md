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
  거래 데이터를 localStorage 기반으로 보관하는 전역 스토어(`transactionsStore`)를 관리합니다.
  추후 Firestore 등 원격 저장소로 교체할 때 이 레이어의 공개 API만 유지하면 됩니다.
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
