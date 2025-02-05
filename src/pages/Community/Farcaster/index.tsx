import { useEffect, useState } from "react";
import styled from "styled-components";
import sampleFeed from "../../../constants/sampleFeed";
import { useStateContext } from "../../../context";
import { useParams } from "react-router-dom";
import { client } from "../../../neynarClient";
import { FeedType, FilterType } from "@neynar/nodejs-sdk";
import { FeedResponse } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { TokenGate } from "../../../components/TokenGate/tokengate";

const FeedContainer = styled.div`
  margin: 0 auto;
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const FeedItem = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  padding: 15px;
  border: solid 2px #888;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
`;

const ProfilePic = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const Header = styled.div`
  font-size: 1.25rem;
  font-family: "DM Sans", sans-serif;
  display: flex;
  align-items: center;
`;

const Username = styled.span`
  font-weight: bold;
  margin-right: 8px;
`;

const DisplayName = styled.span`
  font-size: 14px;
  color: #666;
`;

const Bio = styled.p`
  font-family: "DM Sans", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #999;
  margin-top: 5px;
`;

const PostText = styled.p`
  font-family: "DM Sans", sans-serif;
  font-size: 1rem;
  color: #333;
  margin: 10px 0;
`;

const Timestamp = styled.p`
  font-size: 12px;
  color: #888;
  margin: 5px 0;
`;

const Reactions = styled.div`
  font-size: 14px;
  color: #555;
  margin-top: 10px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  font-family: "Bungee";
  padding: 10px 15px;
  margin: 0 5px;
  background-color: ${(props) => (props.active ? "#333" : "#f0f0f0")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  cursor: pointer;
  border: solid 2px #888;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);

  &:hover {
    background-color: #333;
    color: #fff;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const FeedData = ({ feed }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // // Calculate indices for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeeds = sampleFeed.slice(indexOfFirstItem, indexOfLastItem);
  const [feeds, setUserFeeds] = useState<FeedResponse>();

  const { membersMetadata } = useStateContext();

  // Calculate total pages
  const totalPages = feeds?.casts
    ? Math.ceil(feeds?.casts?.length / itemsPerPage)
    : 1;

  useEffect(() => {
    const fetchUserFeeds = async () => {
      if (membersMetadata && Object.keys(membersMetadata).length) {
        const fids = Object.keys(membersMetadata).map((member) => {
          return membersMetadata[member][0]?.fid;
        });

        fids.filter((fid) => fid !== undefined);

        if (fids.length) {
          const userFeed = await client.fetchFeed(FeedType.Filter, {
            filterType: FilterType.Fids,
            fids
          });

          setUserFeeds(userFeed);
        }
      }
    };

    fetchUserFeeds();
  }, [membersMetadata]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <TokenGate>
      <FeedContainer>
        <h2>BAYC Casts ({feeds?.casts?.length ?? ""})</h2>
        {feeds?.casts?.map((item: any) => (
          <FeedItem key={item.hash}>
            <ProfilePic
              src={item?.author.pfp_url}
              alt={item?.author.username}
            />
            <ContentContainer>
              <Header>
                <Username>{item?.author.username}</Username>
                <DisplayName>{item?.author.display_name}</DisplayName>
              </Header>
              <Bio>{item?.author.profile.bio.text}</Bio>
              <PostText>{item.text}</PostText>
              <Timestamp>{new Date(item.timestamp).toLocaleString()}</Timestamp>
              {/* <ChannelInfo>
              <ChannelImage
                src={item.channel?.image_url}
                alt={item.channel?.name}
              />
              <ChannelName>{item.channel?.name}</ChannelName>
            </ChannelInfo> */}
              <Reactions>
                ❤️ {item.reactions?.likes_count} • 🔁{" "}
                {item.reactions?.recasts_count} • 💬 {item.replies?.count}
              </Reactions>
            </ContentContainer>
          </FeedItem>
        ))}

        {/* Pagination Controls */}
        <PaginationContainer>
          <PageButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </PageButton>

          {/* Dynamically render page numbers */}
          {Array.from({ length: totalPages }, (_, index) => (
            <PageButton
              key={index + 1}
              active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PageButton>
          ))}

          <PageButton
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </PageButton>
        </PaginationContainer>
      </FeedContainer>
    </TokenGate>
  );
};

const Feed = () => {
  return <FeedData feed={sampleFeed} />;
};

export default Feed;
