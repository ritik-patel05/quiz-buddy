import { useQuery } from "react-query";
import axios from "axios";
import { constants } from "../util/constant";

export const fetchQuestion = ({ queryKey }) => {
  console.log(queryKey, "here");
  return axios
    .get(
      `${
        process.env.NODE_ENV === "production"
          ? `/api/question/${queryKey[1]}`
          : `${constants.backendUrl}/api/question/${queryKey[1]}`
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      }
    )
    .then((res) => res.data);
};

export default function useGetQuestionDetails(questionId) {
  return useQuery(questionId && ["question", questionId], fetchQuestion);
}
