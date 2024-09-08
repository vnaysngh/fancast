import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount, useReadContract } from "wagmi";
import ERC721ABI from "../../abi/erc721.json";
import { useStateContext } from "../../context";
import { ONFT } from "../../constants/contract";
import { TokenGate } from "../../components/TokenGate/tokengate";

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

const ContractDetails = styled.div`
  display: flex;
  margin-top: 1rem;
  gap: 8px;
`;

const ContractAddress = styled.div`
  text-decoration: underline;
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

const EtherscanLink = styled.a`
  color: #1e90ff;
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-top: 1rem;
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
  }
`;

const Icon = styled.img`
  height: 1.25rem;
  width: 1.25rem;
  cursor: pointer;
`;

const HomePage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { communityId } = useParams<{
    communityId: string;
  }>();
  const account = useAccount();
  const { getOwnersForContract, subscribed } = useStateContext();

  const currentCommunity = useMemo(() => {
    if (communityId && subscribed.length) {
      return subscribed?.find((community: any) => {
        return community.contract.toLowerCase() === communityId.toLowerCase();
      });
    }
  }, [communityId, subscribed]);

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
    <TokenGate>
      <Container>
        <Header>
          <Title>{currentCommunity?.name}</Title>
        </Header>

        <Grid>
          <Card>
            <CardTitle>Welcome, {username || "Loading..."}</CardTitle>
            <CardContent>
              <p>Glad to have you back in our exclusive NFT community!</p>
              <img src={currentCommunity?.display_image_url} />
              <EtherscanLink
                href={currentCommunity?.opensea_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Opensea
              </EtherscanLink>
              <ContractDetails>
                Contract:
                <ContractAddress>
                  {" "}
                  {currentCommunity?.contract.slice(0, 10)}...
                  {currentCommunity?.contract.slice(-4)}
                </ContractAddress>
              </ContractDetails>
              {/* <Button>Update Profile</Button> */}
            </CardContent>
          </Card>

          <div>
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
              <CardTitle>Discussions</CardTitle>
              <CardContent>
                <p>Engage with fellow NFT enthusiasts in lively discussions.</p>
                <Button>Check Feed</Button>
              </CardContent>
            </Card>
          </div>

          {/*   <Card onClick={() => handleNavigation("what-if/feed")}>
            <CardTitle>What If</CardTitle>
            <CardContent>
              <p>
                Where sports fans explore alternate realities for their favorite
                teams and players!
              </p>
              <Button>View</Button>
            </CardContent>
          </Card> */}
        </Grid>
      </Container>
    </TokenGate>
  );
};

export default HomePage;
