import styled from "styled-components";
import Web3Auth from "../Web3Auth";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 1.25rem;
`;

const PageTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.5rem;
  font-weight: 700;
  padding: 10px 20px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 20px;
`;

const HeaderComponent = () => {
  return (
    <Header>
      <PageTitle>Fancast</PageTitle>
      <UserInfo>
        <Web3Auth />
      </UserInfo>
    </Header>
  );
};

export default HeaderComponent;
