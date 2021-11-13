import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { constants } from "../util/constant";

export default function useCreateQuestion() {
  const queryClient = useQueryClient();
  let quizId = "";
  return useMutation(
    ({ quId, values }) => {
      quizId = quId;
      return axios
        .post(
          `${
            process.env.NODE_ENV === "production"
              ? `/api/question/${quizId}/create`
              : `${constants.backendUrl}/api/question/${quizId}/create`
          }`,
          values,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          }
        )
        .then((res) => res.data);
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["edit", quizId]);
      },
    }
  );
}
