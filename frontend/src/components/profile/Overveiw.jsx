const Overveiw = ({ isUserFound }) => {
  return (
    <div>
      {isUserFound && <h1>Overveiw</h1>}
      {!isUserFound && (
        <h1 className="text-3xl font-bold text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Oops! We can’t find that page.
        </h1>
      )}
    </div>
  );
};

export default Overveiw;
