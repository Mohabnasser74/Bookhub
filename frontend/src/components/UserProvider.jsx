import { createContext, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { api } from "../App";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [checkLoading, setCheckLoading] = useState(true);

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
        const { username, loggedIn, code, message } =
          await checkResponse.json();

        if (!loggedIn) {
          setUser({ loggedIn: false, user: {} });
        } else {
          const userResponse = await fetch(`${api}/users/${username}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          const userData = await userResponse.json();

          if (userData.code === 200) {
            setUser({ loggedIn: true, user: userData.user });
          } else if (userData.code === 404) {
            setUser({ loggedIn: false, user: {} });
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
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, checkLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
