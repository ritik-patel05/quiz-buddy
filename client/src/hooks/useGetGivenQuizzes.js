import { useQuery } from "react-query";
import axios from "axios";
import { constants } from "../util/constant";

export default function useGetGivenQuizzes() {
  return useQuery("givenQuizzes", () =>
    axios
      .get(
        `${
          process.env.NODE_ENV === "production"
            ? "/api/quiz/given-quizzes"
            : `${constants.backendUrl}/api/quiz/given-quizzes`
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
