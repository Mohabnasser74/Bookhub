import BookSingleCard from "./BookSingleCard";

const BooksCard = ({ books, isAuthenticated}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book, index) => (
        <BookSingleCard book={book} key={book._id} isAuthenticated={isAuthenticated} />
      ))}
    </div>
  );
};

export default BooksCard;
