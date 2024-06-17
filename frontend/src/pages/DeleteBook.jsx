import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useSnackbar } from "notistack";
import { api } from "../main";

const DeleteBooks = () => {
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id, username } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await (
          await fetch(`${api}/books/${username}/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();
        if (data.code === 404 || data.message === "Not Found") {
          setLoading(false);
          enqueueSnackbar(
            "This book you tried to delete doesn't already exist." +
              `\n (${data.message})`,
            { variant: "warning" }
          );
          navigate(-1);
          return;
        }
        if (data.code === 401) {
          setLoading(false);
          navigate("/login");
          return;
        }
        setBook(data.data.book);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, []);

  const handleDeleteBook = async () => {
    try {
      setLoading(true);
      const data = await (
        await fetch(`${api}/books/${username}/${id}`, {
          method: "DELETE",
          credentials: "include",
        })
      ).json();

      if (data.code === 401) {
        setLoading(false);
        navigate("/login");
        return;
      }

      if (data.code === 200) {
        setLoading(false);
        enqueueSnackbar(data.message, { variant: "success" });
        navigate(`/${username}?tab=repositories`);
        return;
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return (
    <div className="p-4">
      {loading && <Spinner />}
      <h1 className="text-3xl my-4">Delete Book</h1>
      <div className="my-4 mx-auto border-sky-400 border-solid border rounded-xl w-fit p-4">
        <h1 className="text-2xl my-4">
          Are you sure you want to delete this book?
        </h1>
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
                publish Year
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
        <button
          className={`${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-500"
          }  w-full p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl  text-center text-white font-semibold text-lg`}
          onClick={loading ? null : handleDeleteBook}>
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteBooks;
