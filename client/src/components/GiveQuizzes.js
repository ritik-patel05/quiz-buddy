import { QuizBoxPublic } from '.';
import useGetPublicQuizzes from '../hooks/useGetPublicQuizzes';

export const GiveQuizzes = () => {
    const { status, data, error } = useGetPublicQuizzes();

    return <main className="">
        <div className="flex flex-col">
            <h2 className="text-center h4 p-3"> Enter Private Quiz Code</h2>
            <div className="flex flex-wrap mx-auto"> 
                <input type="text" className="max-w-xs m-2 rounded-md" placeholder="Quiz Code"></input>
                <button className="btn max-w-xs m-2 bg-green-400">Give Quiz</button>
            </div>
            <h2 className="mt-3 text-center h4 p-3">Open To All Quizzes</h2>
            <div className="grid grid-col-1 gap-4 sm:grid-cols-2 md:grid-cols-3 mx-auto">
                {status === 'loading' ? (
                    <span> Loading... </span>
                ): status === 'error' ? (
                    <span> Error: {error.message} </span>
                ) : (
                <>
                    {data.quizzes.map( (quiz) => (
                        <QuizBoxPublic key={quiz._id} title={quiz.title} time={quiz.time} topic={quiz.topic.topic} to={`/quiz/${quiz._id}`} />
                    ))}
                </>
                )}
            </div>
        </div>
    </main>;
};
  