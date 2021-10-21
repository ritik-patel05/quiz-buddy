import { Link } from 'react-router-dom';

export const DisplayQuiz = ({ title, time, topic, to }) => {
    return <div className='w-full p-6 flex flex-col bg-blue-500 text-white rounded-lg mb-2'> 
        <div className='flex justify-between'>
            <h2 className='h4'>{title}</h2>
            <Link to={to} className='btn-sm border-white'>Edit</Link>
        </div>
        <div className='flex'>
            <span className='mr-4'>Topic: {topic}</span>
            <span>Time: {time} minutes</span>
        </div>
    </div>
};
