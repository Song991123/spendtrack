import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../components/layout/AppShell";
import { Tag } from "../components/primitives/Tag";
import { Button } from "../components/primitives/Button";
import { formatKRW, parsePrice } from "../utils/format";

interface UploadedImage {
  id: string;
  label: string;
  url?: string;
}

interface ProductDraft {
  id: string;
  name: string;
  price: number;
  link: string;
}

const IMAGES: UploadedImage[] = [
  { id: "img1", label: "이미지 1" },
  { id: "img2", label: "이미지 2" },
  { id: "img3", label: "이미지 3" },
];

const INITIAL_PRODUCTS: ProductDraft[] = [
  {
    id: "p1",
    name: "나이키 에어포스 1 로우 화이트 270",
    price: 129000,
    link: "",
  },
  {
    id: "p2",
    name: "나이키 에어포스 1 로우 블랙 265",
    price: 129000,
    link: "",
  },
];

const ORDER_DATE = "2025.04.14";

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 14px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const RightStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const LeftStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 16px;

  @media (max-width: 960px) {
    position: static;
  }
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
  align-items: center;
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

const ThumbRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const ThumbBtn = styled.button<{ $selected?: boolean }>`
  width: 100%;
  padding: 0;
  background: ${({ $selected }) => ($selected ? "#eef4ff" : "#ffffff")};
  border: 2px solid ${({ $selected }) => ($selected ? "#4f6ef7" : "#e5e7eb")};
  border-radius: 12px;
  cursor: pointer;
  font-family: inherit;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color 0.12s, background 0.12s;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? "#4f6ef7" : "#9ca3af")};
  }

  .image {
    width: 100%;
    aspect-ratio: 4 / 3;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 18px;
  }

  .meta {
    padding: 7px 9px;
    font-size: 11px;
    font-weight: ${({ $selected }) => ($selected ? 600 : 500)};
    color: #374151;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .badge {
    font-size: 10px;
    color: #4f6ef7;
    font-weight: 600;
  }
`;

const PreviewBox = styled.div`
  width: 100%;
  height: 360px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #9ca3af;

  .icon {
    font-size: 40px;
    opacity: 0.7;
  }

  .label {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;

  .field {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .label {
    font-size: 11px;
    color: #6b7280;
  }

  .value {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 14px 0;
`;

const TotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-size: 12px;
    color: #6b7280;
  }

  .value {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.3px;
  }
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 24px;
  gap: 10px;
  font-size: 11.5px;
  font-weight: 600;
  color: #9ca3af;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 6px;

  @media (max-width: 540px) {
    display: none;
  }
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 24px;
  gap: 10px;
  align-items: start;
  padding: 8px 4px;
  border-bottom: 1px solid #f3f4f6;

  &:last-of-type {
    border-bottom: none;
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
    padding: 12px 0;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FieldLabel = styled.label`
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  display: none;

  @media (max-width: 540px) {
    display: inline;
  }
`;

const Input = styled.input`
  font-family: inherit;
  font-size: 13px;
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  border-radius: 8px;
  outline: none;
  color: #111827;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.12s;

  &:focus {
    border-color: #4f6ef7;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  align-self: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: #fef2f2;
    color: #dc2626;
  }

  @media (max-width: 540px) {
    align-self: flex-end;
  }
`;

const Hint = styled.p`
  margin: 12px 0 0;
  font-size: 11.5px;
  color: #9ca3af;
  text-align: center;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

export const OcrEditPage = () => {
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(IMAGES[0].id);
  const [products, setProducts] = useState<ProductDraft[]>(INITIAL_PRODUCTS);

  const updateProduct = (id: string, key: "name" | "link", value: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [key]: value } : product
      )
    );
  };

  const updatePrice = (id: string, value: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, price: parsePrice(value) } : product
      )
    );
  };

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      { id: `p-${Date.now()}`, name: "", price: 0, link: "" },
    ]);
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <AppShell activeNav="upload" title="OCR 결과 확인 및 수정">
      <TwoCol>
        <LeftStack>
          <CardBox>
            <CardHead>
              <div className="titles">
                <h3>업로드한 이미지</h3>
                <span className="subtitle">수정할 이미지를 선택해 주세요</span>
              </div>
            </CardHead>
            <ThumbRow>
              {IMAGES.map((image) => (
                <ThumbBtn
                  key={image.id}
                  type="button"
                  $selected={selectedImg === image.id}
                  onClick={() => setSelectedImg(image.id)}
                >
                  <div className="image">🖼</div>
                  <div className="meta">
                    <span>{image.label}</span>
                    {selectedImg === image.id && (
                      <span className="badge">현재 선택됨</span>
                    )}
                  </div>
                </ThumbBtn>
              ))}
            </ThumbRow>
          </CardBox>

          <CardBox>
            <CardHead>
              <div className="titles">
                <h3>이미지 미리보기</h3>
                <span className="subtitle">
                  {IMAGES.find((image) => image.id === selectedImg)?.label}
                </span>
              </div>
            </CardHead>
            <PreviewBox>
              <span className="icon">🖼</span>
              <span className="label">캡처 이미지 미리보기</span>
            </PreviewBox>
          </CardBox>
        </LeftStack>

        <RightStack>
          <CardBox>
            <CardHead>
              <div className="titles">
                <h3>거래 요약</h3>
                <span className="subtitle">OCR이 추출한 주문 정보 초안입니다</span>
              </div>
            </CardHead>

            <SummaryRow>
              <Tag variant="platform" value="쿠팡" />
              <Tag variant="status" value="구매" />
              <Tag variant="status" value="정기결제" />
            </SummaryRow>

            <InfoRow>
              <div className="field">
                <span className="label">주문일자</span>
                <span className="value">{ORDER_DATE}</span>
              </div>
              <div className="field">
                <span className="label">상품 수</span>
                <span className="value">{products.length}개</span>
              </div>
            </InfoRow>

            <Divider />

            <TotalLine>
              <span className="label">전체 거래금액</span>
              <span className="value">{formatKRW(totalAmount)}</span>
            </TotalLine>
          </CardBox>

          <CardBox>
            <CardHead>
              <div className="titles">
                <h3>상품 목록 편집</h3>
                <span className="subtitle">
                  상품명, 금액, 링크를 확인하고 수정해 주세요
                </span>
              </div>
            </CardHead>

            <TableHead>
              <span>상품명</span>
              <span>금액</span>
              <span>상품 링크</span>
              <span />
            </TableHead>

            {products.map((product) => (
              <ProductRow key={product.id}>
                <Field>
                  <FieldLabel>상품명</FieldLabel>
                  <Input
                    type="text"
                    value={product.name}
                    onChange={(event) =>
                      updateProduct(product.id, "name", event.target.value)
                    }
                    placeholder="상품명을 입력해 주세요"
                  />
                </Field>
                <Field>
                  <FieldLabel>금액</FieldLabel>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={
                      product.price ? product.price.toLocaleString("ko-KR") : ""
                    }
                    onChange={(event) =>
                      updatePrice(product.id, event.target.value)
                    }
                    placeholder="0"
                  />
                </Field>
                <Field>
                  <FieldLabel>상품 링크</FieldLabel>
                  <Input
                    type="text"
                    value={product.link}
                    onChange={(event) =>
                      updateProduct(product.id, "link", event.target.value)
                    }
                    placeholder="URL (선택)"
                  />
                </Field>
                <RemoveBtn
                  type="button"
                  aria-label="상품 삭제"
                  onClick={() => removeProduct(product.id)}
                >
                  ✕
                </RemoveBtn>
              </ProductRow>
            ))}

            <Button
              variant="ghost"
              fullWidth
              onClick={addProduct}
              style={{ marginTop: 12 }}
            >
              + 상품 직접 추가하기
            </Button>

            <Hint>OCR 결과는 초안이에요. 수정 후 저장하면 내역에 반영됩니다.</Hint>
          </CardBox>

          <ActionRow>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => navigate("/ocr-upload")}
            >
              ↺ 다시 OCR 분석
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate("/transactions")}
            >
              저장하고 내역 반영
            </Button>
          </ActionRow>
        </RightStack>
      </TwoCol>
    </AppShell>
  );
};
