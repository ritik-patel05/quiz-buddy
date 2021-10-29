import './App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { logout, getNewAccessToken, clearState } from './redux/authSlice';
import {
  Home,
  Login,
  Signup,
  Dashboard,
  EditQuiz,
  QuizInfo,
} from './pages/index';
import { Header } from './components/index';

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();

  // check if user is logged in(if the cookie is still not expired.)
  useEffect(() => {
    const handleLogin = async () => {
      await dispatch(getNewAccessToken());
    };

    handleLogin();
    dispatch(clearState());
  }, [dispatch]);

  // Add event listener that gets triggered when logout is called in one of the tabs.
  // This will call logout in all of the tabs.
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === 'logout') {
        console.log('Logged out from storage :)');
        dispatch(logout());
      }
    };

    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, [dispatch]);

  return (
    <div className='bg-base-0'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/edit/:quizId" element={<EditQuiz />} />
        <Route path="quiz/:quizId" element={<QuizInfo />} />
      </Routes>
    </div>
  );
}

export default App;
