import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Spinner from "../components/Spinner";
import { api } from "../App";

const CreateBooks = () => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleCreateBook = async () => {
    if (!title.trim()) {
      enqueueSnackbar("Title cannot be empty", { variant: "warning" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${api}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (data.code === 401) {
        navigate("/login");
        return;
      }

      if (data.code === 201) {
        enqueueSnackbar(data.message, { variant: "success" });
        navigate("/");
        return;
      }

      if (data.code === 400) {
        enqueueSnackbar(data.message, { variant: "error" });
      } else {
        enqueueSnackbar("An unexpected error occurred", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("Failed to create book", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl my-4">Create Book</h1>
      <div className="my-4 mx-auto border-sky-400 border-solid border rounded-xl w-fit p-4">
        <div className="my-4 flex flex-col w-96">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            className="p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl outline-none text-black"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <button
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400"
            } p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl text-center text-white font-semibold text-lg`}
            onClick={handleCreateBook}
            disabled={loading}>
            Publish
          </button>
          {loading && <Spinner />}
        </div>
      </div>
    </div>
  );
};

export default CreateBooks;
