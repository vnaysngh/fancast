import React, { useState } from "react";
import styled from "styled-components";
import abi from "../../../abi/chiliz.json";
import { useReadContract } from "wagmi";

interface Comment {
  id: number;
  user: string;
  commentText: string;
}

interface Post {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  comments: Comment[];
}

interface CommentPopupProps {
  isLoading: boolean;
  post: any;
  onClose: () => void;
  onComment: (message: string) => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background: white;
  padding: 20px;
  width: 600px;
  border-radius: 8px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const PostTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: bold;
`;

const PostDescription = styled.p`
  font-size: 18px;
  margin: 10px 0;
`;

const CommentSection = styled.div`
  margin-top: 20px;
`;

const CommentContainer = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  background: #f1f1f1;
  border-radius: 8px;
`;

const CommentUser = styled.span`
  font-weight: bold;
  margin-right: 10px;
  color: grey;
`;

const CommentText = styled.p`
  margin: 5px 0 0 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  float: right;
  width: 200px;
  height: auto;
  margin-left: 20px;
`;

const CommentInputWrapper = styled.div`
  margin-top: 20px;
`;

const CommentInput = styled.textarea`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  font-size: 16px;
  width: -webkit-fill-available;
  display: block;
`;

const SubmitButton = styled.button`
  font-family: Bungee;
  margin-top: 10px;
  padding: 10px 20px;
  background: #333;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CommentPopup: React.FC<CommentPopupProps> = ({
  isLoading,
  post,
  onClose,
  onComment
}) => {
  const [newComment, setNewComment] = useState("");
  const comments = useReadContract({
    abi,
    address: "0x9B691a757e9D91Cc138f125f4f386546D5F7fD76",
    functionName: "getCommentsForPost",
    args: [Number(post.id)]
  });

  const handleCommentSubmit = () => {
    onComment(newComment);
  };

  return (
    <Overlay>
      <PopupContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <PostTitle>{post.title}</PostTitle>
        <ImageWrapper>
          <img
            src={post.imageUrl}
            alt="Post Image"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </ImageWrapper>
        <PostDescription>{post.description}</PostDescription>
        <CommentInputWrapper>
          <h4>Comments</h4>
          <CommentInput
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Add a comment..."
          />
          <SubmitButton onClick={handleCommentSubmit}>
            {isLoading ? "Submit tx in your wallet" : "Submit"}
          </SubmitButton>
        </CommentInputWrapper>
        <CommentSection>
          {comments?.data?.map((comment: any) => (
            <CommentContainer key={comment.id}>
              <CommentUser>{comment.author}</CommentUser>
              <CommentText>{comment.content}</CommentText>
            </CommentContainer>
          ))}
        </CommentSection>
      </PopupContainer>
    </Overlay>
  );
};

export default CommentPopup;
