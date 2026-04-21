/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Analysis\components\WeeklyPattern.tsx
 */
import React from "react";
import styled from "styled-components";
import {
  Card,
  CardBd,
  CardHd,
  CardSub,
  CardTitle,
} from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";

export interface WeeklyDay {
  /** 한 글자 요일 레이블. 월/화/수/목/금/토/일 순으로 전달됩니다. */
  day: string;
  /** 해당 요일의 총 지출. 0이면 빈 막대로 표시됩니다. */
  amount: number;
  /** true면 강조색으로 막대를 칠합니다. 주말·피크데이 하이라이트에 사용. */
  emphasize?: boolean;
}

interface WeeklyPatternProps {
  days: WeeklyDay[];
  /**
   * 하단 설명 영역. 문자열 안에서 `**강조**`는 ink1/볼드로 표시됩니다.
   * 예: "금·토·일에 전체의 **58%**가 집중돼요."
   */
  note?: string;
}

const Wrap = styled.div`
  padding: 6px 0 4px;
`;

const Bars = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  align-items: end;
  height: 140px;
`;

const BarCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`;

const BarValue = styled.div`
  margin-bottom: 4px;
  color: ${tokens.color.ink4};
  font-size: 10px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
`;

const Bar = styled.div<{ $height: number; $emphasize: boolean }>`
  width: 70%;
  height: ${({ $height }) => `${Math.max($height, 2)}%`};
  background: ${({ $emphasize }) =>
    $emphasize ? tokens.color.accent : tokens.color.accentBorder};
  border-radius: 4px 4px 0 0;
`;

const DayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  margin-top: 6px;
`;

const DayLabel = styled.div<{ $emphasize: boolean }>`
  text-align: center;
  color: ${({ $emphasize }) => ($emphasize ? tokens.color.ink2 : tokens.color.ink4)};
  font-size: 11px;
  font-weight: ${({ $emphasize }) => ($emphasize ? 600 : 500)};
`;

const Note = styled.p`
  margin: 14px 0 0;
  color: ${tokens.color.ink3};
  font-size: 12px;
  line-height: 1.55;

  b {
    color: ${tokens.color.ink1};
    font-weight: 600;
  }
`;

/** `**...**` 구간만 `<b>` 로 감싸 주는 가벼운 파서. */
function renderNote(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <b key={index}>{part.slice(2, -2)}</b>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export const WeeklyPattern: React.FC<WeeklyPatternProps> = ({ days, note }) => {
  const max = Math.max(...days.map((d) => d.amount), 1);

  return (
    <Card>
      <CardHd>
        <div>
          <CardTitle>요일별 지출 패턴</CardTitle>
          <CardSub>주말에 집중되는 경향</CardSub>
        </div>
      </CardHd>
      <CardBd>
        <Wrap>
          <Bars>
            {days.map((d) => (
              <BarCell key={d.day}>
                <BarValue className="tnum">
                  {d.amount > 0 ? `${Math.round(d.amount / 1000)}k` : ""}
                </BarValue>
                <Bar
                  $height={(d.amount / max) * 100}
                  $emphasize={Boolean(d.emphasize)}
                  aria-label={`${d.day}요일 ${d.amount.toLocaleString()}원`}
                />
              </BarCell>
            ))}
          </Bars>
          <DayRow>
            {days.map((d) => (
              <DayLabel key={d.day} $emphasize={Boolean(d.emphasize)}>
                {d.day}
              </DayLabel>
            ))}
          </DayRow>
          {note && <Note>{renderNote(note)}</Note>}
        </Wrap>
      </CardBd>
    </Card>
  );
};
