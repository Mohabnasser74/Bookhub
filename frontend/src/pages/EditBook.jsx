import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { api } from "../main";
import { useUser } from "../components/UserProvider";

const EditBook = () => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const { id, username } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUser();

  useEffect(() => {
    if (user.user && user.user.login !== username) {
      setLoading(false);
      enqueueSnackbar("Forbidden", { variant: "error" });
      navigate("/");
      return;
    }
  }, [user, username, enqueueSnackbar, navigate]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api}/books/${username}/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Referer: `${api}/${username}/${id}/edit`,
          },
        });

        const data = await response.json();

        if (data.code === 403) {
          enqueueSnackbar(data.message, { variant: "error" });
          navigate(`/${username}`);
          return;
        }

        if (data.code === 404 || data.message === "Not Found") {
          enqueueSnackbar(data.message, { variant: "error" });
          navigate(-1);
          return;
        }

        if (data.code === 401) {
          navigate("/login");
          return;
        }

        setTitle(data.data.book.title);
      } catch (error) {
        enqueueSnackbar("Failed to fetch book details", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, username, enqueueSnackbar, navigate]);

  const handleSaveBook = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api}/books/${username}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
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
