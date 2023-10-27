import { useCallback, useState, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        // const responseData = await response.json();

        // if (!response.ok) {
        //   // console.log(responseData.message);
        //   // console.log(responseData.code);
        //   setError({
        //     code: response.status,
        //   });
        //   // setIsLoading(false);
        //   throw new Error(responseData.message);
        // }

        setIsLoading(false);
        return response;
        // return responseData;
      } catch (err) {
        // setError((prev) => {
        //   return {
        //     ...prev,
        //     message: err.message,
        //   };
        // });
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, sendRequest };
};
