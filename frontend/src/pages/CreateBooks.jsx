import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useSnackbar } from "notistack";
import { api } from "../main";
import Spinner from "../components/Spinner";

const CreateBooks = () => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleCreateBook = async () => {
    try {
      setLoading(true);
      const data = await (
        await fetch(`${api}/books`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: title,
          }),
        })
      ).json();

      if (data.code === 401) {
        setLoading(false);
        navigate("/login");
        return;
      }

      if (data.code === 201) {
        setLoading(false);
        enqueueSnackbar(data.message, { variant: "success" });
        navigate(`/`);
        return;
      }

      if (data.code === 400) {
        setLoading(false);
        enqueueSnackbar(data.message, {
          variant: "error",
        });
      }
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(data.message, { variant: "error" });
    }
  };

  return (
    <div className="p-4 bg-gray-800 min-h-screen text-white capitalize">
      {/* <BackButton /> */}
      {loading && <Spinner />}
      <h1 className="text-3xl my-4">Create Book</h1>
      <div className="my-4 mx-auto border-y-gray-600 border-solid border rounded-xl w-fit p-4">
        <div className="my-4 flex flex-col w-96">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            className="p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl outline-none text-black"
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400"
            } p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl text-center text-white font-semibold text-lg`}
            onClick={loading ? null : handleCreateBook}>
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBooks;
