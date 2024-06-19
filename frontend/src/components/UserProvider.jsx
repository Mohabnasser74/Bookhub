import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../main";
import Spinner from "./Spinner";
import { useLocation, useParams } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        setAuthLoading(true);
        const authData = await (
          await fetch(`${api}/check-auth`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
        ).json();

        console.log(authData);
        if (!authData.isAuthenticated) {
          setUser({
            isAuthenticated: authData.isAuthenticated,
            user: {},
          });
          setAuthLoading(false);
          return;
        }

        if (
          authData.isAuthenticated &&
          (location.search === "login" || location.search === "sinup")
        ) {
          setUser({
            isAuthenticated: authData.isAuthenticated,
            user: {},
          });
          return;
        }

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
            console.log(data);
            data.isAuthenticated = authData.isAuthenticated;
            setUser(data);
            setAuthLoading(false);
            return;
          }
          if (data && data.code === 404) {
            data.isAuthenticated = authData.isAuthenticated;
            setUser(data);
            setAuthLoading(false);
            return;
          }
        }
      } catch (error) {
        setAuthLoading(false);
        console.error(error);
      }
    })();
  }, [location.search]);

  return (
    <UserContext.Provider value={{ authLoading, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
