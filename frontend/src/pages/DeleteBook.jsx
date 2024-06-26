import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { api } from "../App";
import { useUser } from "../components/UserProvider";

const DeleteBooks = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id, username } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const bookData = useLoaderData();
  const { setUser } = useUser();

  useEffect(() => {
    if (bookData) {
      if (bookData.code === 200) {
        setBook(bookData.data.book);
      } else if (bookData.code === 401) {
        setUser({ loggedIn: false, user: {} });
        navigate("/login");
      } else if (bookData.code === 403) {
        enqueueSnackbar(data.message, { variant: "error" });
        navigate(`/${username}`);
        return;
      } else if (bookData.code === 500 || bookData.code === 404) {
        enqueueSnackbar(bookData.message, { variant: "error" });
        navigate("/");
      }
      setLoading(false);
    }
  }, [bookData, setUser, navigate, enqueueSnackbar]);

  const handleDeleteBook = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/books/${username}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.code === 401) {
        navigate("/login");
        return;
      }

      if (data.code === 200) {
        enqueueSnackbar(data.message, { variant: "success" });
        navigate(`/${username}?tab=repositories`);
        return;
      }

      enqueueSnackbar("Failed to delete the book", { variant: "error" });
    } catch (err) {
      enqueueSnackbar("Failed to delete the book", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl my-4">Delete Book</h1>
      <div className="my-4 mx-auto border-sky-400 border-solid border rounded-xl w-fit p-4">
        <h1 className="text-2xl my-4">
          Are you sure you want to delete this book?
        </h1>
        {loading && <Spinner />}
        {book && (
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="border border-slate-600 rounded-md text-green-500">
                  Title
                </th>
                <th className="border border-slate-600 rounded-md text-green-500">
                  Author
                </th>
                <th className="border border-slate-600 rounded-md text-green-500">
                  Publish Year
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-700 rounded-md text-center">
                  {book.title}
                </td>
                <td className="border border-slate-700 rounded-md text-center">
                  {book.author}
                </td>
                <td className="border border-slate-700 rounded-md text-center">
                  {book.publishYear}
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <button
          className={`${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-500"
          } w-full p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl text-center text-white font-semibold text-lg`}
          onClick={handleDeleteBook}
          disabled={loading}>
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteBooks;
