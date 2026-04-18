import { useState } from "react";
import styled from "styled-components";
import { AppShell } from "../components/layout/AppShell";
import type { NavKey } from "../components/layout/AppShell";
import type { Platform } from "../types/platform";
import { formatKRW } from "../utils/format";

interface TransactionsPageProps {
  activeNav: NavKey;
  onNavChange: (key: NavKey) => void;
}

type Period = "이번달" | "최근3개월" | "사용자 지정";
type PlatformFilter = "전체" | Platform;

interface Transaction {
  id: string;
  date: string;
  platform: Platform;
  productName: string;
  totalAmount: number;
  itemCount: number;
}

const PERIODS: Period[] = ["이번달", "최근3개월", "사용자 지정"];
const PLATFORM_FILTERS: PlatformFilter[] = [
  "전체",
  "쿠팡",
  "네이버쇼핑",
  "무신사",
];

const PLATFORM_TONES: Record<
  Platform,
  { bg: string; fg: string; border: string }
> = {
  쿠팡: { bg: "#FEF3C7", fg: "#B45309", border: "#F59E0B" },
  네이버쇼핑: { bg: "#D1FAE5", fg: "#0F9B54", border: "#0F9B54" },
  무신사: { bg: "#EEE7FF", fg: "#6D28D9", border: "#AB81FE" },
};

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    date: "2025.04.14",
    platform: "쿠팡",
    productName: "나이키 에어포스 1 로우 화이트 270",
    totalAmount: 129000,
    itemCount: 1,
  },
  {
    id: "2",
    date: "2025.04.12",
    platform: "무신사",
    productName: "커버낫 스트릿 후드집업",
    totalAmount: 89000,
    itemCount: 1,
  },
  {
    id: "3",
    date: "2025.04.10",
    platform: "네이버쇼핑",
    productName: "애플 에어팟 프로 외 2건",
    totalAmount: 289000,
    itemCount: 3,
  },
  {
    id: "4",
    date: "2025.04.08",
    platform: "쿠팡",
    productName: "다이슨 헤어 컴플리트",
    totalAmount: 650000,
    itemCount: 1,
  },
  {
    id: "5",
    date: "2025.04.05",
    platform: "무신사",
    productName: "노스페이스 눕시 패딩 외 1건",
    totalAmount: 329000,
    itemCount: 2,
  },
];

const buildDetailItems = (tx: Transaction) => {
  if (tx.itemCount <= 1) {
    return [{ name: tx.productName, price: tx.totalAmount }];
  }
  const baseName = tx.productName.replace(/\s*외\s+\d+건$/, "");
  const avg = Math.round(tx.totalAmount / tx.itemCount);
  return Array.from({ length: tx.itemCount }, (_, i) => ({
    name: i === 0 ? baseName : `${baseName} (${i + 1})`,
    price: avg,
  }));
};

const Spacer = styled.div<{ $h?: number }>`
  height: ${({ $h = 8 }) => $h}px;
`;

const CardBox = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.02);
`;

const CardHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
  gap: 12px;

  .titles {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  h3 {
    margin: 0;
    font-size: 14.5px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.15px;
  }
  .subtitle {
    font-size: 11.5px;
    color: #9ca3af;
    font-weight: 400;
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const SearchWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  flex: 1;
  min-width: 220px;
  transition: background 0.12s, border-color 0.12s;

  &:focus-within {
    background: #ffffff;
    border-color: #4f6ef7;
  }

  .icon {
    color: #9ca3af;
    font-size: 13px;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    min-width: 0;
    border: none;
    background: none;
    outline: none;
    font-family: inherit;
    font-size: 13px;
    color: #111827;

    &::placeholder {
      color: #9ca3af;
    }
  }
`;

const PillGroup = styled.div`
  display: inline-flex;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
  height: 38px;
  align-items: center;
`;

const Pill = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  border: none;
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: ${({ $active }) => ($active ? "#111827" : "#6b7280")};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  font-family: inherit;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s, color 0.12s, box-shadow 0.12s;
  box-shadow: ${({ $active }) =>
    $active ? "0 1px 2px rgba(0, 0, 0, 0.06)" : "none"};

  &:hover {
    color: #111827;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 14px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const ListBody = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TxItem = styled.li<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s;
  background: ${({ $selected }) => ($selected ? "#eef4ff" : "transparent")};

  & + & {
    border-top: 1px solid #f3f4f6;
  }

  &:hover {
    background: ${({ $selected }) => ($selected ? "#eef4ff" : "#fafbfc")};
  }
`;

const Thumb = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  color: #9ca3af;
`;

const TxBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .name {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: -0.1px;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #6b7280;
  }
  .dot {
    color: #d1d5db;
  }
`;

const PlatformPill = styled.span<{
  $bg: string;
  $fg: string;
  $border: string;
}>`
  display: inline-flex;
  align-items: center;
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border: 1px solid ${({ $border }) => $border};
  border-radius: 5px;
  font-weight: 600;
  font-size: 10.5px;
  padding: 1px 7px;
  line-height: 1.2;
`;

const TxAmount = styled.div`
  text-align: right;
  flex-shrink: 0;

  .amount {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.3px;
  }
  .count {
    font-size: 10.5px;
    color: #9ca3af;
    margin-top: 2px;
  }
`;

const EmptyMsg = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  padding-top: 14px;
  margin-top: 14px;
  border-top: 1px solid #f3f4f6;
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ $active }) => ($active ? "#4f6ef7" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#4f6ef7" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#374151")};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  font-family: inherit;
  font-size: 12.5px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;

  &:hover {
    border-color: ${({ $active }) => ($active ? "#4f6ef7" : "#9ca3af")};
  }
`;

const DetailColumn = styled.div`
  position: sticky;
  top: 16px;

  @media (max-width: 960px) {
    position: static;
  }
`;

const DetailHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;

  h3 {
    margin: 0;
    font-size: 14.5px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.15px;
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  font-family: inherit;
  line-height: 1;

  &:hover {
    color: #374151;
  }
`;

const DetailMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;

  .field {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .label {
    font-size: 11px;
    color: #9ca3af;
    font-weight: 500;
  }
  .value {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
  }
`;

const DetailHighlight = styled.div`
  background: #eef4ff;
  border: 1px solid #dbe6fe;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 14px;

  .label {
    font-size: 11.5px;
    color: #4f6ef7;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .value {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.4px;
    line-height: 1.2;
  }
`;

const DetailSection = styled.div`
  margin-top: 14px;

  .label {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 8px;
  }
`;

const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ItemLine = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  font-size: 13px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  .name {
    color: #374151;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .price {
    font-weight: 600;
    color: #111827;
    flex-shrink: 0;
  }
`;

const EditBtn = styled.button`
  width: 100%;
  height: 42px;
  background: #4f6ef7;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: background 0.12s;

  &:hover {
    background: #4060e6;
  }
`;

const DetailEmpty = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;

  .icon {
    font-size: 32px;
    opacity: 0.5;
    margin-bottom: 8px;
  }
`;

export const TransactionsPage = ({
  activeNav,
  onNavChange,
}: TransactionsPageProps) => {
  const [period, setPeriod] = useState<Period>("이번달");
  const [platform, setPlatform] = useState<PlatformFilter>("전체");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(
    TRANSACTIONS[0]?.id ?? null
  );

  const filtered = TRANSACTIONS.filter((t) => {
    const matchPlatform = platform === "전체" || t.platform === platform;
    const matchSearch = t.productName
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchPlatform && matchSearch;
  });

  const selected = TRANSACTIONS.find((t) => t.id === selectedId) ?? null;
  const detailItems = selected ? buildDetailItems(selected) : [];
  const selectedTone = selected ? PLATFORM_TONES[selected.platform] : null;

  return (
    <AppShell
      activeNav={activeNav}
      title="소비내역"
      onNavChange={onNavChange}
    >
      <CardBox>
        <CardHead>
          <div className="titles">
            <h3>필터</h3>
            <span className="subtitle">
              기간과 플랫폼을 선택해 거래를 조회하세요
            </span>
          </div>
        </CardHead>

        <FilterBar>
          <SearchWrap>
            <span className="icon">🔍</span>
            <input
              type="text"
              placeholder="상품명 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchWrap>

          <PillGroup>
            {PERIODS.map((p) => (
              <Pill
                key={p}
                type="button"
                $active={period === p}
                onClick={() => setPeriod(p)}
              >
                {p}
              </Pill>
            ))}
          </PillGroup>

          <PillGroup>
            {PLATFORM_FILTERS.map((p) => (
              <Pill
                key={p}
                type="button"
                $active={platform === p}
                onClick={() => setPlatform(p)}
              >
                {p}
              </Pill>
            ))}
          </PillGroup>
        </FilterBar>
      </CardBox>

      <Spacer $h={4} />

      <TwoCol>
        <CardBox>
          <CardHead>
            <div className="titles">
              <h3>소비내역</h3>
              <span className="subtitle">총 {filtered.length}건</span>
            </div>
          </CardHead>

          {filtered.length === 0 ? (
            <EmptyMsg>조건에 맞는 거래가 없습니다</EmptyMsg>
          ) : (
            <>
              <ListBody>
                {filtered.map((tx) => {
                  const tone = PLATFORM_TONES[tx.platform];
                  return (
                    <TxItem
                      key={tx.id}
                      $selected={selectedId === tx.id}
                      onClick={() => setSelectedId(tx.id)}
                    >
                      <Thumb>🛍</Thumb>
                      <TxBody>
                        <span className="name">{tx.productName}</span>
                        <div className="meta">
                          <PlatformPill
                            $bg={tone.bg}
                            $fg={tone.fg}
                            $border={tone.border}
                          >
                            {tx.platform}
                          </PlatformPill>
                          <span className="dot">·</span>
                          <span>{tx.date}</span>
                        </div>
                      </TxBody>
                      <TxAmount>
                        <div className="amount">
                          {formatKRW(tx.totalAmount)}
                        </div>
                        <div className="count">{tx.itemCount}개 상품</div>
                      </TxAmount>
                    </TxItem>
                  );
                })}
              </ListBody>

              <Pagination>
                {[1, 2, 3].map((n) => (
                  <PageBtn
                    key={n}
                    type="button"
                    $active={page === n}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </PageBtn>
                ))}
              </Pagination>
            </>
          )}
        </CardBox>

        <DetailColumn>
          <CardBox>
            <DetailHead>
              <h3>주문 상세</h3>
              {selected && (
                <CloseBtn
                  type="button"
                  aria-label="닫기"
                  onClick={() => setSelectedId(null)}
                >
                  ✕
                </CloseBtn>
              )}
            </DetailHead>

            {selected && selectedTone ? (
              <>
                <DetailMeta>
                  <PlatformPill
                    $bg={selectedTone.bg}
                    $fg={selectedTone.fg}
                    $border={selectedTone.border}
                  >
                    {selected.platform}
                  </PlatformPill>
                  <div className="field">
                    <span className="label">주문일자</span>
                    <span className="value">{selected.date}</span>
                  </div>
                </DetailMeta>

                <DetailHighlight>
                  <div className="label">전체 결제금액</div>
                  <div className="value">
                    {formatKRW(selected.totalAmount)}
                  </div>
                </DetailHighlight>

                <DetailSection>
                  <div className="label">상품 목록 ({selected.itemCount}개)</div>
                  <ItemList>
                    {detailItems.map((item, i) => (
                      <ItemLine key={i}>
                        <span className="name">{item.name}</span>
                        <span className="price">{formatKRW(item.price)}</span>
                      </ItemLine>
                    ))}
                  </ItemList>
                </DetailSection>

                <EditBtn type="button">✏ 수정하기</EditBtn>
              </>
            ) : (
              <DetailEmpty>
                <div className="icon">📋</div>
                <div>좌측 목록에서 거래를 선택해주세요</div>
              </DetailEmpty>
            )}
          </CardBox>
        </DetailColumn>
      </TwoCol>
    </AppShell>
  );
};