import React, { useState } from "react";
import styled from "styled-components";
import { FiThumbsUp } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";
import { useAccount, useReadContract } from "wagmi";
import abi from "../../../../abi/abi.json";
import { useNavigate, useParams } from "react-router-dom";
import TipModal from "../../Chiliz/Tip";
import { useStateContext } from "../../../../context";
import { OAPP } from "../../../../constants/contract";
import { sepolia } from "wagmi/chains";
import { TokenGate } from "../../../../components/TokenGate/tokengate";

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

const TabsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

const Tabs = styled.div`
  display: flex;
  gap: 20px;
`;

const TabButton = styled.button<{ active: boolean; firstTab?: boolean }>`
  font-family: "Bungee", sans-serif;
  color: ${(props) => (props.active ? "#333" : "#555")};
  border: none;
  background-color: transparent;
  font-size: 1.25rem;
  cursor: pointer;
  border-bottom: ${(props) => (props.active ? "2px solid #333" : 0)};
  font-weight: ${(props) => (props.active ? 900 : "normal")};
  padding-left: ${(props) => (props.firstTab ? 0 : "inherit")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Main container that includes sidebar and content
const MainContainer = styled.div`
  display: flex;
  margin: 1rem 0;
  // margin-left: 250px; /* This leaves space for the sidebar */
`;

const ContentWrapper = styled.div`
  // padding: 20px;
  flex-grow: 1;
`;

const StoryCard = styled.div`
  border-radius: 4px;
  padding: 20px 0;
  // margin: 20px 0;
  border-bottom: 2px solid #ccc;
  // box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const TextContent = styled.div`
  flex: 2;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const StoryImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  object-fit: contain;
  min-height: 200px;
  max-height: 200px;
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
  background: #f4f4f4;
  gap: 1rem;
  padding: 10px;
  width: fit-content;
  border-radius: 8px;
`;

const Button = styled.button`
  font-family: "Bungee";
  background-color: transparent;
  // border-radius: 4px;
  border: 0;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;

  img {
    height: 1.5rem;
    width: 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: end;
`;

const CreateButton = styled.button`
  font-family: "Bungee";
  background: #333;
  border: none;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;

  &:hover {
    background-color: #fff;
    color: #333;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
    border: 1px solid #333;
  }
`;

const Story = () => {
  const { tipAuthor } = useStateContext();
  const [openTipModal, setOpenTipModal] = useState(false);
  const [activeTab, setActiveTab] = useState("explore");
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
  const handleNavigation = (path: string) => {
    navigate(`/community/${communityId}/discussions/${path}`);
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

  return (
    <>
      {/*  <TipModal
        isOpen={openTipModal}
        onClose={handleCloseTipModal}
        onTip={onTip}
        tipping={tipping}
        setTipAmount={setTipAmount}
        tipAmount={tipAmount}
        txHash={txHash}
      /> */}

      <TabsContainer>
        <Tabs>
          <TabButton
            firstTab
            active={activeTab === "explore"}
            onClick={() => setActiveTab("explore")}
          >
            Explore
          </TabButton>
        </Tabs>
        <CreateButton onClick={() => handleNavigation("create")}>
          Create
        </CreateButton>
      </TabsContainer>

      <MainContainer>
        <ContentWrapper>
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
                    <ContentContainer>
                      <TextContent>
                        <Description>{story.description}</Description>
                      </TextContent>
                    </ContentContainer>
                    <ButtonsContainer>
                      <Button onClick={onUpvote}>
                        <FiThumbsUp />
                      </Button>
                      <Button onClick={() => setOpenTipModal(true)}>
                        <img
                          src="https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x721ef6871f1c4efe730dce047d40d1743b886946/logo.svg"
                          alt="chiliz icon"
                        />
                      </Button>
                    </ButtonsContainer>
                  </StoryCard>
                );
              })}
            </>
          ) : (
            "No stories found"
          )}
        </ContentWrapper>
      </MainContainer>
    </>
  );
};

export default Story;
