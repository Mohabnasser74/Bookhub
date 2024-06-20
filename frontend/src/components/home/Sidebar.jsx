import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { api } from "../../main";
import { useSnackbar } from "notistack";

const Sidebar = ({ user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogOut = async () => {
    try {
      setLoading(true);
      const data = await (
        await fetch(`${api}/users/logout`, {
          method: "GET",
          credentials: "include",
        })
      ).json();
      if (data.code === 200 || data.message === "logOut") {
        setLoading(false);
        enqueueSnackbar("Log Out Successfully", {
          variant: "success",
        });
        onClose();
        navigate("/");
        return;
      }
      if (data.code === 401) {
        navigate("/login");
        return;
      }
      if (data.code === 500) {
        setLoading(false);
        enqueueSnackbar(data.message, { variant: "error" });
        return;
      }
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return (
    <div
      className="capitalize fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center text-black"
      onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="fixed right-0 top-0 bg-zinc-900 min-h-screen w-[300px] max-w-full rounded-l-md text-white p-4">
        <div className="flex justify-between items-center pb-3 border-b-2 border-y-gray-600 border-solid ">
          <div className="flex items-center">
            <img
              className="mr-2.5"
              src={`${user.user?.avatar_url}`}
              alt="user-image"
            />
            <span>{user.user.login ? user.user.login : "User Name"}</span>
          </div>
          <AiOutlineClose
            onClick={onClose}
            className="text-gray-400 cursor-pointer"
          />
        </div>
        <div className="border-b-2 border-y-gray-600 border-solid pb-3 pt-3 ">
          <Link
            onClick={onClose}
            to={`/${user.user.login}`}
            className="hover:bg-gray-600 bg-opacity-60 rounded-md block w-full pl-1.5 pt-1.5 pb-1.5">
            your profile
          </Link>
        </div>
        <div className="border-b-2 border-y-gray-600 border-solid pb-3 pt-3 ">
          <Link
            onClick={onClose}
            to={`/${user.user.login}?tab=repositories`}
            className="hover:bg-gray-600 bg-opacity-60 rounded-md block w-full pl-1.5 pt-1.5 pb-1.5">
            your repositories
          </Link>
        </div>
        <div className="border-b-2 border-y-gray-600 border-solid pb-3 pt-3 ">
          <button
            onClick={loading ? null : handleLogOut}
            className={`${
              loading && "cursor-not-allowed"
            } hover:bg-gray-600 bg-opacity-60 rounded-md block w-full pl-1.5 pt-1.5 pb-1.5 text-start focus:outline-none focus:shadow-outline`}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
