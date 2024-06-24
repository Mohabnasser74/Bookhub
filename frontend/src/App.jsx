import { Suspense, lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes,
} from "react-router-dom";
import Spinner from "./components/Spinner";
import AppHeader from "./components/AppHeader";
import UserProvider from "./components/UserProvider";

const Home = lazy(() => import("./pages/Home"));
const CreateBooks = lazy(() => import("./pages/CreateBooks"));
const ShowBook = lazy(() => import("./pages/ShowBook"));
const DeleteBooks = lazy(() => import("./pages/DeleteBook"));
const EditBook = lazy(() => import("./pages/EditBook"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

// API Endpoint
export const api = "https://bookhub-ik4s.onrender.com";

const showBookLoader = async ({ params }) => {
  const response = await fetch(`${api}/books/${params.username}/${params.id}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  return data;
};

const routes = createRoutesFromElements(
  <Routes>
    <Route path="/" element={<AppHeader />}>
      <Route index element={<Home />} />
      <Route
        path=":username/:id"
        element={<ShowBook />}
        loader={showBookLoader}
      />
      <Route path="new" element={<CreateBooks />} />
      <Route path=":username/:id/edit" element={<EditBook />} />
      <Route path=":username/:id/delete" element={<DeleteBooks />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
    <Route path="/:username" element={<Profile />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
  </Routes>
);

const router = createBrowserRouter(routes);

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </Suspense>
  );
}

export default App;
