# SpendTrack Planning Document v3

작성일: 2026-04-20  
문서 목적: 현재 React 퍼블리셔 v1 기준의 기획/구현 범위를 고정하기 위한 기준 문서

## 1. 기준 정의
- 현재 프로젝트의 source of truth는 `src/`입니다.
- 본 문서는 "현재 실제로 구현된 것"을 기준으로 프로젝트 범위를 설명합니다.
- 디자인 참고 산출물보다 실제 React 구조와 화면 흐름을 우선합니다.
- 이번 버전은 기능 확장보다 v1 정리와 협업 가능 상태 확보가 목적입니다.

## 2. 프로젝트 개요
SpendTrack는 쇼핑 주문내역 OCR을 출발점으로 삼아, 구매 상품 정보를 복원하고 소비 흐름을 관리할 수 있게 돕는 가계부형 소비관리 웹앱입니다.

현재는 실제 OCR/Auth/DB 연동 전 단계이며, 목업 데이터를 활용한 React 퍼블리셔 v1 상태입니다.

## 3. 현재 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | React 19 |
| Language | TypeScript |
| Bundler | Vite 8 |
| Routing | React Router DOM 7 |
| Styling | styled-components |
| Chart | Recharts |
| Data | mockTransactions 및 페이지별 mock data |

## 4. 현재 구현 화면

| 경로 | 화면 | 구현 상태 |
| --- | --- | --- |
| `/login` | Login | UI 구현 완료 |
| `/register` | Register | UI 구현 완료 |
| `/` | Home | 요약 대시보드 구현 |
| `/upload` | Upload | 입력 방식 선택 구현 |
| `/ocr-upload` | OCR Upload | 업로드 흐름 UI 구현 |
| `/manual-entry` | Manual Entry | 수동 입력 UI 구현 |
| `/ocr-edit` | OCR Edit | OCR 결과 수정 UI 구현 |
| `/transactions` | Transactions | 조회/필터/상세 UI 구현 |
| `/analysis` | Analysis | 분석 UI 구현 |
| `/settings` | Settings | 설정 UI 구현 |

## 5. 현재 포함 범위
- 로그인/회원가입 화면 UI
- 업로드 방식 선택
- OCR 이미지 업로드 UI
- OCR 결과 수정 UI
- 수동 거래 입력 UI
- 거래 조회, 검색, 필터 UI
- 월별 KPI 및 차트 UI
- 설정 화면 UI

## 6. 현재 제외 범위
- 실제 OCR 분석 엔진
- 실제 인증
- 실제 저장/조회 API
- 소셜 로그인
- 고급 알림/보안/요금제
- Analysis PDF 추출
- 주간/연간 분석 분기
- 별도 최근 업로드 허브
- 페이지네이션

## 7. 핵심 사용자 흐름
1. 로그인 또는 회원가입 화면 진입
2. Home에서 현재 소비 상태 확인
3. Upload에서 OCR 또는 수동 입력 선택
4. OCR Upload 또는 Manual Entry로 거래 초안 작성
5. OCR Edit 또는 입력 화면에서 내용을 보정
6. Transactions에서 내역을 조회
7. Analysis에서 월별 소비 흐름을 확인
8. Settings에서 기본 사용자 설정 UI를 확인

## 8. 현재 구현의 성격
- 퍼블리싱 중심의 화면 구조 검증 단계입니다.
- 실제 데이터 처리보다 사용자 흐름과 정보 구조가 중심입니다.
- 공통 컴포넌트와 디자인 토큰이 이미 분리되어 있어 후속 연동이 가능하도록 구조를 잡았습니다.

## 9. 기능 누락 점검

| 항목 | 점검 결과 |
| --- | --- |
| 핵심 화면 누락 | 없음 |
| 실제 OCR 연동 | 미구현 |
| 실제 인증 연동 | 미구현 |
| 실제 저장/삭제 연동 | 미구현 |
| AI 인사이트 실연동 | 미구현 |

정리하면 현재 문제는 "화면 누락"보다 "실기능 연동 전 상태"에 가깝습니다.

## 10. 협업 기준
- 페이지 조립은 `src/pages/<Screen>/index.tsx`에서 확인합니다.
- 공통 UI는 `src/components`에서 재사용합니다.
- 스타일 값은 `src/styles/tokens.ts`를 우선 사용합니다.
- 문서 기준은 `docs/collaboration`의 협업 문서를 함께 참고합니다.

## 11. 다음 단계
1. OCR 연동 방식 확정
2. 인증 및 저장 구조 확정
3. mock 데이터를 실제 데이터로 치환
4. 저장/수정/삭제 흐름 연결
5. AI 인사이트 연동
