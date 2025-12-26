import { createBrowserRouter } from "react-router-dom";
//admin pages

//auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import SelectRole from "../pages/auth/SelectRole";
import RegisterVerify from "../pages/auth/RegisterVerify";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgotPassword from "../pages/auth/ForgotPassword";
//instructor pages
import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import CreateCourse from "../pages/instructor/CreateCourse";
import InstructorCourses from "../pages/instructor/InstructorCourses";
import ManageVideos from "../pages/instructor/ManageVideos";
import EditCourse from "../pages/instructor/EditCourse";
//student pages
import StudentDashboard from "../pages/student/StudentDashboard";
import BrowseCourses from "../pages/student/BrowseCourses";
import Checkout from "../pages/student/Checkout";
import CoursePlayer from "../pages/student/CoursePlayer";
import CoursePreview from "../pages/student/CoursePreview";
import MyCourses from "../pages/student/MyCourses";
import PaymentStatus from "../pages/student/PaymentStatus";
//other pages
import Unauthorized from "../pages/others/Unauthorized";
import LandingPage from "../pages/others/LandingPage";
import DummyPage from "../pages/others/DummyPage";
//components
import ProtectedRoute from "../components/ProtectedRoute";
import ExternalLoginHandler from "../components/ExternalLoginHandler";
//layouts
import StudentLayout from "./StudentLayout";
import InstructorLayout from "./InstructorLayout";
import AdminLayout from "./AdminLayout";

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
              { index: true, element: <StudentDashboard /> },
              { path: "courses", element: <BrowseCourses /> },
              { path: "my-courses", element: <MyCourses /> },
              { path: "courses/:courseId", element: <CoursePreview /> },
              { path: "learn/:courseId", element: <CoursePlayer /> },
              { path: "checkout/:courseId", element: <Checkout /> },
              { path: "payment-status", element: <PaymentStatus /> },
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
