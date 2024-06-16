import { Link, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const BackButton = () => {
  const navigate = useNavigate();

  const presentPage = () => {
    navigate(-1);
  };

  return (
    <div className="flex">
      <button
        onClick={presentPage}
        className="bg-sky-800 text-white px-4 py-1 rounded-lg w-fit">
        <BsArrowLeft className="text-2xl" />
      </button>
    </div>
  );
};

export default BackButton;
