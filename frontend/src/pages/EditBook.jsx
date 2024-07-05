import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { api } from "../App";
import { useUser } from "../components/UserProvider";

const EditBook = () => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const { id, username } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, setUser } = useUser();
  const bookData = useLoaderData();

  useEffect(() => {
    if (user.user && user.user.login !== username) {
      setLoading(false);
      enqueueSnackbar("Forbidden", { variant: "error" });
      navigate("/");
      return;
    }
  }, [user, username, enqueueSnackbar, navigate]);

  useEffect(() => {
    if (bookData) {
      if (bookData.code === 200) {
        setTitle(bookData.data.book.title);
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

  const handleSaveBook = async () => {
    setLoading(true);
    if (title.trim() === bookData.data.book.title) {
      setLoading(false);
      navigate(`/${username}?tab=repositories`);
      return;
    }
    try {
      const response = await fetch(`${api}/books/${username}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      const data = await response.json();

      if (data.code === 201) {
        enqueueSnackbar("Book Updated Successfully", { variant: "success" });
        navigate(`/${username}?tab=repositories`);
      } else if (data.code === 401) {
        navigate("/login");
      } else {
        enqueueSnackbar(data.message, { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("Failed to update book", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h1 className="text-3xl my-4">Edit Book</h1>
      <div className="my-4 mx-auto border-sky-400 border-solid border rounded-xl w-fit p-4">
        <div className="my-4 flex flex-col w-96">
          <label htmlFor="title" className="text-green-500">
            Title
          </label>
          <input
            value={title}
            type="text"
            id="title"
            placeholder="New Title"
            className="p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl outline-none text-black"
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400"
            } p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl text-center text-white font-semibold text-lg`}
            onClick={handleSaveBook}
            disabled={loading}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
