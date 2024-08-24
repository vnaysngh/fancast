import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import XMPTConnect from "./XMPTConnect";

// Styled components
const Community = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
`;

const CommunityChat: React.FC = () => {
  return (
    <Community>
      <XMPTConnect />
    </Community>
  );
};

export default CommunityChat;
