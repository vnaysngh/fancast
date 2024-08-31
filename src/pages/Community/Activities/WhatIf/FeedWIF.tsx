import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaArrowRight } from "react-icons/fa";

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
`;

const Description = styled.h3`
  font-size: 2rem;
  color: #333;
  font-family: "Roboto Slab", sans-serif;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  font-family: "Bungee";
  background-color: #0d0c22;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
  font-size: 1.25rem;
  margin-bottom: 1rem;

  &:hover {
    background-color: #fff;
    color: #0d0c22;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
    border: 1px solid #0d0c22;
  }
`;

const ButtonTitle = styled.div`
  margin-right: 2rem;
`;

const FeedWIF = () => {
  return (
    <Container>
      <Header>
        <Title>Feed</Title>
        <Description></Description>
      </Header>
    </Container>
  );
};

export default FeedWIF;
