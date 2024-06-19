import { useParams, useLocation, Link } from "react-router-dom";
import Repos from "../components/profile/Repos";
import { useUser } from "../components/UserProvider";
import Spinner from "../components/Spinner";
import AppHeader from "../components/home/AppHeader";
import { useEffect, useState } from "react";
import Overveiw from "../components/profile/Overveiw";
import { api } from "../main";

const Profile = () => {
  const [target, setTarget] = useState("overveiw");
  const [isUserFound, setIsUserFound] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reposUrl, setReposUrl] = useState("");
  const [reposCount, setReposCount] = useState(0);

  const { username } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get("tab");

  const { user } = useUser();

  useEffect(() => {
    if (user.user?.login !== username || !user.isAuthenticated) {
      (async () => {
        setLoading(true);
        const response = await fetch(`${api}/users/${username}`);
        if (response.status === 404) {
          setIsUserFound(false);
          setLoading(false);
          return;
        }
        if (response.status === 200) {
          setIsUserFound(true);
          setLoading(false);
          const data = await response.json();
          setReposUrl(data.user.repos_url);
          setReposCount(data.user.count_repos);
          return;
        }
      })();
    } else {
      setIsUserFound(true);
      setReposUrl(user.user.repos_url);
      setReposCount(user.user.count_repos);
      setLoading(false);
    }
  }, [user.user, username]);

  useEffect(() => {
    !tab && setTarget("overveiw");
    tab === "repositories" && setTarget("repositories");
  }, [tab]);

  if (loading) return <Spinner />;

  if (user.user) {
    return (
      <>
        <AppHeader>
          {isUserFound && !loading && (
            <div className="p-2">
              <nav className="">
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
        {target === "overveiw" && <Overveiw isUserFound={isUserFound} />}
        {tab && target === "repositories" && (
          <Repos
            user={user}
            isUserFound={isUserFound}
            reposUrl={reposUrl}
            reposCount={reposCount}
          />
        )}
      </>
    );
  }
};

export default Profile;
