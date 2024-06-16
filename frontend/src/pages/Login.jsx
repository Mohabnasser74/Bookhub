import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../main";
import Spinner from "../components/Spinner";
import { useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const return_to = queryParams.get("return_to");

  useEffect(() => {
    (async () => {
      setAuthLoading(true);
      const authData = await (
        await fetch(`${api}/auth/check-auth`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
      ).json();
      if (authData.isAuthenticated) {
        setAuthLoading(false);
        return_to ? navigate(`${return_to}`) : navigate("/");
        return;
      } else setAuthLoading(false);
    })();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await (
        await fetch(`${api}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
          credentials: "include", // Include cookies in the request
        })
      ).json();
      if (
        data.status === "fail" ||
        (data.status === "error" && data.code !== (200 || 201))
      ) {
        setLoading(false);
        enqueueSnackbar(data.message, { variant: "error" });
        return;
      }
      if (data.code === 201 || data.status === "success") {
        setLoading(false);
        enqueueSnackbar("Login Successfully", {
          variant: "success",
        });
        return_to ? navigate(`${return_to}`) : navigate("/");
        return;
      }
      if (data.code === 400) {
        setLoading(false);
        enqueueSnackbar(data.message, {
          variant: "warning",
        });
        return;
      }
      if (data.code === 404) {
        setLoading(false);
        enqueueSnackbar(data.message, {
          variant: "error",
        });
        return;
      }
    } catch (error) {
      setLoading(false);

      console.error(error.message);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  if (authLoading) return <Spinner />;

  return (
    <div className="p-4">
      <h1 className="text-3xl my-4">Login</h1>
      <div className="my-4 mx-auto border-y-gray-600 border-solid border rounded-xl w-fit p-4">
        <div className="my-4 flex flex-col w-96">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl outline-none text-black"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl outline-none text-black"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-400"
            }  text-white font-bold py-2 px-4 rounded-xl my-4`}
            onClick={loading ? null : handleSubmit}>
            Log in
          </button>
          {loading && <Spinner />}
          <span className="text-center">
            <span>New user? </span>
            <Link
              to={"/signup"}
              className="text-blue-500 no-underline hover:underline">
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
