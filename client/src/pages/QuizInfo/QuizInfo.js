import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import useGetQuizDetails from '../../hooks/useGetQuizDetails';
import { Header, Quiz } from '../../components';
import { constants } from '../../util/constant';
import { getNewAccessToken, clearState } from '../../redux/authSlice';

export const QuizInfo = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const { quizId } = useParams();
  const { refetch, data, status, error } = useGetQuizDetails(quizId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const nameOfLoggedInUser = useSelector((state) => state.auth.name);

  // check if user is logged in(if the cookie is still not expired.)
  useEffect(() => {
    const handleLogin = async () => {
      if (localStorage.getItem('access-token') !== null) {
        await dispatch(getNewAccessToken());
        if (nameOfLoggedInUser === null) {
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleLogin();
    dispatch(clearState());
  }, [dispatch, nameOfLoggedInUser, navigate]);

  const handleQuizClose = () => {
    refetch();
    setIsQuizStarted(false);
  }

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
          setIsQuizStarted(true);
        })
        .catch((err) => {
          toast.error('Server error. Please try again.');
        });
    };

    callStartQuizApi();
  };

  return (
    <>
      {isQuizStarted === false && <Header />}
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
              timeInMinutes={data.quiz.time}
              correctResponseScore={data.quiz.scoreForCorrectResponse}
              incorrectResponseScore={data.quiz.scoreForIncorrectResponse}
              totalQuestions={data.quiz.questions.length}
              triggerCloseQuiz={handleQuizClose}
            />
          ) : (              
              <main className="w-full h-screen max-w-2xl font-roboto pt-20 mx-auto px-5 sm:px-6">
                <div className="bg-base-1 shadow-xl p-5 sm:p-9">
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
                    className="btn-sm bg-blue-500 text-white mb-4"
                  >
                    {data.quiz.hasAttemptedPreviously === false ? "Start Quiz" : "Reattempt Quiz" }
                  </button>
                  {data.quiz.hasAttemptedPreviously === true && (
                    <p className="flex font-medium">
                      Your previous attempt score: {data.quiz.userScore}  
                    </p>
                  )}
                </div>
              </main>
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
