import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";

const BooksTable = ({ books, isAuthenticated }) => {
  return (
    <div className="overflow-x-auto scroll-smooth">
      <table className="w-full border-separate border-spacing-2">
        <thead>
          <tr>
            <th className="border border-y-gray-600 border-solid rounded-md">
              No
            </th>
            <th className="border border-y-gray-600 border-solid rounded-md">
              Title
            </th>
            <th className="border border-y-gray-600 border-solid rounded-md">
              Author
            </th>
            <th className="border border-y-gray-600 border-solid rounded-md">
              Publish Year
            </th>
            <th className="border border-y-gray-600 border-solid rounded-md">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
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
                      isAuthenticated ? `/${book.author}/${book._id}` : "/login"
                    }>
                    <BsInfoCircle className="text-2xl text-green-800" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BooksTable;
