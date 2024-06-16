import { useContext } from "react";
import { contextProvider } from "../pages/Profile";

const useProviderContext = () => {
  const params = useContext(contextProvider);

  if (contextProvider === undefined) {
    throw new Error("Context provider => undefined");
  }

  return params;
};

export default useProviderContext;
