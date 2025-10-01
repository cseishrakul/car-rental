import { Route, Routes } from "react-router";
import Home from "../pages/Dashboard/Home";
import UserProfiles from "../pages/UserProfile";
import AddManager from '../pages/Manager/AddManager'

import AppLayout from "../layout/AppLayout";
import Protect from "./Protect";
import AddCar from "../pages/Cars/AddCar";

export default function ProtectedRoute() {
  return (
    <Routes>
      <Route element={<Protect />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/dashboard/profile" element={<UserProfiles />} />
          <Route path="/dashboard/add-manager" element={<AddManager />} />
          <Route path="/dashboard/add-car" element={<AddCar />} />
        </Route>
      </Route>
    </Routes>
  );
}
