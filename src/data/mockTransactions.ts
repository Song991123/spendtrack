/**
 * 역할: 프로젝트 전체에서 재사용하는 목업 데이터 원본을 보관합니다.
 * 위치: src\data\mockTransactions.ts
 */
import type { Transaction } from "../types/transaction";

export const mockTransactions: Transaction[] = [
  {
    id: "tx-001",
    type: "expense",
    title: "나이키 에어포스 외 1건",
    amount: 258000,
    date: "2025.04.14",
    platform: "coupang",
    statusTag: "purchase",
    source: "ocr",
    products: [
      {
        id: "tx-001-product-1",
        name: "나이키 에어포스 1 로우",
        price: 129000,
        link: "https://www.coupang.com/vp/products/1000001",
      },
      {
        id: "tx-001-product-2",
        name: "나이키 에어포스 1 로우 화이트",
        price: 129000,
      },
    ],
  },
  {
    id: "tx-002",
    type: "expense",
    title: "커버낫 스트릿 후드집업",
    amount: 89000,
    date: "2025.04.12",
    platform: "musinsa",
    statusTag: "purchase",
    source: "ocr",
    products: [
      {
        id: "tx-002-product-1",
        name: "커버낫 스트릿 후드집업",
        price: 89000,
      },
    ],
  },
  {
    id: "tx-003",
    type: "expense",
    title: "애플 에어팟 프로 외 2건",
    amount: 289000,
    date: "2025.04.10",
    platform: "naver",
    statusTag: "purchase",
    source: "ocr",
    products: [
      {
        id: "tx-003-product-1",
        name: "애플 에어팟 프로",
        price: 189000,
      },
      {
        id: "tx-003-product-2",
        name: "실리콘 케이스",
        price: 49000,
      },
      {
        id: "tx-003-product-3",
        name: "이어팁 세트",
        price: 51000,
      },
    ],
  },
  {
    id: "tx-004",
    type: "income",
    title: "다이슨 에어랩 환불",
    amount: 650000,
    date: "2025.04.08",
    platform: "coupang",
    statusTag: "refund",
    source: "ocr",
    products: [
      {
        id: "tx-004-product-1",
        name: "다이슨 에어랩",
        price: 650000,
      },
    ],
  },
  {
    id: "tx-005",
    type: "expense",
    title: "노스페이스 눕시 패딩 외 1건",
    amount: 329000,
    date: "2025.04.05",
    platform: "musinsa",
    statusTag: "purchase",
    source: "ocr",
    products: [
      {
        id: "tx-005-product-1",
        name: "노스페이스 눕시 패딩",
        price: 279000,
      },
      {
        id: "tx-005-product-2",
        name: "베이직 비니",
        price: 50000,
      },
    ],
  },
  {
    id: "tx-006",
    type: "expense",
    title: "삼성 갤럭시버즈 2",
    amount: 189000,
    date: "2025.04.02",
    platform: "naver",
    statusTag: "cancel",
    source: "manual",
    products: [
      {
        id: "tx-006-product-1",
        name: "삼성 갤럭시버즈 2",
        price: 189000,
      },
    ],
  },
];

