const fetchRepositories = async (
  api,
  username,
  setRepositories,
  setLoading
) => {
  setLoading(true);
  try {
    // Utility function to check if the response is JSON
    const isJSON = (response) => {
      const contentType = response.headers.get("content-type");
      return contentType && contentType.indexOf("application/json") !== -1;
    };

    const cacheKey = `${api}/users/${username}/repos`;
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

    if (response.status === 200 && isJSON(response)) {
      const responseData = await response.json();
      const ReposReverse = responseData.repos.reverse();
      setRepositories(ReposReverse);

      const responseToCache = new Response(JSON.stringify(responseData), {
        headers: {
          "Last-Modified": response.headers.get("Last-Modified"),
        },
      });
      await cache.put(cacheKey, responseToCache);
    } else if (response.status === 304 && cachedResponse) {
      const cachedBooks = await cachedResponse.json();
      const ReposReverse = cachedBooks.repos;
      setRepositories(ReposReverse);
    } else {
      console.error("Response was not JSON:", await response.text());
    }
  } catch (error) {
    console.error("Failed to fetch repositories:", error);
  } finally {
    setLoading(false);
  }
};

export default fetchRepositories;
