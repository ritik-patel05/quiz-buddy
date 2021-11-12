import { DisplayQuiz } from '.';
import useGetGivenQuizzes from '../hooks/useGetGivenQuizzes';

export const QuizzesGiven = () => {
  const { status, data, error } = useGetGivenQuizzes();
  return (
    <section>
      <div>
        {status === 'loading' ? (
          <span> Loading... </span>
        ) : status === 'error' ? (
          <span> Error: {error.message} </span>
        ) : (
          <>
            {data.quizzes.map((quiz) => (
              <DisplayQuiz
                key={quiz._id}
                isGivenQuizzesTab={true}
                title={quiz.title}
                time={quiz.time}
                topic={quiz.topic.topic}
                to={`/quiz/${quiz._id}`}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};
