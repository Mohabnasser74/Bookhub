import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { useUser } from "../UserProvider";

const BooksTable = ({ books }) => {
  const { user } = useUser();

  return (
    <>
      {books.map((book, index) => (
        <tr key={book._id}>
          <td className="border-y-gray-600 border-solid border rounded-md text-center">
            {index + 1}
          </td>
          <td className="border-y-gray-600 border-solid border rounded-md text-center">
            {book.title}
          </td>
          <td className="border-y-gray-600 border-solid border rounded-md text-center no-underline hover:underline">
            <Link to={`${book.author}`}>{book.author}</Link>
          </td>
          <td className="border-y-gray-600 border-solid border rounded-md text-center">
            {book.publishYear}
          </td>
          <td className="border-y-gray-600 border-solid border rounded-md text-center">
            <div className="flex justify-center gap-x-4">
              <Link
                to={
                  user.isLogin
                    ? `/${book.author}/${book._id}`
                    : `/login?return_to=/${book.author}/${book._id}`
                }>
                <BsInfoCircle className="text-2xl text-green-800" />
              </Link>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default BooksTable;
