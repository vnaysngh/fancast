import React, { lazy, Suspense } from "react";
import Loader from "../Loader";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import HeaderComponent from "../Header";
import styled from "styled-components";

const Homepage = lazy(() => import("../../pages/Collections"));
const Community = lazy(() => import("../../pages/Community"));

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
            <Route path="/community/:communitySlug" element={<Community />} />
          </Routes>
        </Suspense>
      </RoutesContainer>
    </>
  );
};
