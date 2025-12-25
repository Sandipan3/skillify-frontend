import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import StudentLayout from "./StudentLayout";
import InstructorLayout from "./InstructorLayout";
import AdminLayout from "./AdminLayout";
import Unauthorized from "../pages/others/Unauthorized";
import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import CreateCourse from "../pages/instructor/CreateCourse";
import ExternalLoginHandler from "../components/ExternalLoginHandler";
import DummyPage from "../pages/others/DummyPage";
import SelectRole from "../pages/auth/SelectRole";
import InstructorCourses from "../pages/instructor/InstructorCourses";
import ManageVideos from "../pages/instructor/ManageVideos";
import EditCourse from "../pages/instructor/EditCourse";
import LandingPage from "../pages/others/LandingPage";
import RegisterVerify from "../pages/auth/RegisterVerify";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgotPassword from "../pages/auth/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      // PUBLIC ROUTES
      { index: true, element: <LandingPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "verify-otp", element: <RegisterVerify /> },
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "auth/callback", element: <ExternalLoginHandler /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },

      //  AUTHENTICATED (any role)
      {
        element: <ProtectedRoute />,
        children: [{ path: "dummy", element: <DummyPage /> }],
      },

      // ADMIN
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "a",
            element: <AdminLayout />,
            children: [
              { index: true, element: <div>Hi admin</div> },
              { path: "dashboard", element: <div>Admin Dashboard</div> },
            ],
          },
        ],
      },

      // INSTRUCTOR
      {
        element: <ProtectedRoute allowedRoles={["instructor"]} />,
        children: [
          {
            path: "i",
            element: <InstructorLayout />,
            children: [
              { index: true, element: <InstructorDashboard /> },
              { path: "create", element: <CreateCourse /> },
              { path: "courses", element: <InstructorCourses /> },
              { path: "courses/:courseId/edit", element: <EditCourse /> },
              { path: "courses/:courseId/videos", element: <ManageVideos /> },
            ],
          },
        ],
      },

      // STUDENT
      {
        element: <ProtectedRoute allowedRoles={["student"]} />,
        children: [
          {
            path: "s",
            element: <StudentLayout />,
            children: [
              { index: true, element: <div>Hi student</div> },
              { path: "dashboard", element: <div>Dashboard student</div> },
            ],
          },
        ],
      },

      // USER
      {
        element: <ProtectedRoute allowedRoles={["user"]} />,
        children: [{ path: "u", element: <SelectRole /> }],
      },
    ],
  },

  // 404
  { path: "*", element: <div>404 - Page not found!</div> },
]);

export default router;
