import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

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
  background-color: #0d0c22;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #fff;
    color: #0d0c22;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
  }
`;

// Mock data
const communityStats = {
  members: 1000,
  activePosts: 150,
  avgEngagement: "75%"
};

const recentCasts = [
  { id: 1, author: "user1", content: "Just minted a new NFT!" },
  { id: 2, author: "user2", content: "Whos up for a game night?" },
  { id: 3, author: "user3", content: "Check out my latest project" }
];

const games = [
  { id: 1, name: "NFT Trader", players: 50 },
  { id: 2, name: "Crypto Puzzles", players: 30 },
  { id: 3, name: "Blockchain Battles", players: 75 }
];

const HomePage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { communityId } = useParams<{
    communityId: string;
  }>();
  useEffect(() => {
    // Simulating fetching user data
    setTimeout(() => {
      setUsername("CryptoEnthusiast");
    }, 1000);
  }, []);

  const handleNavigation = (route: string) => {
    navigate(`/community/${communityId}/${route}`);
  };

  return (
    <Container>
      <Header>
        <Title>NFT Community Hub</Title>
        <Nav>
          <NavItem href="#home">Home</NavItem>
          <NavItem href="#members">Members</NavItem>
          <NavItem href="#games">Games</NavItem>
          <NavItem href="#profile">Profile</NavItem>
        </Nav>
      </Header>

      <Grid>
        <Card>
          <CardTitle>Welcome, {username || "Loading..."}</CardTitle>
          <CardContent>
            <p>Glad to have you back in our exclusive NFT community!</p>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardTitle>Community Stats</CardTitle>
          {/*  <CardContent>
            <p>Members: {communityStats.members}</p>
            <p>Active Posts: {communityStats.activePosts}</p>
            <p>Avg. Engagement: {communityStats.avgEngagement}</p>
          </CardContent> */}
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
            {/* {recentCasts.map((cast) => (
              <p key={cast.id}>
                <strong>{cast.author}:</strong> {cast.content}
              </p>
            ))} */}
            <Button>View More</Button>
          </CardContent>
        </Card>

        <Card>
          <CardTitle>Community Games</CardTitle>
          <CardContent>
            {/*  <ul>
              {games.map((game) => (
                <li key={game.id}>
                  {game.name} - {game.players} players
                </li>
              ))}
            </ul> */}
            <Button>Play Now</Button>
          </CardContent>
        </Card>

        <Card onClick={() => handleNavigation("what-if")}>
          <CardTitle>What If</CardTitle>
          <CardContent>
            {/*             <p>Top contributors this week:</p>
            <ol>
              <li>CryptoKing</li>
              <li>NFTQueen</li>
              <li>BlockchainWizard</li>
            </ol> */}
            <Button>View</Button>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
};

export default HomePage;
