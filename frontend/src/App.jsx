import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "./components/Spinner";
import AppHeader from "./components/home/AppHeader";
import UserProvider from "./components/UserProvider";

const Home = lazy(() => import("./pages/Home"));
const CreateBooks = lazy(() => import("./pages/CreateBooks"));
const ShowBook = lazy(() => import("./pages/ShowBook"));
const DeleteBooks = lazy(() => import("./pages/DeleteBook"));
const EditBook = lazy(() => import("./pages/EditBook"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route
          element={
            <UserProvider>
              <AppHeader />
            </UserProvider>
          }>
          <Route
            path="/"
            element={
              <UserProvider>
                <Home />
              </UserProvider>
            }
          />
          <Route
            path="/:username/:id"
            element={
              <UserProvider>
                <ShowBook />
              </UserProvider>
            }
          />
          <Route
            path="/:username/:id/edit"
            element={
              <UserProvider>
                <EditBook />
              </UserProvider>
            }
          />
          <Route
            path="/:username/:id/delete"
            element={
              <UserProvider>
                <DeleteBooks />
              </UserProvider>
            }
          />
          <Route
            path="/new"
            element={
              <UserProvider>
                <CreateBooks />
              </UserProvider>
            }
          />
        </Route>
        <Route
          path="/:username"
          element={
            <UserProvider>
              <Profile />
            </UserProvider>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Suspense>
  );
}

export default App;
