import React from "react";
import styled from "styled-components";
import { Card, CardBd } from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";

const Head = styled.div`
  padding: 18px 20px 0;

  .title {
    color: ${tokens.color.ink1};
    font-size: 15px;
    font-weight: 700;
  }

  .subtitle {
    margin-top: 4px;
    color: ${tokens.color.ink4};
    font-size: 12.5px;
    line-height: 1.5;
  }
`;

export const SettingsBlock: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <Card>
    <Head>
      <div className="title">{title}</div>
      {subtitle && <div className="subtitle">{subtitle}</div>}
    </Head>
    <CardBd style={{ paddingTop: 16 }}>{children}</CardBd>
  </Card>
);
