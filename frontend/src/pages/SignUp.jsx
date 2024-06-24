import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../App";
import Spinner from "../components/Spinner";
import { useUser } from "../components/UserProvider";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { user } = useUser();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const return_to = queryParams.get("return_to");

  useEffect(() => {
    if (user.loggedIn) {
      return_to ? navigate(`${return_to}`) : navigate("/");
    }
  }, [return_to]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await (
        await fetch(`${api}/users/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        })
      ).json();

      if (data.code === 201 || data.status === "success") {
        setLoading(false);
        enqueueSnackbar(`${username} Register Successfully`, {
          variant: "success",
        });
        navigate("/");
        return;
      }

      if (data.code === 400) {
        setLoading(false);
        enqueueSnackbar(data.message, {
          variant: "error",
        });
        return;
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl my-4">SignUp</h1>
      <div className="my-4 mx-auto border-sky-400 border-solid border rounded-xl w-fit p-4">
        <div className="my-4 flex flex-col w-96">
          <label htmlFor="username" className="text-green-500">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            className="p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl outline-none text-black"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email" className="text-green-500">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl outline-none text-black"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="text-green-500">
            Password
          </label>
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
            SignUp
          </button>

          <span className=" text-center ">
            <span>Already have an account? </span>
            <Link
              to={"/login"}
              className="text-blue-500 no-underline hover:underline">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
