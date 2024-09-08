import React, { useState } from "react";
import styled from "styled-components";
import { useReadContract } from "wagmi";
import abi from "../../../abi/chiliz.json";
import { FiThumbsUp } from "react-icons/fi";
import { useStateContext } from "../../../context";
import { FaRegCommentAlt } from "react-icons/fa";
import CommentPopup from "./Comments";
import TipModal from "./Tip";

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
  width: 100%;
`;

const EventTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 20px;
`;

const EventDetails = styled.p`
  margin: 5px 0;
  font-size: 16px;
`;

const Organizer = styled.p`
  margin: 5px 0;
  font-size: 14px;
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

const EventsFeed: React.FC = () => {
  const { onUpvote, onComment, tipAuthor } = useStateContext();
  const [openTipModal, setOpenTipModal] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [event, setPost] = useState<any>();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tipping, setTipping] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const events: any = useReadContract({
    abi,
    address: "0xFf3d395AcaCC791c3a3eF1710ceEC69A3e153dB2",
    functionName: "getAllEvents"
  });

  const Venue = styled.div`
    text-decoration: underline;
  `;

  const handleLinkRedirect = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <PostsWrapper>
      {/* <h2>Events Feed</h2> */}
      {events?.data?.map((event: any) => (
        <EventCard key={event.id}>
          <EventInfo>
            <Organizer>
              By: {event.organizer.slice(0, 6)}...{event.organizer.slice(-4)}
            </Organizer>
            <EventTitle>Title: {event.title}</EventTitle>
            <EventDetails>Description: {event.description}</EventDetails>
            <EventDetails>Event Type: Meetup</EventDetails>

            <Venue onClick={() => handleLinkRedirect(event.venueLink)}>
              Location
            </Venue>
            <ButtonsContainer>
              <PostMetaDataContainer>
                <Button>
                  <FiThumbsUp />
                </Button>
                <Button>
                  <FaRegCommentAlt />
                </Button>
              </PostMetaDataContainer>
              <Button onClick={() => setOpenTipModal(true)}>
                RSVP{" "}
                <img
                  src="https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x721ef6871f1c4efe730dce047d40d1743b886946/logo.svg"
                  alt="chiliz icon"
                />
              </Button>
            </ButtonsContainer>
          </EventInfo>
        </EventCard>
      ))}
    </PostsWrapper>
  );
};

export default EventsFeed;
