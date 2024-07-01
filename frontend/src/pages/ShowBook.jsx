import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { Link, useParams, useNavigate, useLoaderData } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useSnackbar } from "notistack";
import { useUser } from "../components/UserProvider";
import { api } from "../App";

const ShowBook = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const { username } = useParams();
  const { setUser } = useUser();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const data = useLoaderData();

  useEffect(() => {
    if (data) {
      if (data.code === 200) {
        setBook(data.data.book);
        setIsCurrentUser(data.isCurrentUser);
      } else if (data.code === 401) {
        setUser({ loggedIn: false, user: {} });
        navigate("/login");
      } else if (data.code === 500 || data.code === 404) {
        enqueueSnackbar(data.message, { variant: "error" });
        navigate("/");
      }
      setLoading(false);
    }
  }, [data, setUser, navigate, enqueueSnackbar]);

  if (loading) {
    return <Spinner />;
  }

  if (!book) {
    return <div>No book found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl my-4">Show Book</h1>
      <div className="my-4 mx-auto border-sky-400 border-solid border rounded-xl w-fit p-4">
        <div className="my-4">
          <span className="text-xl mt-4 text-green-500">Id: </span>
          <span>{book._id}</span>
        </div>

        <div className="my-4">
          <span className="text-xl mt-4 text-green-500">Title: </span>
          <span>{book.title}</span>
        </div>

        <div className="my-4">
          <span className="text-xl mt-4 text-green-500">Author: </span>
          <span>{book.author}</span>
        </div>

        <div className="my-4">
          <span className="text-xl mt-4 text-green-500">Publish Year: </span>
          <span>{book.publishYear}</span>
        </div>
        <div className="my-4">
          <span className="text-xl mt-4 text-green-500">Created At: </span>
          <span>{new Date(book.createdAt).toString()}</span>
        </div>
        <div className="my-4">
          <span className="text-xl mt-4 text-green-500">Updated At: </span>
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
    </div>
  );
};

export const showBookLoader = async ({ params }) => {
  try {
    const response = await fetch(
      `${api}/books/${params?.username}/${params?.id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default ShowBook;
