import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";

const Foot = styled.div`
  margin-top: 18px;
  color: ${tokens.color.ink3};
  text-align: center;
  font-size: 13px;

  a {
    margin-left: 4px;
    color: ${tokens.color.accentHover};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const AuthFooter: React.FC<{
  prompt: string;
  linkLabel: string;
  linkHref: string;
}> = ({ prompt, linkLabel, linkHref }) => (
  <Foot>
    {prompt}
    <Link to={linkHref}>{linkLabel}</Link>
  </Foot>
);
