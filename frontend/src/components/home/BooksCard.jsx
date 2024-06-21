import BookSingleCard from "./BookSingleCard";

const BooksCard = ({ books, loading }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading && <Spinner />}
      {books.map((book) => (
        <BookSingleCard book={book} key={book._id} />
      ))}
    </div>
  );
};

export default BooksCard;
