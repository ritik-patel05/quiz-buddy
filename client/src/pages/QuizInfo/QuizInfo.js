import { useState } from 'react';
import { useParams } from 'react-router';
import { Header, Quiz } from '../../components';
import useGetQuizDetails from '../../hooks/useGetQuizDetails';

export const QuizInfo = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const { quizId } = useParams();
  const { data, status, error } = useGetQuizDetails(quizId);

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
            <Quiz />
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
                    onClick={() => setIsQuizStarted(!isQuizStarted)}
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
    </>
  );
};
