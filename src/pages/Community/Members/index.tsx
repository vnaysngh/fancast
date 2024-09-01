import React from "react";
import styled from "styled-components";
import { MessageCircle, DollarSign, ExternalLink } from "lucide-react";

const PageContainer = styled.div`
  padding: 2rem;
`;

const MembersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const MemberCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  padding: 0.75rem;
  background: white;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Address = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.7rem;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Bio = styled.p`
  padding: 0.75rem;
  margin: 0;
  font-size: 0.8rem;
  color: #4a5568;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NFTSection = styled.div`
  padding: 0 0.75rem;
`;

const NFTGrid = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
`;

const ActionSection = styled.div`
  display: flex;
  padding: 0.75rem;
  gap: 0.5rem;
`;

const Button = styled.button`
  font-family: "Roboto Slab", sans-serif;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const MessageButton = styled(Button)`
  background-color: #4caf50;
  color: white;
`;

const TipButton = styled(Button)`
  background-color: #ffa500;
  color: white;
`;

interface NFT {
  id: string;
  image: string;
}

interface Member {
  id: string;
  name: string;
  address: string;
  bio: string;
  nfts: NFT[];
}

const membersData: Member[] = [
  {
    id: "1",
    name: "John Doe",
    address: "0x1234...5678",
    bio: "Web3 enthusiast and blockchain developer. Passionate about decentralized systems.",
    nfts: [
      { id: "1", image: "/api/placeholder/30/30" },
      { id: "2", image: "/api/placeholder/30/30" },
      { id: "3", image: "/api/placeholder/30/30" }
    ]
  },
  {
    id: "2",
    name: "Jane Smith",
    address: "0x8765...4321",
    bio: "Community builder and DeFi expert. Advocating for financial inclusion through blockchain.",
    nfts: [
      { id: "4", image: "/api/placeholder/30/30" },
      { id: "5", image: "/api/placeholder/30/30" }
    ]
  }
  // Add more members to see the grid layout in action
];

const MembersComponent: React.FC = () => {
  return (
    <PageContainer>
      <h2>BAYC Members (293)</h2>
      <MembersList>
        {membersData.map((member) => (
          <MemberCard key={member.id}>
            <CardHeader>
              <UserProfile>
                <ProfileImage
                  src="https://via.placeholder.com/100"
                  alt="User Profile"
                />
                <UserInfo>
                  <Name>{member.name}</Name>
                  <Address>
                    {member.address}{" "}
                    <ExternalLink
                      size={12}
                      style={{ verticalAlign: "middle", cursor: "pointer" }}
                    />
                  </Address>
                </UserInfo>
              </UserProfile>
            </CardHeader>
            <Bio>{member.bio}</Bio>
            {/* <NFTSection>
              <NFTGrid>
                {member.nfts.slice(0, 3).map((nft) => (
                  <NFTImage key={nft.id} src={nft.image} alt="NFT" />
                ))}
                {member.nfts.length > 3 && (
                  <NFTImage
                    src="/api/placeholder/30/30"
                    alt="More NFTs"
                    style={{ opacity: 0.5 }}
                  />
                )}
              </NFTGrid>
            </NFTSection> */}
            <ActionSection>
              <MessageButton>
                <MessageCircle size={14} style={{ marginRight: "0.25rem" }} />
                Message
              </MessageButton>
              <TipButton>
                <DollarSign size={14} style={{ marginRight: "0.25rem" }} />
                Tip
              </TipButton>
            </ActionSection>
          </MemberCard>
        ))}
      </MembersList>
    </PageContainer>
  );
};

export default MembersComponent;
