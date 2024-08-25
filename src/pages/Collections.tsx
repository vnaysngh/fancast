import styled from "styled-components";
import { myNFTs, nftsJson } from "../constants/nftconstants";
import { useNavigate } from "react-router-dom";

const PageContainer = styled.div`
  background-color: #fff;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const NewItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const NewItemCard = styled.div`
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const ItemImage = styled.img`
  width: 100%;
  object-fit: cover;
  background-color: #ddd;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ItemTitle = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
`;

const Collections = () => {
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    navigate(`/community/${id}`);
  };

  return (
    <PageContainer>
      {/* <Section>
        <SectionTitle>Trending Communities</SectionTitle>
        <Grid>
          {nftsJson.map((nft) => (
            <Card
              key={nft.symbol}
              onClick={() => handleNavigate(nft.openSeaMetadata.collectionSlug)}
            >
              <CardImage src={nft.openSeaMetadata.imageUrl} alt={nft.name} />
              <CardContent>
                <CardTitle>{nft.name}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section> */}

      <Section>
        <SectionTitle>Trending Communities</SectionTitle>
        <NewItemsGrid>
          {myNFTs.map((nft) => (
            <NewItemCard
              key={nft.contract.symbol}
              onClick={() => handleNavigate(nft.contract.address)}
            >
              <ItemImage
                src={nft.image.cachedUrl}
                alt={nft.contract.name ?? ""}
              />
              <ItemInfo>
                <ItemTitle>{nft.contract.name}</ItemTitle>
                {/* <ItemPrice>0.08 ETH</ItemPrice> */}
              </ItemInfo>
            </NewItemCard>
          ))}
        </NewItemsGrid>
      </Section>
    </PageContainer>
  );
};

export default Collections;
