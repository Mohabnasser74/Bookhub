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
  }, []);

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
              Accept: "application/json",
              Referer: `${api}/${username}/${id}/edit`,
              // "Cache-Control": "no-cache",
            },
          })
        ).json();

        if (data.code === 403) {
          setLoading(false);
          enqueueSnackbar(data.message, { variant: "error" });
          navigate(`/${username}`);
          return;
        }

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

        setTitle(data.data.book.title);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, []);

  const handleSaveBook = async () => {
    try {
      setLoading(true);
      const data = await (
        await fetch(`${api}/books/${username}/${id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
          }),
        })
      ).json();

      if (data.code === 201) {
        setLoading(false);
        enqueueSnackbar("Book Updated Successfully", {
          variant: "success",
        });
        navigate(`/${username}?tab=repositories`);
      }

      if (data.code === 401) {
        setLoading(false);
        navigate("/login");
        return;
      }
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    }
  };

  if (loading) return <Spinner />;

  if (user || user.user) {
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
              }  p-2 my-2 border-2 border-darkseagreen-400 rounded-2xl text-center text-white font-semibold text-lg`}
              onClick={loading ? null : handleSaveBook}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default EditBook;
