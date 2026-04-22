/**
 * 역할: 프로젝트 전반에서 공유하는 스타일 토큰이나 전역 스타일을 정의합니다.
 * 위치: src\styles\global.ts
 */
import { createGlobalStyle } from "styled-components";
import { tokens } from "./tokens";

export const GlobalStyle = createGlobalStyle`
  /* 브라우저 기본 여백 차이를 먼저 없애서 화면이 동일하게 보이도록 맞춥니다. */
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    background: ${tokens.color.bg};
    color: ${tokens.color.ink1};
    font-family: ${tokens.font.sans};
    font-feature-settings: "ss01", "cv11";
    -webkit-font-smoothing: antialiased;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button,
  input,
  textarea,
  select,
  a {
    /* 키보드 접근성은 유지하되 포커스 표현은 토큰 기준으로 통일합니다. */
    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: none;
      box-shadow: ${tokens.shadow.focus};
    }
  }

  a {
    color: inherit;
  }

  .tnum {
    font-variant-numeric: tabular-nums;
  }

  /*
   * 크로스브라우저 커스텀 스크롤바.
   * - Chrome/Edge/Safari(WebKit): ::-webkit-scrollbar 의사요소로 두께, 트랙, 썸을 직접 그립니다.
   * - Firefox: scrollbar-width / scrollbar-color 표준 속성으로 얇게 + 토큰 색을 지정합니다.
   * - iOS Safari 는 기본 오버레이 스크롤바를 그대로 쓰되(시스템 통합이 자연스럽습니다),
   *   데스크톱 Safari 는 WebKit 규칙을 그대로 따라오므로 별도 분기가 필요 없습니다.
   * 두께는 8px 로 얇게 잡아 콘텐츠 공간을 최대한 보존하고, 썸에는 작은 반경과 살짝 투명한
   * ink5 색을 써서 "여기에 스크롤이 있구나" 정도만 드러내고 배경과 자연스럽게 섞이게 합니다.
   */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${tokens.color.ink5} transparent;
  }

  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${tokens.color.ink5};
    border-radius: 4px;
    /* 트랙과의 사이에 2px 여백을 만들어 썸이 떠 있는 것처럼 보이게 합니다. */
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background-color: ${tokens.color.ink4};
  }

  *::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

