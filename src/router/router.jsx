import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import StudentLayout from "./StudentLayout";
import InstructorLayout from "./InstructorLayout";
import AdminLayout from "./AdminLayout";
import Unauthorized from "../pages/Unauthorized";
import InstructorDashboard from "../pages/InstructorDashboard";
import CreateCourse from "../pages/CreateCourse";
import ExternalLoginHandler from "../components/ExternalLoginHandler";
import DummyPage from "../pages/DummyPage";
import SelectRole from "../pages/SelectRole";
import InstructorCourses from "../pages/InstructorCourses";
import ManageVideos from "../pages/ManageVideos";
import CourseStudents from "../pages/CourseStudents";
import EditCourse from "../pages/EditCourse";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      // PUBLIC ROUTES
      { index: true, element: <LandingPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "auth/callback", element: <ExternalLoginHandler /> },

      // 🔐 AUTHENTICATED (any role)
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
              {
                path: "courses/:courseId/students",
                element: <CourseStudents />,
              },
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
