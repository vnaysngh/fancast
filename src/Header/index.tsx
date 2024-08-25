import styled from "styled-components";
import Web3Auth from "../Web3Auth";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.25rem;
  background-color: #fff; /* Ensure the background color is set */
  position: sticky;
  top: 0;
  z-index: 1000; /* Adjust z-index as needed */
  // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Optional shadow for better separation */
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
