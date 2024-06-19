import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaRegStar } from "react-icons/fa6";
import Spinner from "../Spinner";

const Repos = ({ user, isUserFound, reposUrl, reposCount }) => {
  const [loading, setLoading] = useState(true);
  const [repositories, setRepositories] = useState([]);
  const [isStar, setIsStar] = useState(false);

  const { username } = useParams();

  // Utility function to check if the response is JSON
  const isJSON = (response) => {
    const contentType = response.headers.get("content-type");
    return contentType && contentType.indexOf("application/json") !== -1;
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const cacheKey = `${reposUrl}`;
        const cacheName = "repos-store-cache";

        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(cacheKey);

        const headers = {};
        if (cachedResponse) {
          const lastModified = cachedResponse.headers.get("Last-Modified");
          if (lastModified) {
            headers["If-Modified-Since"] = lastModified;
          }
        }

        const response = await fetch(cacheKey, {
          headers,
          credentials: "include",
        });

        if (response.status === 200) {
          if (isJSON(response)) {
            const responseData = await response.json();
            const ReposReverse = responseData.repos.reverse();
            setRepositories(ReposReverse);
            const responseToCache = new Response(JSON.stringify(responseData), {
              headers: {
                "Last-Modified": response.headers.get("Last-Modified"),
              },
            });
            await cache.put(cacheKey, responseToCache);
          } else {
            console.error("Response was not JSON:", await response.text());
          }
          setLoading(false);
          return;
        }
        if (response.status === 304 && cachedResponse) {
          // Data not modified. Using cached version.
          const cachedBooks = await cachedResponse.json();
          const ReposReverse = cachedBooks.repos;
          setRepositories(ReposReverse);
          setLoading(false);
          return;
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    })();
  }, [reposUrl]);

  if (isUserFound && loading) return <Spinner />;

  return (
    <div>
      {isUserFound ? (
        <div>
          {repositories.length <= 0 ? (
            <div className="text-3xl font-bold text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {user.user?.login === username ? (
                <span>
                  <span className="text-green-500">You</span> doesn’t have any
                  repositories yet.
                </span>
              ) : (
                <span>
                  <span className="text-green-500">{username}</span> doesn’t
                  have any repositories yet.
                </span>
              )}
            </div>
          ) : (
            <div className="w-full p-4 capitalize ">
              {repositories.map((repo, i) => (
                <div
                  className={`py-6 px-3 ${
                    i >= repositories.length - 1 ? "border-y-2" : "border-t-2"
                  } border-y-gray-600 border-solid text-white font-bold`}
                  key={repo._id}>
                  <div className="mb-2 flex justify-between items-center ">
                    <Link
                      to={`${
                        user.isAuthenticated
                          ? repo.bookId._id
                          : `/login?return_to=/${username}/${repo.bookId._id}`
                      }`}
                      className="text-green-500 text-2xl no-underline hover:underline">
                      {repo.bookId.title}
                    </Link>
                    <button
                      onClick={() => {
                        if (!isStar) {
                          setIsStar(true);
                        } else setIsStar(false);
                      }}
                      className="flex justify-between items-center px-1 gap-1 border-2 border-y-gray-600 rounded capitalize">
                      <FaRegStar />
                      {isStar ? <span>starred</span> : <span>star</span>}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>
                      Updated on{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        day: "numeric",
                        month: "long",
                      }).format(new Date(`${repo.bookId.updatedAt}`))}
                    </span>
                    <span>
                      added on{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        day: "numeric",
                        month: "long",
                      }).format(new Date(`${repo.addedDate}`))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <h1 className="text-3xl font-bold text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Oops! We can’t find that page.
        </h1>
      )}
    </div>
  );
};

export default Repos;
