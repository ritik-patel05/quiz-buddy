import { useQuery } from "react-query";
import axios from "axios";
import { constants } from "../util/constant";

export const fetchQuiz = ({ queryKey }) => {
  console.log(queryKey, "here");
  return axios
    .get(`${constants.backendUrl}/api/quiz/${queryKey[1]}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
    })
    .then((res) => res.data);
};

export default function useGetQuizDetails(quizId) {
  return useQuery(quizId && ["quiz", quizId], fetchQuiz);
}
