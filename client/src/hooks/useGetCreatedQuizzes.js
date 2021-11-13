import { useQuery } from "react-query";
import axios from "axios";
import { constants } from "../util/constant";

export default function useGetCreatedQuizzes() {
  return useQuery("createdQuizzes", () =>
    axios
      .get(`${constants.backendUrl}/api/quiz/created-quizzes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      })
      .then((res) => res.data)
  );
}
