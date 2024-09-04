import React, { useState } from "react";
import styled from "styled-components";
import { FiThumbsUp } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";
import { useAccount, useReadContract } from "wagmi";
import abi from "../../../../abi/abi.json";
import { useNavigate, useParams } from "react-router-dom";
import TipModal from "./Tip";
import { useStateContext } from "../../../../context";
import { OAPP } from "../../../../constants/contract";
import { sepolia } from "wagmi/chains";

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
  border-radius: 4px;
  padding: 20px;
  margin: 20px 0;
  border: 2px solid #ccc;
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
  gap: 1rem;
`;

const Button = styled.button`
  font-family: "Bungee";
  background-color: transparent;
  // color: #0d0c22;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: end;
`;

const CreateButton = styled.button`
  font-family: "Bungee";
  background: #0d0c22;
  border: none;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;

  &:hover {
    background-color: #fff;
    color: #0d0c22;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
    border: 1px solid #0d0c22;
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

const Story: React.FC<StoryProps> = () => {
  const { tipAuthor } = useStateContext();
  const [openTipModal, setOpenTipModal] = useState(false);
  const [tipping, setTipping] = useState(false);
  const [tipAmount, setTipAmount] = useState<string>("");
  const [txHash, setTxHash] = useState(null);
  const { communityId } = useParams<{ communityId: string }>();
  const account = useAccount();
  const navigate = useNavigate();

  const result: any = useReadContract({
    abi,
    address: OAPP[account?.chainId ?? sepolia.id],
    functionName: "getAllStories"
  });

  // Utility function for navigation
  const handleNavigation = (actionType: string) => {
    navigate(`/community/${communityId}/what-if/${actionType}`);
  };

  const onTip = async () => {
    setTipping(true);
    const response = await tipAuthor(tipAmount);
    if (response && response.transactionHash) {
      setTxHash(response.transactionHash);
      setTipAmount("");
    }
    setTipping(false);
  };

  const handleCloseTipModal = () => {
    setOpenTipModal(false);
  };

  const onUpvote = () => {
    // tipAuthor(amount)
  };

  console.log(result, "result");

  return (
    <>
      <TipModal
        isOpen={openTipModal}
        onClose={handleCloseTipModal}
        onTip={onTip}
        tipping={tipping}
        setTipAmount={setTipAmount}
        tipAmount={tipAmount}
        txHash={txHash}
      />
      <Header>
        <CreateButton onClick={() => handleNavigation("create")}>
          Create
        </CreateButton>
      </Header>
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
                    </Button>
                  </div>
                  <div>
                    <Button onClick={() => setOpenTipModal(true)}>
                      <FaCoins />
                    </Button>
                  </div>
                </ButtonsContainer>
              </StoryCard>
            );
          })}
        </>
      ) : (
        "No what if found"
      )}
    </>
  );
};

export default Story;
