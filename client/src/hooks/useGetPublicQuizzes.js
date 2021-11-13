import { useQuery } from "react-query";
import axios from "axios";
import { constants } from "../util/constant";

export default function useGetPublicQuizzes() {
  return useQuery("publicQuizzes", () =>
    axios
      .get(
        `${
          process.env.NODE_ENV === "production"
            ? "/api/quiz/public-quizzes"
            : `${constants.backendUrl}/api/quiz/public-quizzes`
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
