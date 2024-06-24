import { Link, useNavigate } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { PiBookOpenTextLight } from "react-icons/pi";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { useState } from "react";
import BookModal from "./BookModel";
import { useUser } from "../UserProvider";

const BookSingleCard = ({ book }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { user } = useUser();

  return (
    <div className="my-2 border-2 border-sky-400 rounded-xl p-4 w-80 hover:shadow-md ">
      <div className="flex justify-between items-center">
        <span>{book._id.slice(0, 10) + "..."}</span>
        <span className="bg-green-500 text-white  p-2 rounded-xl ">
          {book.publishYear}
        </span>
      </div>
      <div className="flex flex-col gap-2 my-4">
        <div className="flex justify-start items-center gap-1 ">
          <PiBookOpenTextLight className="fill-green-500 text-lg" />
          <h2>{book.title}</h2>
        </div>
        <div className="flex justify-start items-center gap-1 ">
          <BiUserCircle className="fill-green-500 text-lg " />
          <h2 className="no-underline hover:underline">
            <Link to={`${book.author}`}>{book.author}</Link>
          </h2>
        </div>
      </div>
      <div className="flex justify-between gap-x-4">
        <AiOutlineEye
          className="text-3xl text-blue-800 hover:text-black cursor-pointer"
          onClick={() => {
            if (user.loggedIn) {
              setShowModal(true);
            } else navigate("/login");
          }}
        />
        <Link
          to={
            user.loggedIn
              ? `/${book.author}/${book._id}`
              : `/login?return_to=/${book.author}/${book._id}`
          }>
          <BsInfoCircle className="text-2xl text-green-800" />
        </Link>
        {showModal && user.loggedIn && (
          <BookModal book={book} onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default BookSingleCard;
