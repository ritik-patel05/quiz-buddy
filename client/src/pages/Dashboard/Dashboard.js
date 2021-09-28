import { useEffect } from 'react';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import {
  getNewAccessToken,
  loginUser,
  clearState,
} from '../../redux/authSlice';
import { QuizzesCreated, CreateQuiz } from '../../components';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const callRefreshTokenStatus = useSelector((state) => state.auth.status);
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

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      className="pt-20 max-w-6xl mx-auto px-5 sm:px-6"
      sx={{ width: '100%', typography: 'body1' }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="My Quizzes" value="1" />
            <Tab label="Quizzes Given" value="2" />
            <Tab label="Create Quiz" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <QuizzesCreated />
        </TabPanel>
        <TabPanel value="2"></TabPanel>
        <TabPanel value="3">
          <CreateQuiz />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
