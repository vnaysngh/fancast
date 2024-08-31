import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaArrowRight } from "react-icons/fa";
import CreateWIF from "./CreateWIF";
import FeedWIF from "./FeedWIF";

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

const HomePage = () => {
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();
  const { pathname } = useLocation();

  // Utility function for navigation
  const handleNavigation = (actionType: "create" | "feed") => {
    navigate(`/community/${communityId}/what-if/${actionType}`);
  };

  // Determine which page to display based on the URL
  const getPageContent = () => {
    if (pathname.includes("feed")) return <FeedWIF />;
    if (pathname.includes("create")) return <CreateWIF />;
    return (
      <Container>
        <Header>
          <Title>What If</Title>
          <Description>
            Welcome to “What If?”, where sports fans’ imaginations run wild!
            Picture a world where the unexpected happens—where your favorite
            teams and players take on alternate realities. What if your beloved
            underdog triumphed in the biggest game? What if a legendary transfer
            changed the course of football history? Step into a realm where
            anything is possible, and every day brings a fresh twist to the
            sports stories you thought you knew. Dive in, explore the
            unimaginable, and make your mark on these one-of-a-kind narratives!
          </Description>
        </Header>
        <ButtonContainer>
          <Button onClick={() => handleNavigation("create")}>
            <ButtonTitle>Create Your What If Story</ButtonTitle>
            <FaArrowRight />
          </Button>
          <Button onClick={() => handleNavigation("feed")}>
            <ButtonTitle>View What If Feed</ButtonTitle>
            <FaArrowRight />
          </Button>
        </ButtonContainer>
      </Container>
    );
  };

  return <>{getPageContent()}</>;
};

export default HomePage;
