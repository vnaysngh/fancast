import styled from "styled-components";
import { myNFTs } from "../../constants/nftconstants";

// Sample data
const userProfile = {
  username: "jb0x",
  displayName: "📦 jb0x",
  pfpUrl: "https://i.imgur.com/tz3jZ2l.jpg",
  bio: "Steward of /mechanisms and the decentralized metaverse ⟢ lunarpunk yearning @kamigotchi",
  nfts: [
    {
      name: "Kamigotchi",
      imageUrl: "https://i.imgur.com/lYdPt9I.png",
      description: "An NFT from the Kamigotchi collection."
    }
  ]
};

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 100%;
  margin-bottom: 10px;
  border-radius: 8px;
`;

const DisplayName = styled.h2`
  font-size: 24px;
  margin: 10px 0;
  color: #333;
`;

const Username = styled.p`
  font-size: 18px;
  color: #777;
`;

const Bio = styled.p`
  font-size: 16px;
  color: #555;
  text-align: center;
`;

const NFTContainer = styled.div`
  margin-top: 20px;
`;

const NFTCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
`;

const NFTImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const NFTName = styled.h4`
  font-size: 18px;
  color: #333;
  margin: 5px 0;
`;

const NFTDescription = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FeedItem = styled.div`
  padding: 15px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FeedText = styled.p`
  font-size: 16px;
  color: #333;
`;

const Timestamp = styled.p`
  font-size: 12px;
  color: #999;
  text-align: right;
`;

const Profile = () => {
  return (
    <>
      <ProfileContainer>
        <ProfileImage
          src={myNFTs[1].image.cachedUrl}
          alt={userProfile.username}
        />
        <DisplayName>{myNFTs[1].contract.name}</DisplayName>
      </ProfileContainer>

      {/* NFTs Section */}
      <NFTContainer>
        <h3>Owned NFTs</h3>
        {userProfile.nfts.map((nft, index) => (
          <NFTCard key={index}>
            <NFTImage src={nft.imageUrl} alt={nft.name} />
            <NFTName>{nft.name}</NFTName>
            <NFTDescription>{nft.description}</NFTDescription>
          </NFTCard>
        ))}
      </NFTContainer>
    </>
  );
};

export default Profile;
