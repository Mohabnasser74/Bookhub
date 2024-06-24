import { Suspense, lazy } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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

function App() {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<h1>LOADING...</h1>}>
      <UserProvider>
        <Routes>
          <Route path="/" element={<AppHeader />}>
            <Route index element={<Home />} />
            <Route
              path=":username/:id"
              element={<ShowBook />}
              loader={async ({ params }) => {
                const data = await (
                  await fetch(`${api}/books/${params.username}/${params.id}`, {
                    method: "GET",
                    credentials: "include",
                  })
                ).json();
                return data;
              }}
            />
            <Route path="new" element={<CreateBooks />} />
            <Route path=":username/:id/edit" element={<EditBook />} />
            <Route path=":username/:id/delete" element={<DeleteBooks />} />
          </Route>
          <Route path="/:username" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </UserProvider>
    </Suspense>
  );
}

export default App;
