import { api } from "../App";

const getBookLoader = async ({ params }) => {
  try {
    const response = await fetch(
      `${api}/books/${params?.username}/${params?.id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;;
  }
};

export default getBookLoader;
