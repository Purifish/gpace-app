import { useCallback } from "react";

export const useCapitalizer = () => {
  const capitalizeWords = useCallback((text) => {
    if (text.toLowerCase() === "faq") {
      return "FAQ";
    }
    return text
      .split(" ")
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(" ");
  }, []);

  return { capitalizeWords };
};
