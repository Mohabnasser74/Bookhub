import { useState, useRef, useEffect } from "react";
import BooksTable from "./BooksTable";
import BooksCard from "./BooksCard";
import Spinner from "../Spinner";

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

{
  /* <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Book Store</h1>
        <div>
          <button
            className={`mx-1.5 text-1xl font-bold rounded p-1 ${
              sBStorge === "table" ? "bg-orange-500 hover:bg-orange-400" : null
            }`}
            onClick={() => setSBStorge("table")}>
            Table
          </button>
          <button
            className={`mx-1.5 text-1xl font-bold rounded p-1 ${
              sBStorge === "card" ? "bg-orange-500 hover:bg-orange-500" : null
            }`}
            onClick={() => setSBStorge("card")}>
            Card
          </button>
        </div>
      </div> */
}
