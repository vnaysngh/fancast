import React, { lazy, Suspense } from "react";
import Loader from "../Components/Loader";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import HeaderComponent from "../Header";
import styled from "styled-components";

const Homepage = lazy(() => import("../pages/Collections"));
const Chat = lazy(() => import("../pages/Chat"));
// const Profile = lazy(() => import("./pages/Profile"));

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
            <Route path="/community/:communitySlug" element={<Chat />} />
          </Routes>
        </Suspense>
      </RoutesContainer>
    </>
  );
};
