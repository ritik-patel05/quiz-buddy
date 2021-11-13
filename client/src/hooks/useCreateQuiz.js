import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { constants } from "../util/constant";

export default function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation(
    (values) =>
      axios
        .post(
          `${
            process.env.NODE_ENV === "production"
              ? "api/quiz/create"
              : `${constants.backendUrl}/api/quiz/create`
          }`,
          values,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          }
        )
        .then((res) => res.data),
    {
      onMutate: async (newQuiz) => {
        // cancel any outgoing refetches(so they dont overwrite our optimistic update)
        await queryClient.cancelQueries("createdQuizzes");

        const previousQuizzes = queryClient.getQueryData("createdQuizzes");

        // Optimistically update to new value
        queryClient.setQueryData("createdQuizzes", (old) => {
          console.log(old);
          if (!old) old = {};
          old.quizzes = old?.quizzes ? [...old.quizzes, newQuiz] : [newQuiz];
          return old;
        });

        return previousQuizzes ? { previousQuizzes } : {};
      },
      onError: (err, newQuiz, context) => {
        queryClient.setQueryData(
          "createdQuizzes",
          context?.previousQuizzes ? context?.previousQuizzes : []
        );
        console.log(err);
        return Promise.reject(err.message);
      },
      // Always refetch after error or success.
      onSettled: () => {
        queryClient.invalidateQueries("createdQuizzes");
      },
    }
  );
}
