import { useQuery } from "react-query";
import axios from "axios";
import { constants } from "../util/constant";

export default function useGetCreatedQuizzes() {
  return useQuery("createdQuizzes", () =>
    axios
      .get(
        `${
          process.env.NODE_ENV === "production"
            ? "api/quiz/created-quizzes"
            : `${constants.backendUrl}/api/quiz/created-quizzes`
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      )
      .then((res) => res.data)
  );
}
