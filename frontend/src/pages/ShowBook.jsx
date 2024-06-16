import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { Link, useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { api } from "../main";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useSnackbar } from "notistack";

const ShowBook = () => {
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

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
          })
        ).json();
        if (data.code === 404 || data.message === "Not Found") {
          setLoading(false);
          enqueueSnackbar(data.message, { variant: "error" });
          navigate(-1);
          return;
        }
        if (data.code === 401) {
          setLoading(false);
          navigate("/login");
          return;
        }
        setIsCurrentUser(data.isCurrentUser);
        setBook(data.data.book);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="p-4 bg-gray-800 min-h-screen text-white capitalize">
      {/* <BackButton /> */}
      <h1 className="text-3xl my-4">Show Book</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-y-gray-600 border-solid border rounded-xl w-fit p-4">
          <div className="my-4">
            <span className="text-xl mt-4 text-gray-500">Id: </span>
            <span>{book._id}</span>
          </div>

          <div className="my-4">
            <span className="text-xl mt-4 text-gray-500">Title: </span>
            <span>{book.title}</span>
          </div>

          <div className="my-4">
            <span className="text-xl mt-4 text-gray-500">Author: </span>
            <span>{book.author}</span>
          </div>

          <div className="my-4">
            <span className="text-xl mt-4 text-gray-500">Publish Year: </span>
            <span>{book.publishYear}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mt-4 text-gray-500">Created At: </span>
            <span>{new Date(book.createdAt).toString()}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mt-4 text-gray-500">Updated At: </span>
            <span>{new Date(book.updatedAt).toString()}</span>
          </div>

          {isCurrentUser && (
            <div className="flex justify-end gap-x-4 mt-3 ">
              <Link to={`/${username}/${book._id}/edit`}>
                <AiOutlineEdit className="text-2xl text-yellow-600" />
              </Link>
              <Link to={`/${username}/${book._id}/delete`}>
                <AiOutlineDelete className="text-2xl text-red-600" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowBook;
