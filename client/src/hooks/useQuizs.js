import { useQuery } from 'react-query';
import axios from 'axios';
import { constants } from '../util/constant';

export default function useQuizs() {
  return useQuery('createdQuizzes', () =>
    axios
      .get(`${constants.backendUrl}/api/quiz/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((res) => res.data)
  );
}