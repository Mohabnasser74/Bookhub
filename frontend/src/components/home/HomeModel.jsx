import { useState, useEffect } from "react";
import BooksTable from "./BooksTable";
import BooksCard from "./BooksCard";

const HomeModel = ({ books }) => {
  const [sBStorge, setSBStorge] = useState(
    localStorage.getItem("switch_button")
  );

  useEffect(() => {
    if (sBStorge === "card") {
      localStorage.setItem("switch_button", "card");
      setSBStorge(localStorage.getItem("switch_button"));
    } else {
      localStorage.setItem("switch_button", "table");
      setSBStorge(localStorage.getItem("switch_button"));
    }
  }, [sBStorge]);

  return (
    <div className="p-4">
      {sBStorge === "table" ? (
        <BooksTable books={books} />
      ) : (
        <BooksCard books={books} />
      )}
    </div>
  );
};

export default HomeModel;
