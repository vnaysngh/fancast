import React, { lazy, Suspense } from "react";
import Loader from "../Loader";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import HeaderComponent from "../Header";
import styled from "styled-components";

const Homepage = lazy(() => import("../../pages/Collections"));
const Community = lazy(() => import("../../pages/Community"));
const Inbox = lazy(() => import("../../pages/Community/Inbox"));
const WhatIf = lazy(() => import("../../pages/Community/Activities/WhatIf"));
const Members = lazy(() => import("../../pages/Community/Members"));

const RoutesContainer = styled.div`
  max-width: 80%;
  margin: 0 auto;
`;

export const Router = () => {
  return (
    <>
      <HeaderComponent />
      <RoutesContainer>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/community/:communityId" element={<Community />} />
            <Route path="/community/:communityId/inbox" element={<Inbox />} />
            <Route
              path="/community/:communityId/what-if"
              element={<WhatIf />}
            />
            <Route
              path="/community/:communityId/what-if/create"
              element={<WhatIf />}
            />
            <Route
              path="/community/:communityId/what-if/feed"
              element={<WhatIf />}
            />
            <Route
              path="/community/:communityId/members"
              element={<Members />}
            />
            <Route
              path="/community/:communityId/inbox/:memberId"
              element={<Inbox />}
            />
          </Routes>
        </Suspense>
      </RoutesContainer>
    </>
  );
};
