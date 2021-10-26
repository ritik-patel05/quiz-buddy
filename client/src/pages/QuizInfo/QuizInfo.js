import { useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import useGetQuizDetails from '../../hooks/useGetQuizDetails';
import { Header, Quiz } from '../../components';
import { constants } from '../../util/constant';
import { clearState } from '../../redux/quizOptionsSlice';

export const QuizInfo = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const { quizId } = useParams();
  const { data, status, error } = useGetQuizDetails(quizId);

  const dispatch = useDispatch();

  const startQuizHandler = () => {
    const callStartQuizApi = () => {
      axios
        .get(`${constants.backendUrl}/api/quiz/${quizId}/start`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          // Reset options of quiz
          dispatch(clearState());
          // Start the quiz
          setIsQuizStarted(!isQuizStarted);
        })
        .catch((err) => {
          toast.error('Server error. Please try again.');
        });
    };

    callStartQuizApi();
  };

  return (
    <>
      {status === 'loading' && (
        <main className="w-full max-w-2xl font-roboto pt-20 mx-auto px-5 sm:px-6">
          Loading...
        </main>
      )}

      {status === 'success' && (
        <>
          {isQuizStarted ? (
            <Quiz
              quizId={quizId}
              title={data.quiz.title}
              topic={data.quiz.topic}
              time={data.quiz.time}
              correctResponseScore={data.quiz.scoreForCorrectResponse}
              incorrectResponseScore={data.quiz.scoreForIncorrectResponse}
              totalQuestions={data.quiz.questions.length}
            />
          ) : (
            <>
              <Header />
              <main className="w-full max-w-2xl font-roboto pt-20 mx-auto px-5 sm:px-6">
                <div className="bg-white shadow-xl p-4">
                  <h2 className="mt-1 mb-3 font-semibold text-lg">
                    {data.quiz.title}
                  </h2>
                  <div className="grid grid-cols-2">
                    <div className="font-medium">{data.quiz.topic.topic}</div>
                    <div>
                      <div className="font-medium">
                        {data.quiz.questions.length} Q's{' . '}
                        {data.quiz.scoreForCorrectResponse *
                          data.quiz.questions.length}{' '}
                        marks
                      </div>
                      <div>{data.quiz.time} mins</div>
                    </div>
                  </div>
                  <button
                    onClick={startQuizHandler}
                    className="btn-sm bg-blue-500 text-white"
                  >
                    Start Quiz
                  </button>
                </div>
              </main>
            </>
          )}
        </>
      )}

      {status === 'error' && (
        <main className="w-full max-w-2xl font-roboto pt-20 mx-auto px-5 sm:px-6">
          {error}
        </main>
      )}
      <Toaster />
    </>
  );
};
