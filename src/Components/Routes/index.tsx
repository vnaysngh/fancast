import React, { lazy, Suspense } from "react";
import Loader from "../Loader";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import HeaderComponent from "../Header";
import styled from "styled-components";

const Homepage = lazy(() => import("../../pages/Collection"));
const Community = lazy(() => import("../../pages/Community"));
const Inbox = lazy(() => import("../../pages/Community/Inbox"));
const WhatIf = lazy(() => import("../../pages/Community/Activities/WhatIf"));
const Members = lazy(() => import("../../pages/Community/Members"));
const Casts = lazy(() => import("../../pages/Community/Farcaster"));
const UFC = lazy(() => import("../../pages/Community/UFC"));
const Chiliz = lazy(() => import("../../pages/Community/Chiliz"));

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
              path="/community/:communityId/discussions"
              element={<WhatIf />}
            />
            <Route
              path="/community/:communityId/discussions/create"
              element={<WhatIf />}
            />
            <Route
              path="/community/:communityId/discussions/feed"
              element={<WhatIf />}
            />
            <Route path="/community/:communityId/casts" element={<Casts />} />
            <Route path="/community/ufc" element={<UFC />} />
            <Route
              path="/community/:communityId/members"
              element={<Members />}
            />
            <Route
              path="/community/:communityId/inbox/:memberId"
              element={<Inbox />}
            />
            <Route path="/community/chiliz" element={<Chiliz />} />
          </Routes>
        </Suspense>
      </RoutesContainer>
    </>
  );
};
