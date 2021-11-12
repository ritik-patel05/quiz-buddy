import { Link } from 'react-router-dom';

export const QuizBoxPublic = ({ title, time, topic, to }) => {
    return <div className='w-full p-6 flex flex-col bg-green-50 border-2 border-gray-200 shadow-xl rounded-lg mb-2 max-w-xs'> 
        <div className='flex justify-between'>
            <h2 className='text-lg font-medium'>{title}</h2>
        </div>
        <div className='flex mt-3'>
            <span className='mr-4'>Topic: {topic}</span>
            <span>Time: {time} minutes</span>
        </div>
        <Link className='btn bg-indigo-200 mt-3' to={to}>Give Quiz</Link>
    </div>
};
