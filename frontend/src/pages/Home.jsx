import { useEffect, useState, Suspense } from "react";
import HomeModel from "../components/home/HomeModel";
import { api } from "../main";
import Spinner from "../components/Spinner";
import { useUser } from "../components/UserProvider";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBooks = async () => {
      setLoading(true);
      try {
        const data = await (
          await fetch(`${api}/books`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
        ).json();
        if (data.code === 200) {
          setBooks(data.data.books);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getBooks();
  }, []);

  if (loading) return <Spinner />;
  return <HomeModel books={books} />;
}
