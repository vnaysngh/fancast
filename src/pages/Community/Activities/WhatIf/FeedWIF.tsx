import React from "react";
import styled from "styled-components";
import { FiThumbsUp } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";

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
  font-family: "Roboto Slab", sans-serif;
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

const Story: React.FC<StoryProps> = ({
  userName,
  userAddress,
  title,
  description,
  upvotes,
  tips,
  onUpvote,
  onTip
}) => {
  return (
    <StoryCard>
      <UserProfile>
        <ProfileImage
          src="https://via.placeholder.com/100"
          alt="User Profile"
        />
        <UserInfo>
          <UserName>vinaysingh.eth</UserName>
          <UserAddress>0x0B95ec21579aee6Ef7b712976bD86689D68b5A08</UserAddress>
        </UserInfo>
      </UserProfile>
      <Title>First What If</Title>
      <Description>
        In a futuristic twist, FIFA decides to host the 2026 World Cup on a
        specially designed space station orbiting Earth. The tournament, dubbed
        “World Cup Galactica,” takes place in zero gravity, requiring players to
        adapt to the challenges of a weightless environment. Messi, Ronaldo, and
        Mbappé—all a decade older—are selected as team captains in this
        once-in-a-lifetime event. But the real surprise comes when the
        tournament is crashed by an alien team, claiming they invented football
        centuries ago. The final match between Earth’s all-stars and the
        extraterrestrial team is broadcast across the galaxy, with the fate of
        football’s true origins hanging in the balance.
      </Description>
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
};

export default Story;
