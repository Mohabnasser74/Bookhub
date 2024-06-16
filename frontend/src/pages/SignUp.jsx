import { useSnackbar } from "notistack";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../main";
import Spinner from "../components/Spinner";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      const data = await (
        await fetch(`${api}/users/signUp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
          credentials: "include",
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
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err.message, { variant: "error" });
      console.log(err);
    }
  };

  if (loading) return <Spinner />;
  return (
    <div className="p-4">
      <h1 className="text-3xl my-4">SignUp</h1>
      <div className="my-4 mx-auto border-y-gray-600 border-solid border rounded-xl w-fit p-4">
        <div className="my-4 flex flex-col w-96">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            className="p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl outline-none text-black"
            onChange={(e) => setUsername(e.target.value)}
          />
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
