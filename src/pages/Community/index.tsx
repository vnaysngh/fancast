import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount, useReadContract } from "wagmi";
import ERC721ABI from "../../abi/erc721.json";
import { useStateContext } from "../../context";
import { ONFT } from "../../constants/contract";

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavItem = styled.a`
  text-decoration: none;
  color: #666;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  // background-color: #fff;
  padding: 1.5rem;
  transition: transform 0.3s;
  border: solid 1px #888;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const CardContent = styled.div`
  color: #666;
`;

const Button = styled.button`
  font-family: "Bungee", sans-serif;
  background-color: #333;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #fff;
    color: #333;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
  }
`;

const HomePage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { communityId } = useParams<{
    communityId: string;
  }>();
  const account = useAccount();
  const { getOwnersForContract } = useStateContext();

  useEffect(() => {
    // Simulating fetching user data
    setTimeout(() => {
      setUsername("CryptoEnthusiast");
    }, 1000);
  }, []);

  const handleNavigation = (route: string) => {
    navigate(`/community/${communityId}/${route}`);
  };

  useEffect(() => {
    if (communityId && getOwnersForContract) getOwnersForContract(communityId);
  }, [communityId]);

  const communityMembersCount: any = useReadContract({
    abi: ERC721ABI,
    address: ONFT[account.chainId!],
    functionName: "getCommunityCount",
    args: [communityId!]
  });

  return (
    <Container>
      <Header>
        <Title>NFT Community Hub</Title>
        {/*  <Nav>
          <NavItem href="#home">Home</NavItem>
          <NavItem href="#members">Members</NavItem>
          <NavItem href="#games">Games</NavItem>
          <NavItem href="#profile">Profile</NavItem>
        </Nav> */}
      </Header>

      <Grid>
        <Card>
          <CardTitle>Welcome, {username || "Loading..."}</CardTitle>
          <CardContent>
            <p>Glad to have you back in our exclusive NFT community!</p>
            {/* <Button>Update Profile</Button> */}
          </CardContent>
        </Card>

        <Card>
          <CardTitle>Community Stats</CardTitle>
          <CardContent>
            <p>Members: {communityMembersCount.data?.toString()}</p>
            {/* <p>Active Posts: {communityStats.activePosts}</p>
            <p>Avg. Engagement: {communityStats.avgEngagement}</p> */}
          </CardContent>
        </Card>

        <Card onClick={() => handleNavigation("members")}>
          <CardTitle>Other Members</CardTitle>
          <CardContent>
            <p>Connect with fellow NFT enthusiasts:</p>
            <Button>Browse Members</Button>
          </CardContent>
        </Card>

        <Card onClick={() => handleNavigation("casts")}>
          <CardTitle>Farcaster Casts</CardTitle>
          <CardContent>
            <p>Farcaster casts tailored for community members</p>
            <Button>View More</Button>
          </CardContent>
        </Card>

        <Card>
          <CardTitle>Marketplace</CardTitle>
          <CardContent>
            <p>Trade exclusive NFTs in our community marketplace</p>
            <Button>Play Now</Button>
          </CardContent>
        </Card>

        <Card onClick={() => handleNavigation("what-if/feed")}>
          <CardTitle>What If</CardTitle>
          <CardContent>
            <p>
              Where sports fans explore alternate realities for their favorite
              teams and players!
            </p>
            <Button>View</Button>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
};

export default HomePage;
