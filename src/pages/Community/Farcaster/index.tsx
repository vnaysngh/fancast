import { useState } from "react";
import styled from "styled-components";
import sampleFeed from "../../../constants/sampleFeed";

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
  display: flex;
  align-items: center;
  margin-bottom: 8px;
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
  font-size: 12px;
  color: #999;
  margin-top: 5px;
`;

const PostText = styled.p`
  font-size: 16px;
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

const ChannelInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const ChannelImage = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
`;

const ChannelName = styled.span`
  font-size: 14px;
  color: #777;
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
  background-color: ${(props) => (props.active ? "#0d0c22" : "#f0f0f0")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  cursor: pointer;
  border: solid 2px #888;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);

  &:hover {
    background-color: #0d0c22;
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

  // Calculate indices for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeeds = sampleFeed.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(sampleFeed.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <FeedContainer>
      <h2>BAYC Casts (4332)</h2>
      {currentFeeds.map((item: any) => (
        <FeedItem key={item.hash}>
          <ProfilePic src={item.author.pfp_url} alt={item.author.username} />
          <ContentContainer>
            <Header>
              <Username>{item.author.username}</Username>
              <DisplayName>{item.author.display_name}</DisplayName>
            </Header>
            <Bio>{item.author.profile.bio.text}</Bio>
            <PostText>{item.text}</PostText>
            <Timestamp>{new Date(item.timestamp).toLocaleString()}</Timestamp>
            <ChannelInfo>
              <ChannelImage
                src={item.channel?.image_url}
                alt={item.channel?.name}
              />
              <ChannelName>{item.channel?.name}</ChannelName>
            </ChannelInfo>
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
  );
};

const Feed = () => {
  return <FeedData feed={sampleFeed} />;
};

export default Feed;
