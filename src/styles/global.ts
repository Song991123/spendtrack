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
`;

