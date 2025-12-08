import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import React from "react";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import StudentLayout from "./StudentLayout";
import InstructorLayout from "./InstructorLayout";
import AdminLAyout from "./AdminLayout";
import Unauthorized from "../pages/Unauthorized";
import InstructorDashboard from "../pages/InstructorDashboard";
import CreateCourse from "../pages/CreateCourse";
import ExternalLoginHandler from "../components/ExternalLoginHandler";
import UserLayout from "./UserLayout";
import DummyPage from "../pages/DummyPage";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      // Public Routes
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/unauthorized", element: <Unauthorized /> },
      { path: "/auth/callback", element: <ExternalLoginHandler /> },

      // Protected Routes (any logged-in user)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <div>Welcome to your Dashboard!</div> },
          { path: "/dummy", element: <DummyPage /> },
        ],
      },

      // Admin only routes - a/
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "/a",
            element: <AdminLAyout />,
            children: [
              { index: true, element: <div>Hi admin</div> },
              { path: "dashboard", element: <div>Admin DashBoard</div> },
            ],
          },
        ],
      },
      // Instructor only routes - i/
      {
        element: <ProtectedRoute allowedRoles={["instructor"]} />,
        children: [
          {
            path: "/i",
            element: <InstructorLayout />,
            children: [
              { index: true, element: <InstructorDashboard /> },
              { path: "create", element: <CreateCourse /> },
            ],
          },
        ],
      },
      // Student only routes - s/
      {
        element: <ProtectedRoute allowedRoles={["student"]} />,
        children: [
          {
            path: "/s",
            element: <StudentLayout />,
            children: [
              { index: true, element: <div>Hi student</div> },
              { path: "dashboard", element: <div>Dashnoard student</div> },
            ],
          },
        ],
      },
      //  User Only Routes
      {
        element: <ProtectedRoute allowedRoles={["user"]} />,
        children: [
          {
            path: "/u",
            element: <UserLayout />,
            children: [
              { index: true, element: <div>Hi User</div> },
              // { path: "dashboard", element: <div>Admin student</div> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <div>404 - Page not found!</div>,
  },
]);

export default router;
