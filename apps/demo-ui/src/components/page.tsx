import { FC, PropsWithChildren, ReactNode } from "react";
import { Container } from "react-bootstrap";

export const Page: FC<PropsWithChildren<{ header?: ReactNode }>> = ({
  header,
  children,
}) => {
  return (
    <Container className="px-3">
      {header}
      <div className="w-100 bg-white border border-primary rounded p-3 my-3">
        {children}
      </div>
    </Container>
  );
};
