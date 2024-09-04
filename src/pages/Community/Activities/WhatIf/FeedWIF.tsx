import React from "react";
import styled from "styled-components";
import { FiThumbsUp } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";
import { useReadContract } from "wagmi";
import abi from "../../../../abi/abi.json";
interface StoryProps {
  userName: string;
  userAddress: string;
  title: string;
  description: string;
  upvotes: number;
  tips: number;
  onUpvote: () => void;
  onTip: () => void;
}

const StoryCard = styled.div`
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #ccc;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const UserAddress = styled.span`
  font-size: 14px;
  color: #888;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
  font-family: "DM Sans", sans-serif;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  font-family: "Bungee";
  background-color: #0d0c22;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #fff;
    color: #0d0c22;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
    border: 1px solid #0d0c22;
  }

  & > svg {
    margin-right: 8px;
  }
`;

const UpvoteCount = styled.span`
  font-size: 14px;
  margin-right: 10px;
  color: #0d0c22;
`;

const TipCount = styled.span`
  font-size: 14px;
  margin-left: 10px;
  color: #0d0c22;
`;

const Story: React.FC<StoryProps> = ({ onUpvote, onTip }) => {
  const result: any = useReadContract({
    abi,
    address: "0xc97139659d6Ee90A76027E68cd318821956d90dF",
    functionName: "getAllStories"
  });

  return (
    <>
      {result && result.data && result.data.length > 0 ? (
        <>
          {result.data.map((story: any) => {
            return (
              <StoryCard key={story.id}>
                <UserProfile>
                  <ProfileImage
                    src="https://via.placeholder.com/100"
                    alt="User Profile"
                  />
                  <UserInfo>
                    <UserName>vinaysingh.eth</UserName>
                    <UserAddress>{story.author}</UserAddress>
                  </UserInfo>
                </UserProfile>
                <Title>{story.name}</Title>
                <Description>{story.description}</Description>
                <ButtonsContainer>
                  <div>
                    <Button onClick={onUpvote}>
                      <FiThumbsUp />
                      Upvote
                    </Button>
                  </div>
                  <div>
                    <Button onClick={onTip}>
                      <FaCoins />
                      Tip
                    </Button>
                  </div>
                </ButtonsContainer>
              </StoryCard>
            );
          })}
        </>
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default Story;
