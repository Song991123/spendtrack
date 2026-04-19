import React from "react";
import styled from "styled-components";
import { Button } from "../../../components/primitives/Button";
import { tokens } from "../../../styles/tokens";
import { SettingsBlock } from "./SettingsSection";

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border: 1px solid ${tokens.color.negBorder};
  border-radius: 8px;
  background: ${tokens.color.negSubtle};

  .title {
    color: ${tokens.color.neg};
    font-size: 13px;
    font-weight: 700;
  }

  .sub {
    margin-top: 4px;
    color: ${tokens.color.ink3};
    font-size: 12px;
    line-height: 1.5;
  }
`;

export const DangerSection: React.FC = () => (
  <SettingsBlock title="계정 삭제" subtitle="계정을 삭제하면 모든 거래 내역과 설정이 영구적으로 삭제돼요.">
    <Box>
      <div>
        <div className="title">계정과 모든 데이터 삭제</div>
        <div className="sub">이 작업은 되돌릴 수 없어요.</div>
      </div>
      <Button variant="danger" size="md">
        계정 삭제
      </Button>
    </Box>
  </SettingsBlock>
);
