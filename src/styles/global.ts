import { createGlobalStyle } from "styled-components";
import { tokens } from "./tokens";

export const GlobalStyle = createGlobalStyle`
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

  a {
    color: inherit;
  }

  .tnum {
    font-variant-numeric: tabular-nums;
  }
`;
