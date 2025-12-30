import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  TeacherDashboard,
  HomeLayout,
  Login,
  Landing,
  Logout,
  Register,
  NewSession,
  Nav,
  StudentDashboard,
  ForgotPassword,
} from "./pages/Index";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "teacher-dashboard", element: <TeacherDashboard /> },
      { path: "student-dashboard", element: <StudentDashboard /> },
      { path: "create-session", element: <NewSession /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "logout", element: <Logout /> },
      { path: "*", element: <h1>404 Not Found</h1> },
    ],
  },
]);

function App() {
  return <RouterProvider index router={router} />;
}

export default App;
