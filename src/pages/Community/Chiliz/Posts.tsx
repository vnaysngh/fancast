import React, { useState } from "react";
import styled from "styled-components";
import { useReadContract } from "wagmi";
import abi from "../../../abi/chiliz.json";
import { FiThumbsUp } from "react-icons/fi";
import { useStateContext } from "../../../context";
import { FaRegCommentAlt } from "react-icons/fa";
import CommentPopup from "./Comments";
import TipModal from "./Tip";
import { SpicyContract } from "../../../constants/contract";

const PostsWrapper = styled.div`
  font-family: "DM Sans", sans-serif;
  display: flex;
  flex-direction: column;
  max-width: 800px;
`;

const EventCard = styled.div`
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  gap: 15px;
`;

const EventInfo = styled.div`
  width: 70%;
`;

const EventImage = styled.img`
  width: 30%;
  border-radius: 8px;
  object-fit: cover;
`;

const EventTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 20px;
`;

const EventDetails = styled.p`
  margin: 5px 0;
  font-size: 16px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
`;

const PostMetaDataContainer = styled.div`
  display: flex;
  padding: 10px 0;
  align-items: center;
  gap: 0.5rem;
`;

const Button = styled.button`
  font-family: "Bungee";
  background-color: transparent;
  color: #333;
  border: 0;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 5px;

  img {
    height: 1.25rem;
    width: 1.25rem;
  }
`;

const TipButton = styled(Button)``;

const EventsFeed: React.FC = () => {
  const { onUpvote, onComment, tipAuthor } = useStateContext();
  const [openTipModal, setOpenTipModal] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [post, setPost] = useState<any>();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tipping, setTipping] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const posts: any = useReadContract({
    abi,
    address: SpicyContract,
    functionName: "getAllPosts"
  });

  const openComments = (post: any) => {
    setIsCommentsOpen(true);
    setPost(post);
  };

  const upvotePost = async (id: any) => {
    const response = onUpvote(Number(id));
    if (response) {
      setTxHash(response);
    }
  };

  const onTip = async () => {
    setTipping(true);
    const response = await tipAuthor(activeTab);
    if (response && response.transactionHash) {
      setTxHash(response.transactionHash);
    }
    setTipping(false);
  };

  const handleCloseTipModal = () => {
    setOpenTipModal(false);
  };

  const commentPost = async (message: string) => {
    if (!post || !post.id) return;
    setIsLoading(true);
    const response = onComment(Number(post?.id), message);
    if (response) {
      setTxHash(response);
    }
    setIsLoading(false);
  };

  return (
    <PostsWrapper>
      <TipModal
        isOpen={openTipModal}
        onClose={handleCloseTipModal}
        onTip={onTip}
        tipping={tipping}
        txHash={txHash}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {isCommentsOpen && post && post?.id && (
        <CommentPopup
          isLoading={isLoading}
          post={post}
          onClose={() => setIsCommentsOpen(false)}
          onComment={commentPost}
        />
      )}
      {/* <h2>Events Feed</h2> */}
      {posts?.data?.map((post: any) => (
        <EventCard key={post.id}>
          <EventInfo>
            <EventTitle>Title: {post.title}</EventTitle>
            <EventDetails>Description: {post.description}</EventDetails>
            <ButtonsContainer>
              <PostMetaDataContainer>
                <Button onClick={() => upvotePost(post.id)}>
                  <FiThumbsUp /> {post.upvotes.toString()}
                </Button>
                <Button onClick={() => openComments(post)}>
                  <FaRegCommentAlt /> {post.commentCount.toString()}
                </Button>
              </PostMetaDataContainer>
              <TipButton onClick={() => setOpenTipModal(true)}>
                <img
                  src="https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x721ef6871f1c4efe730dce047d40d1743b886946/logo.svg"
                  alt="chiliz icon"
                />
              </TipButton>
            </ButtonsContainer>
          </EventInfo>
          <EventImage src={post.imageUrl} alt="Event Image" />
        </EventCard>
      ))}
    </PostsWrapper>
  );
};

export default EventsFeed;
