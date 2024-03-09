import { Routes, Route, Navigate } from "react-router-dom";
import {
  AdminDashboard,
  TourDetailsAdmin,
  UpdateProfile,
  TouristDashboard,
  Error,
  Verify,
  ForgotPassword,
  ResetPassword,
  Login,
  Register,
  CreateTour,
  UpdateTour,
  ManageUsers,
  AboutUs,
  ShowTours,
} from "../pages";
import Home from "../pages/Home";
import Tours from "../pages/Tours";
import TourDetails from "../pages/TourDetails";
import PrivateRoute from "../shared/PrivateRoute";
import Newsletter from "../shared/Newsletter";
import SearchResultList from "../pages/SearchResultList";
import CartItems from '../pages/tourist/CartItems';
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/contact-us" element={<Newsletter />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/tour/:id" element={<TourDetailsAdmin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" exact element={<ForgotPassword />}></Route>
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/user/verify-email" exact element={<Verify />}></Route>
      <Route
        path="/user/reset-password"
        exact
        element={<ResetPassword />}
      ></Route>

      <Route
        path="/tourist/dashboard"
        element={
          <PrivateRoute roles={"tourist"}>
            <TouristDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<UpdateProfile />} />
        <Route path = {'cart'} element={<CartItems />} />
      </Route>

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute roles={"admin"}>
            <AdminDashboard />
          </PrivateRoute>
        }
      >
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="view-tours" element={<ShowTours />} />
        <Route path="update-tour/:id" element={<UpdateTour />} />
        <Route path="create-tour" element={<CreateTour />} />
        <Route index element={<UpdateProfile />} />
      </Route>
      <Route path="*" element={<Error />}></Route>
    </Routes>
  );
};

export default Routers;
