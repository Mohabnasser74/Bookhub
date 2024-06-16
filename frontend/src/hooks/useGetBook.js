import { useEffect, useState } from "react";

const useGetBook = (api, id) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getBook = async () => {
      try {
        const response = await fetch(`${api}/books/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setData(await response.json());
      } catch (error) {
        console.log(error);
      }
    };
    getBook();
  }, [data]);
  return data;
};

export default useGetBook;
