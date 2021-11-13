import { DisplayQuiz } from ".";
import useGetCreatedQuizzes from "../hooks/useGetCreatedQuizzes";

export const QuizzesCreated = () => {
  const { status, data, error } = useGetCreatedQuizzes();
  return (
    <section>
      <div>
        {status === "loading" ? (
          <span> Loading... </span>
        ) : status === "error" ? (
          <span> Error: {error.message} </span>
        ) : (
          <>
            {data.quizzes.map((quiz) => (
              <DisplayQuiz
                key={quiz._id}
                isGivenQuizzesTab={false}
                title={quiz.title}
                time={quiz.time}
                topic={quiz.topic.topic}
                to={`edit/${quiz._id}`}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};
