import { DisplayQuiz } from '.';
import useQuizs from '../hooks/useQuizs';

export const QuizzesCreated = () => {
  const { status, data, error, refetch, isFetching } = useQuizs();
  return (
    <section>
      <div>
        {status === 'loading' ? (
          <span> Loading... </span>
        ): status === 'error' ? (
          <span> Error: {error.message} </span>
        ) : (
          <>
            {data.quizzes.map( (quiz, index) => (
              <DisplayQuiz key={index} title={quiz.title} time={quiz.time} topic={quiz.topic.topic} />
            ))}
          </>
        )}
      </div>
    </section>
  )
};
  