import type { SummaryData } from "./components/SummaryStrip";
import type { TxRow } from "./components/TransactionTable";

export interface TransactionsMockData {
  summary: SummaryData;
  rows: TxRow[];
}

export const transactionsMockData: TransactionsMockData = {
  summary: {
    total: 12,
    spendCount: 10,
    incomeCount: 2,
    totalSpend: 1252000,
    incomeAndRefund: 970000,
    refundCount: 2,
    netSpend: 282000,
    countLabel: "총 12건 (지출 10 · 수입 2)",
  },
  rows: [
    {
      id: "t1",
      type: "expense",
      date: "2025.04.14",
      platform: "coupang",
      title: "나이키 에어포스 외 1건",
      amount: -258000,
      status: "purchase",
      detail: {
        items: [
          { name: "나이키 에어포스 1 로우 화이트 270", price: 129000 },
          { name: "나이키 에어맥스 90 블랙 265", price: 129000 },
        ],
        source: "OCR",
      },
    },
    {
      id: "t2",
      type: "expense",
      date: "2025.04.12",
      platform: "musinsa",
      title: "카바낫 스트릿 후드집업",
      amount: -89000,
      status: "purchase",
    },
    {
      id: "t3",
      type: "expense",
      date: "2025.04.10",
      platform: "naver",
      title: "애플 에어팟 프로 외 2건",
      amount: -289000,
      status: "purchase",
    },
    {
      id: "t4",
      type: "income",
      date: "2025.04.08",
      platform: "coupang",
      title: "다이슨 에어랩 환불",
      amount: 650000,
      status: "refund",
    },
    {
      id: "t5",
      type: "expense",
      date: "2025.04.05",
      platform: "musinsa",
      title: "노스페이스 눕시 패딩 외 1건",
      amount: -329000,
      status: "purchase",
    },
    {
      id: "t6",
      type: "expense",
      date: "2025.04.02",
      platform: "naver",
      title: "삼성 갤럭시버즈 2",
      amount: -189000,
      status: "cancel",
    },
  ],
};
