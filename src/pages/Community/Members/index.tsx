import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useStateContext } from "../../../context";
import { FaRegMessage } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { TokenGate } from "../../../components/TokenGate/tokengate";
import { ONFT } from "../../../constants/contract";
import { useAccount, useReadContract } from "wagmi";
import ERC721ABI from "../../../abi/erc721.json";

const FeedContainer = styled.div`
  margin-top: 10px;
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
  const { subscribed } = useStateContext();
  const navigate = useNavigate();
  const { communityId } = useParams<{
    communityId: string;
  }>();
  const account = useAccount();

  const handleNavigation = (memberId: string) => {
    if (!communityId) return;
    navigate(`/community/${communityId}/inbox`);
  };

  const communityMembers: any = useReadContract({
    abi: ERC721ABI,
    address: ONFT[account.chainId!],
    functionName: "getCommunityMembers",
    args: [communityId!]
  });

  const currentCommunity = useMemo(() => {
    if (communityId && subscribed.length) {
      return subscribed?.find((community: any) => {
        return community.contract.toLowerCase() === communityId.toLowerCase();
      });
    }
  }, [communityId, subscribed]);

  return (
    <TokenGate>
      <FeedContainer>
        {communityMembers && communityMembers.data?.length ? (
          communityMembers.data?.map((member: string) => {
            console.log(member);
            return (
              <FeedItem key={member}>
                <ProfilePic
                  src={currentCommunity?.display_image_url}
                  alt={""}
                />
                <ContentContainer>
                  <Header>
                    <Username>
                      {member.slice(0, 6)}...{member.slice(-4)}
                    </Username>
                    <FaRegMessage onClick={() => handleNavigation(member)} />
                  </Header>
                  <Bio>
                    {currentCommunity?.name}: Token Id:{" "}
                    {currentCommunity?.identifier}
                  </Bio>
                </ContentContainer>
              </FeedItem>
            );
          })
        ) : (
          <Header>Members not found</Header>
        )}
      </FeedContainer>
    </TokenGate>
  );
};

const Feed = () => {
  return <FeedData />;
};

export default Feed;
