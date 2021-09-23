import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { constants } from '../util/constant';

axios.defaults.withCredentials = true;

export const loginUser = createAsyncThunk(
  'users/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${constants.backendUrl}/api/auth/login`,
        {
          email,
          password,
        }
      );
      console.log('Response after login.', response);
      if (response.status === 200) {
        const { accessToken } = response.data;
        localStorage.setItem('access-token', accessToken);
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      console.log('Error during login: ', error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const signupUser = createAsyncThunk(
  'users/signupUser',
  async ({ email, password, name }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${constants.backendUrl}/api/auth/signup`,
        {
          email,
          password,
          name,
        }
      );
      console.log('Response after signup.', response);
      if (response.status === 201) {
        const navigate = useNavigate();
        navigate('/login');
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      console.log('Error during signup: ', error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getNewAccessToken = createAsyncThunk(
  'users/getNewAccessToken',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${constants.backendUrl}/api/auth/refresh_token`
      );
      console.log('Response after getNewAccessToken.', response);
      if (response.status === 200) {
        const { accessToken } = response.data;
        localStorage.setItem('access-token', accessToken);
        return thunkAPI.fulfillWithValue("Successfully created new access token.");
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      console.log('Error during getNewAccessToken: ', error.response.data);
      if (error.response.status === 403) {
        const navigate = useNavigate();
        navigate('/login');
        return thunkAPI.rejectWithValue("Not Authorized.");
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    name: '',
    email: '',
    id: '',
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {
    logout: (_) => {
      localStorage.removeItem('access-token');
      // to support logging out from all windows
      localStorage.setItem('logout', Date.now());
    },
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

      return state;
    },
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, { payload }) => {
      state.email = payload.email;
      state.user = payload.name;
      state.id = payload.id;
      state.isFetching = false;
      state.isSuccess = true;
      return state;
    },
    [loginUser.rejected]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [loginUser.pending]: (state) => {
      state.isFetching = true;
    },
    [signupUser.fulfilled]: (state, { payload }) => {
      state.isSuccess = true;
      return state;
    },
    [signupUser.rejected]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [signupUser.pending]: (state) => {
      state.isFetching = true;
    },
    [getNewAccessToken.fulfilled]: (state, { payload }) => {
      state.isSuccess = true;
      return state;
    },
    [getNewAccessToken.rejected]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [getNewAccessToken.pending]: (state) => {
      state.isFetching = true;
    },
  },
});

export const { logout, clearState } = authSlice.actions;
export default authSlice.reducer;
