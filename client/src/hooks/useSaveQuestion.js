import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { constants } from '../util/constant';

export default function useSaveQuestion() {
  const queryClient = useQueryClient();
  let questionId = '';
  return useMutation(
    ({ quesId, values }) => {
      questionId = quesId;
      return axios
        .put(`${constants.backendUrl}/api/question/${questionId}`, values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => res.data);
    },
    {
      onMutate: async ({ values: updatedQuestion }) => {
        console.log(updatedQuestion);
        // cancel any outgoing refetches(so they dont overwrite our optimistic update)
        await queryClient.cancelQueries(['question', questionId]);

        const previousQuestion = queryClient.getQueryData([
          'question',
          questionId,
        ]);

        // Optimistically update to new value
        queryClient.setQueryData(['question', questionId], (old) => ({
          ...old,
          ...updatedQuestion,
        }));

        return previousQuestion ? { previousQuestion } : {};
      },
      onError: (err, updatedQuestion, context) => {
        queryClient.setQueryData(
          ['question', questionId],
          context?.previousQuestion ? context?.previousQuestion : {}
        );
        console.log(err);
        return Promise.reject(err.message);
      },
      // Always refetch after error or success.
      onSettled: () => {
        queryClient.invalidateQueries(['question', questionId]);
      },
    }
  );
}
