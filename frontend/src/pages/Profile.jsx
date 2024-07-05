import { useParams, useLocation, Link } from "react-router-dom";
import Repos from "../components/profile/Repos";
import { useUser } from "../components/UserProvider";
import Spinner from "../components/Spinner";
import AppHeader from "../components/AppHeader";
import { useEffect, useState } from "react";
import Overveiw from "../components/profile/Overveiw";
import { api } from "../App";
import TabSwitcher from "../components/TabSwitcher";

const Profile = () => {
  const { user } = useUser();
  const [isUserFound, setIsUserFound] = useState(true);
  const [loading, setLoading] = useState(true);
  const [reposUrl, setReposUrl] = useState("");
  const [reposCount, setReposCount] = useState(0);

  const { username } = useParams();

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

  return (
    <>
      {loading && <Spinner />}
      <TabSwitcher
        isUserFound={isUserFound}
        username={username}
        tabs={[
          {
            id: "overveiw",
            header: "Overveiw",
            content: <Overveiw isUserFound={isUserFound} />,
          },
          {
            id: "repositories",
            header: "Repositories",
            content: (
              <Repos
                user={user}
                isUserFound={isUserFound}
                reposUrl={reposUrl}
                reposCount={reposCount}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default Profile;
