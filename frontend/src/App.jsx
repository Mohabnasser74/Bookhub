import { Suspense, lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Spinner from "./components/Spinner";
import AppHeader from "./components/AppHeader";
import UserProvider from "./components/UserProvider";
import { api } from "./main";

const Home = lazy(() => import("./pages/Home"));
const CreateBooks = lazy(() => import("./pages/CreateBooks"));
const ShowBook = lazy(() => import("./pages/ShowBook"));
const DeleteBooks = lazy(() => import("./pages/DeleteBook"));
const EditBook = lazy(() => import("./pages/EditBook"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

const showBookLoader = async ({ params }) => {
  const response = await fetch(`${api}/books/${params.username}/${params.id}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  return data;
};

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<AppHeader />}>
      <Route
        index
        element={
          <Suspense fallback={<Spinner />}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path=":username/:id"
        element={
          <Suspense fallback={<Spinner />}>
            <ShowBook />
          </Suspense>
        }
        loader={showBookLoader}
      />
      <Route
        path="new"
        element={
          <Suspense fallback={<Spinner />}>
            <CreateBooks />
          </Suspense>
        }
      />
      <Route
        path=":username/:id/edit"
        element={
          <Suspense fallback={<Spinner />}>
            <EditBook />
          </Suspense>
        }
      />
      <Route
        path=":username/:id/delete"
        element={
          <Suspense fallback={<Spinner />}>
            <DeleteBooks />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<Spinner />}>
            <PageNotFound />
          </Suspense>
        }
      />
    </Route>
    <Route
      path="/:username"
      element={
        <Suspense fallback={<Spinner />}>
          <Profile />
        </Suspense>
      }
    />
    <Route
      path="/login"
      element={
        <Suspense fallback={<Spinner />}>
          <Login />
        </Suspense>
      }
    />
    <Route
      path="/signup"
      element={
        <Suspense fallback={<Spinner />}>
          <SignUp />
        </Suspense>
      }
    />
  </>
);

const router = createBrowserRouter(routes);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
