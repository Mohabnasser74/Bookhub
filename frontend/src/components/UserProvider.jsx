import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../main";
import { useLocation } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [checkLoading, setCheckLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const return_to = queryParams.get("return_to");

  useEffect(() => {
    const checkLoginStatus = async () => {
      setCheckLoading(true);
      try {
        const checkResponse = await fetch(`${api}/users/status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const { username, loggedIn, code } = await checkResponse.json();

        console.log(checkData);
        if (loggedIn && location.search === ("login" || "signup")) {
          console.log(return_to);
          return_to ? navigate(`${return_to}`) : navigate("/");
          return;
        }
        if (!loggedIn) {
          setUser({ loggedIn: false, user: {} });
        } else {
          const userResponse = await fetch(
            `${api}/users/${username}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          const userData = await userResponse.json();

          if (userData.code === 200) {
            setUser({ loggedIn: true, user: userData.user });
          } else {
            setUser({ loggedIn: false, user: {} });
          }
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
        setUser({ loggedIn: false, user: {} });
      } finally {
        setCheckLoading(false);
      }
    };

    checkLoginStatus();
  }, [location.search]);

  return (
    <UserContext.Provider value={{ user, setUser, checkLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
