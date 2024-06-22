import { useEffect, useState } from "react";
import { api } from "../main";
import Spinner from "../components/Spinner";
import BooksCard from "../components/home/BooksCard";
import BooksTable from "../components/home/BooksTable";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sBStorge, setSBStorge] = useState(
    localStorage.getItem("switch_button")
  );

  useEffect(() => {
    if (sBStorge === "card") {
      localStorage.setItem("switch_button", "card");
      setSBStorge(localStorage.getItem("switch_button"));
    } else {
      localStorage.setItem("switch_button", "table");
      setSBStorge(localStorage.getItem("switch_button"));
    }
  }, [sBStorge]);

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

  return (
    <div className="p-4">
      <div className="border border-y-gray-600 border-solid w-fit p-1.5 m-auto">
        <button
          className={`mx-1.5 text-1xl font-bold rounded p-1 ${
            sBStorge === "table" ? "bg-orange-500 hover:bg-orange-400" : null
          }`}
          onClick={() => setSBStorge("table")}>
          Table
        </button>
        <button
          className={`mx-1.5 text-1xl font-bold rounded p-1 ${
            sBStorge === "card" ? "bg-orange-500 hover:bg-orange-400" : null
          }`}
          onClick={() => setSBStorge("card")}>
          Card
        </button>
      </div>
      {sBStorge === "table" ? (
        <div className="overflow-x-auto scroll-smooth">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="border border-y-gray-600 border-solid rounded-md text-green-500">
                  No
                </th>
                <th className="border border-y-gray-600 border-solid rounded-md text-green-500">
                  Title
                </th>
                <th className="border border-y-gray-600 border-solid rounded-md text-green-500">
                  Author
                </th>
                <th className="border border-y-gray-600 border-solid rounded-md text-green-500">
                  Publish Year
                </th>
                <th className="border border-y-gray-600 border-solid rounded-md text-green-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && <Spinner />}
              <BooksTable books={books} />
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading && <Spinner />}
          <BooksCard books={books} />
        </div>
      )}
    </div>
  );
}
