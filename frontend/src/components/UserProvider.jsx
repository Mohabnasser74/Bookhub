import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../main";
import Spinner from "./Spinner";
import { useLocation, useParams } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
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
            user: {},
          });
          setLoading(false);
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
            data.isAuthenticated = authData.isAuthenticated;
            setUser(data);
            setLoading(false);
            return;
          }
          if (data && data.code === 404) {
            data.isAuthenticated = authData.isAuthenticated;
            setUser(data);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    })();
  }, []);

  if (loading) return <Spinner />;
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
