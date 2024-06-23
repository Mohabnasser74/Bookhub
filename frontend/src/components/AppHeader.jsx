import { MdOutlineAddBox, MdMenuBook } from "react-icons/md";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./home/Sidebar";
import { useUser } from "./UserProvider";
import { api } from "../main";

const AppHeader = ({ children }) => {
  const [showSideBar, setShowSideBar] = useState(false);
  const { username } = useParams();
  const { user, checkLoading } = useUser();
  const location = useLocation();
  const { pathname, search } = location;

  return (
    <>
      <header className="bg-neutral-950 border-y-gray-600 border-solid border-b-2">
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center">
            <Link to="/" className="text-4xl">
              <MdMenuBook />
            </Link>
            {user.isLogin && (
              <span className="text-white py-2 ml-2">
                <Link to={`/${user.user.login}`}>{user.user.login}</Link>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {user.isLogin && user.user.login === username && (
              <Link to="/new">
                <button className="text-white font-bold">
                  <MdOutlineAddBox className="hover:text-slate-400" />
                </button>
              </Link>
            )}
            {checkLoading ? null : user.isLogin ? (
              <img
                onClick={() => setShowSideBar(true)}
                className="cursor-pointer rounded-full"
                src={`${api}/${user.user?.avatar_url}`}
                alt="User Avatar"
                width="35"
                height="35"
              />
            ) : (
              <>
                <Link
                  to={
                    checkLoading
                      ? null
                      : `/login?return_to=${pathname}${search}`
                  }
                  className={`${
                    checkLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-400"
                  } m-1.5 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>
                  Log In
                </Link>
                <Link
                  to={
                    checkLoading
                      ? null
                      : `/signup?return_to=${pathname}${search}`
                  }
                  className={`${
                    checkLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-400"
                  } m-1.5 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        {children}
      </header>
      <Outlet />
      {showSideBar && (
        <Sidebar user={user} onClose={() => setShowSideBar(false)} />
      )}
    </>
  );
};

export default AppHeader;
