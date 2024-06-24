import { useParams, useLocation, Link } from "react-router-dom";
import Repos from "../components/profile/Repos";
import { useUser } from "../components/UserProvider";
import Spinner from "../components/Spinner";
import AppHeader from "../components/AppHeader";
import { useEffect, useState } from "react";
import Overveiw from "../components/profile/Overveiw";
import { api } from "../App";

const Profile = () => {
  const { user } = useUser();
  const [target, setTarget] = useState("overveiw");
  const [isUserFound, setIsUserFound] = useState(true);
  const [loading, setLoading] = useState(true);
  const [reposUrl, setReposUrl] = useState("");
  const [reposCount, setReposCount] = useState(0);

  const { username } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get("tab");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/users/${username}`);
        if (response.status === 404) {
          setIsUserFound(false);
        } else if (response.status === 200) {
          const data = await response.json();
          setReposUrl(data.user.repos_url);
          setReposCount(data.user.count_repos);
          setIsUserFound(true);
        }
      } catch (error) {
        setIsUserFound(false);
      } finally {
        setLoading(false);
      }
    };

    if (user.user?.login !== username || !user.loggedIn) {
      fetchUser();
    } else {
      setIsUserFound(true);
      setReposUrl(user.user.repos_url);
      setReposCount(user.user.count_repos);
      setLoading(false);
    }
  }, [username, user.user, user.loggedIn]);

  useEffect(() => {
    if (!tab) {
      setTarget("overveiw");
    } else if (tab === "repositories") {
      setTarget("repositories");
    }
  }, [tab]);

  return (
    <>
      <AppHeader>
        {isUserFound && (
          <div className="p-2">
            <nav>
              <ul className="flex gap-4">
                <li
                  className={`${
                    target === "overveiw" &&
                    !tab &&
                    "border-y-red-600 border-solid border-b-2"
                  }`}>
                  <Link onClick={() => setTarget("overveiw")}>overveiw</Link>
                </li>
                <li
                  className={`${
                    target === "repositories" &&
                    tab === "repositories" &&
                    "border-y-red-600 border-solid border-b-2"
                  }`}>
                  <Link
                    onClick={() => setTarget("repositories")}
                    to={`/${username}?tab=repositories`}>
                    Repositories
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </AppHeader>
      {loading && <Spinner />}
      {target === "overveiw" && <Overveiw isUserFound={isUserFound} />}
      {target === "repositories" && (
        <Repos
          user={user}
          isUserFound={isUserFound}
          reposUrl={reposUrl}
          reposCount={reposCount}
        />
      )}
    </>
  );
};

export default Profile;
