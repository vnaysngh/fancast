import { useEffect, useState } from "react";
import styled from "styled-components";
import { useStateContext } from "../../../context";
import { FaRegMessage } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

const FeedContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    cursor: pointer;
  }
`;

const Username = styled.span`
  font-weight: bold;
  margin-right: 8px;
`;

const Bio = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #999;
  margin-top: 5px;
`;

const FeedData = () => {
  const { membersMetadata } = useStateContext();
  const navigate = useNavigate();
  const { communityId } = useParams<{
    communityId: string;
  }>();

  const handleNavigation = (memberId: string) => {
    if (!communityId) return;
    navigate(
      `/community/${communityId}/inbox/0x05f6E2F2f196db4cD964b230Ac95EDfB436c7461`
    );
  };

  return (
    <FeedContainer>
      {membersMetadata && Object.keys(membersMetadata).length ? (
        Object.keys(membersMetadata).map((member) => {
          const memberData = membersMetadata[member][0];
          return (
            <FeedItem key={memberData.hash}>
              <ProfilePic
                src={memberData?.pfp_url}
                alt={memberData?.username}
              />
              <ContentContainer>
                <Header>
                  <Username>{memberData?.username}</Username>
                  <FaRegMessage onClick={() => handleNavigation(member)} />
                </Header>
                <Bio>{memberData?.profile.bio.text}</Bio>
              </ContentContainer>
            </FeedItem>
          );
        })
      ) : (
        <>fgfg</>
      )}
    </FeedContainer>
  );
};

const Feed = () => {
  return <FeedData />;
};

export default Feed;
