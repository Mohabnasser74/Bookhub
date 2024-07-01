import { useEffect, useState } from "react";
import { api } from "../App";
import Spinner from "../components/Spinner";
import BooksCard from "../components/home/BooksCard";
import BooksTable from "../components/home/BooksTable";
import { useLoaderData } from "react-router-dom";
import { useSnackbar } from "notistack";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

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

  const booksData = useLoaderData();

  useEffect(() => {
    if (booksData) {
      if (booksData.code === 200) {
        setBooks(booksData.data.books);
      } else if (booksData.code === 500 || booksData.code === 404) {
        enqueueSnackbar(booksData.message, { variant: "error" });
      }
      setLoading(false);
    }
  }, [booksData, enqueueSnackbar]);

  return (
    <div className="p-4">
      <div className="border border-y-gray-600 border-solid rounded-md w-fit p-1.5 m-auto">
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
              <BooksTable books={books} />
            </tbody>
          </table>
          {loading && <Spinner />}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
          {loading && <Spinner />}
          <BooksCard books={books} />
        </div>
      )}
    </div>
  );
}

export const homeBooksLoader = async () => {
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
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default Home;
