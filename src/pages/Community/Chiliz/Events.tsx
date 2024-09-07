import React, { useState } from "react";
import styled from "styled-components";
import { useReadContract } from "wagmi";
import abi from "../../../abi/chiliz.json";
import { FiThumbsUp } from "react-icons/fi";
import { useStateContext } from "../../../context";
import {
  FaInfoCircle,
  FaMapMarkerAlt,
  FaRegCommentAlt,
  FaUser
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";

const EventsFeedWrapper = styled.div`
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

const EventImage = styled.img`
  width: 30%;
  border-radius: 8px;
  object-fit: cover;
`;

const EventTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 20px;
`;

const Organiser = styled.p`
  color: #333;
  margin: 0;
  font-weight: 500;
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

const EventDetails = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
  font-size: 14px;
  color: #666;
`;

const Icon = styled.span`
  margin-right: 8px;
  color: #fe1156;
  font-size: 1rem;
  display: flex;
  align-items: center;
`;

const EventDescription = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 10px 0;
`;

const RSVPButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border-radius: 4px;
  border-radius: #fe1156;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #e0004e;
  }
`;

const EventsFeed: React.FC = () => {
  const events: any = useReadContract({
    abi,
    address: "0x34525DA6ee8Ca1394d7a12e83BB15B2516802bF1",
    functionName: "getAllEvents"
  });

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  console.log(events);

  return (
    <EventsFeedWrapper>
      <h2>Trending Events</h2>
      {/* <h2>Events Feed</h2> */}
      {events?.data?.map((event: any) => (
        <EventCard key={event.id}>
          <EventInfo>
            <EventTitle>{event.title}</EventTitle>
            <EventDescription>
              {truncateText(event.description, 80)}
            </EventDescription>
            <EventDetails>
              <Icon>
                <FaUser />
              </Icon>
              {event.organizer.slice(0, 6)}...{event.organizer.slice(-4)}
            </EventDetails>
            <EventDetails>
              <Icon>
                <FaMapMarkerAlt />
              </Icon>
              {event.venueLink}
            </EventDetails>
            <RSVPButton>
              <Icon style={{ height: "1.5rem", width: "1.5rem" }}>
                <img src="https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x721ef6871f1c4efe730dce047d40d1743b886946/logo.svg" />
              </Icon>
              RSVP with CHZ
            </RSVPButton>
          </EventInfo>
        </EventCard>
      ))}
    </EventsFeedWrapper>
  );
};

export default EventsFeed;
