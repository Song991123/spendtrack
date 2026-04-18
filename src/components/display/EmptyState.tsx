import styled from "styled-components";

interface Props {
  title: string;
  description?: string;
}

const Wrap = styled.div`
  padding: 32px;
  text-align: center;
  color: #6b7280;
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
`;

const Desc = styled.div`
  font-size: 14px;
`;

export default function EmptyState({ title, description }: Props) {
  return (
    <Wrap>
      <Title>{title}</Title>
      {description && <Desc>{description}</Desc>}
    </Wrap>
  );
}