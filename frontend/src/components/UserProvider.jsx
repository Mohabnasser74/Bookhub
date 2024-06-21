import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../main";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const checkResponse = await fetch(`${api}/check-login`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const checkData = await checkResponse.json();

        console.log(checkData)

        if (!checkData.isLogin) {
          setUser({ isLogin: false, user: {} });
        } else {
          const userResponse = await fetch(
            `${api}/users/${checkData.username}`,
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
            setUser({ isLogin: true, user: userData.user });
          } else {
            setUser({ isLogin: false, user: {} });
          }
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
        setUser({ isLogin: false, user: {} });
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  console.log("RE_RENDER")

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
