import BookSingleCard from "./BookSingleCard";

const BooksCard = ({ books }) => {
  return (
    <>
      {books.map((book) => (
        <BookSingleCard book={book} key={book._id} />
      ))}
    </>
  );
};

export default BooksCard;
