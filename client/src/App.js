import './App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import {
  logout,
  loginUser,
  signupUser,
  getNewAccessToken,
  clearState,
} from './redux/authSlice';
import { Home, Login, Signup } from './pages/index';

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();

  // Add event listener that gets triggered when logout is called in one of the tabs.
  // This will call logout in all of the tabs.
  useEffect(() => {
    const syncLogout = (event) => {
      console.log('Logged out from storage :)');
      dispatch(logout());
    };

    const doUpdates = async () => {
      dispatch(clearState());
      await dispatch(
        signupUser({
          email: 'ritik5@gmail.com',
          password: '123456',
          name: 'Ritik Patel',
        })
      );

      dispatch(clearState());
      await dispatch(
        loginUser({ email: 'ritik5@gmail.com', password: '123456' })
      );

      dispatch(clearState());
      await dispatch(getNewAccessToken());
    };

    // doUpdates();

    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
