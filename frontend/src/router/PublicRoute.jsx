import { Route, Routes } from "react-router";
import Public from "./Public";

import LandingPage from "../pages/frontend/LandingPage";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";

export default function PublicRoute() {
  return (
    <Routes>
      <Route element={<Public />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
}
