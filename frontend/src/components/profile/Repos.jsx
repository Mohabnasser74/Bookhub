import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaRegStar } from "react-icons/fa6";
import { IoIosStar } from "react-icons/io";
import Spinner from "../Spinner";
import { api } from "../../App";
import fetchRepositories from "../../utils/fetchRepositories";

const Repos = ({ user, isUserFound, reposUrl, reposCount }) => {
  const [loading, setLoading] = useState(true);
  const [repositories, setRepositories] = useState([]);
  const [starCount, setStarCount] = useState(0);
  const [isStar, setIsStar] = useState(false);
  const starRef = useRef();

  const { username } = useParams();

  useEffect(() => {
    fetchRepositories(api, username, setRepositories, setLoading);
  }, []);

  return (
    <div>
      {isUserFound ? (
        repositories.length <= 0 && !loading ? (
          <div className="text-3xl font-bold text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {user.user?.login === username ? (
              <span>
                <span className="text-green-500">You</span> doesn’t have any
                repositories yet.
              </span>
            ) : (
              <span>
                <span className="text-green-500">{username}</span> doesn’t have
                any repositories yet.
              </span>
            )}
          </div>
        ) : (
          <div className="w-full p-4 capitalize ">
            {loading && <Spinner />}
            {repositories.map((repo, i) => (
              <div
                className={`py-6 px-3 ${
                  i >= repositories.length - 1 ? "border-y-2" : "border-t-2"
                } border-y-gray-600 border-solid text-white font-bold`}
                key={repo.bookId._id}>
                <div className="mb-2 flex justify-between items-center ">
                  <Link
                    to={
                      user.loggedIn
                        ? `/${username}/${repo.bookId._id}`
                        : `/login?return_to=/${username}/${repo.bookId._id}`
                    }
                    className="text-sky-400 text-2xl no-underline hover:underline">
                    {repo.bookId.title}
                  </Link>
                  <button
                    ref={starRef}
                    onClick={async (e) => {
                      setIsStar(!isStar);
                      const response = await fetch(
                        isStar
                          ? `${api}/users/${username}/${repo.bookId._id}/unstar`
                          : `${api}/users/${username}/${repo.bookId._id}/star`,
                        {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      );
                      const data = await response.json();
                      setStarCount(data.count);
                    }}
                    className={`${repo.bookId.title} flex justify-between items-center p-1 gap-1 border-2 border-y-gray-600 rounded capitalize py-px px-2.5`}>
                    {isStar ? <IoIosStar color="yellow" /> : <FaRegStar />}
                    <span>
                      {isStar ? (
                        <span>
                          starred{" "}
                          <span className="rounded-full bg-zinc-900">
                            {starCount}
                          </span>
                        </span>
                      ) : (
                        <span>
                          star{" "}
                          <span className="rounded-full bg-zinc-700">
                            {repo.stargazers_count}
                          </span>
                        </span>
                      )}
                    </span>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span>
                    Updated on{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      day: "numeric",
                      month: "long",
                    }).format(new Date(repo.bookId.updatedAt))}
                  </span>
                  <span>
                    Added on{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      day: "numeric",
                      month: "long",
                    }).format(new Date(repo.addedDate))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <h1 className="text-3xl font-bold text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Oops! We can’t find that page.
        </h1>
      )}
    </div>
  );
};

export default Repos;
