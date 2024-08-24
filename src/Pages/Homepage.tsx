import React from "react";
import styled from "styled-components";
import { nftsJson } from "../constants/nftconstants";

const PageContainer = styled.div`
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    3,
    1fr
  ); // Adjusts the grid to have exactly 3 columns
  gap: 20px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardImage = styled.img`
  width: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const CardAuthor = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 14px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const Homepage = () => {
  return (
    <PageContainer>
      <Section>
        <SectionTitle>Trending NFTs across multiple chains</SectionTitle>
        <Grid>
          {nftsJson.map((nft) => (
            <Card key={nft.symbol}>
              <CardImage src={nft.openSeaMetadata.imageUrl} alt={nft.name} />
              <CardContent>
                <CardTitle>{nft.name}</CardTitle>
                {/* <CardAuthor>{}</CardAuthor> */}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>
    </PageContainer>
  );
};

export default Homepage;
