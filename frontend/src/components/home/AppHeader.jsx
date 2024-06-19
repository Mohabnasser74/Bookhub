import { MdOutlineAddBox } from "react-icons/md";
import { MdMenuBook } from "react-icons/md";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useUser } from "../UserProvider";

const AppHeader = ({ children }) => {
  const [showSideBar, setShowSideBar] = useState(false);
  const { username } = useParams();
  const { user } = useUser();

  const location = useLocation();

  const pathname = location.pathname;
  const search = location.search;

  if (user.user) {
    return (
      <>
        <header className="bg-neutral-950 border-y-gray-600 border-solid border-b-2">
          <div className="flex justify-between items-center p-2 ">
            <div className="flex items-center">
              <Link to={"/"} className="text-4xl">
                <MdMenuBook />
              </Link>
              {user.isAuthenticated && (
                <span className="text-white py-2">
                  <Link className="ml-2" to={`/${user.user.login}`}>
                    {user.user.login}
                  </Link>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {user.isAuthenticated && user.user.login === username && (
                <Link to="/new">
                  <button className="text-white font-bold">
                    <MdOutlineAddBox className="hover:text-slate-400" />
                  </button>
                </Link>
              )}
              {user.isAuthenticated && (
                <img
                  onClick={() => setShowSideBar(true)}
                  className="cursor-pointer"
                  src={`${user.user?.avatar_url}`}
                  alt="user-image"
                />
              )}
              {!user.isAuthenticated && (
                <>
                  <Link
                    to={`/login?return_to=${pathname}${search}`}
                    className="m-1.5 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Log In
                  </Link>
                  <Link
                    to={`/signup?return_to=${pathname}${search}`}
                    className="m-1.5 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
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
  }
};

export default AppHeader;
