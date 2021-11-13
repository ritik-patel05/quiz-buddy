import { useQuery } from "react-query";
import axios from "axios";
import { constants } from "../util/constant";

export const fetchQuestions = ({ queryKey }) => {
  console.log(queryKey, "here");
  return axios
    .get(
      `${
        process.env.NODE_ENV === "production"
          ? `api/question/${queryKey[1]}/questions`
          : `${constants.backendUrl}/api/question/${queryKey[1]}/questions`
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      }
    )
    .then((res) => res.data);
};

export default function useGetQuestions(quizId) {
  return useQuery(quizId && ["questions", quizId], fetchQuestions);
}
