import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../main";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        const authData = await (
          await fetch(`${api}/auth/check-auth`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
        ).json();
        if (!authData.isAuthenticated) {
          setUser({
            isAuthenticated: authData.isAuthenticated,
            user: null,
          });
          return;
        };
        if (authData.isAuthenticated) {
          const response = await fetch(`${api}/users/${authData.username}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (data && data.code === 200) {
            data.isAuthenticated = authData.isAuthenticated;
            setUser(data);
            return;
          }
          if (data && data.code === 404) {
            data.isAuthenticated = authData.isAuthenticated;
            setUser(data);
            return;
          }
        };
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
