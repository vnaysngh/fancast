import { useEffect, useRef } from "react";
import styled from "styled-components";
import LoadingSpinner from "./Spinner";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const PopupContainer = styled.div`
  background-color: #fff;
  border-radius: 16px;
  padding: 2rem;
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
`;

const Message = styled.p`
  color: #b3b3b3;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button<{ primary?: boolean }>`
  font-family: Poppins;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => (props.primary ? "#4a4b4e" : "#2c2d30")};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4a4b4e;
  }
`;

const TransactionConfirmationPopup = ({
  isEligible,
  onClose,
  error
}: {
  isEligible: any;
  onClose?: () => void;
  error: any;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      onClose &&
      popupRef.current &&
      !popupRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <Overlay>
      <PopupContainer ref={popupRef}>
        <Title>
          {isEligible === undefined
            ? "Verifying your balance. Please wait.."
            : isEligible
            ? "You are verified. Redirecting..."
            : "You dont have the required balance to enter the community"}
        </Title>
        {isEligible === undefined && <LoadingSpinner />}
      </PopupContainer>
    </Overlay>
  );
};

export default TransactionConfirmationPopup;
