import { useEffect, useState, Suspense } from "react";
import HomeModel from "../components/home/HomeModel";
import { api } from "../main";
import Spinner from "../components/Spinner";
import { useUser } from "../components/UserProvider";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await (
          await fetch(`${api}/books`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();

        if (data.code === 200) {
          setBooks(data.data.books);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner />;
  return (
    <Suspense fallback={<Spinner />}>
      <HomeModel
        books={books}
        username={user?.user?.login}
        isAuthenticated={user?.isAuthenticated}
        loading={loading}
      />
    </Suspense>
  );
}
