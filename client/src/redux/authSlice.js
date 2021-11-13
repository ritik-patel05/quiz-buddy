import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { constants } from "../util/constant";

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      console.log(
        "here path in auth slice,",
        `${constants.backendUrl}/api/auth/login`,
        process.env.REACT_APP_API_URL,
        process.env.NODE_ENV
      );
      const response = await axios.post(
        `${
          process.env.NODE_ENV === "production"
            ? "api/auth/login"
            : `${constants.backendUrl}/api/auth/login`
        }`,
        {
          email,
          password,
        }
      );
      console.log("Response after login.", response);
      if (response.status === 200) {
        const { accessToken } = response.data;
        localStorage.setItem("access-token", accessToken);
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(
          response?.data ? response.data : "Server error"
        );
      }
    } catch (error) {
      console.log("Error during login: ", error?.response?.data);
      return thunkAPI.rejectWithValue(
        error.response?.data ? error.response?.data : "Server error"
      );
    }
  }
);

export const signupUser = createAsyncThunk(
  "users/signupUser",
  async ({ email, password, name }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${
          process.env.NODE_ENV === "production"
            ? "api/auth/signup"
            : `${constants.backendUrl}/api/auth/signup`
        }`,
        {
          email,
          password,
          name,
        }
      );
      console.log("Response after signup.", response);
      if (response.status !== 201) {
        return thunkAPI.rejectWithValue(
          response?.data ? response.data : "Server error"
        );
      }
    } catch (error) {
      console.log("Error during signup: ", error?.response?.data);
      return thunkAPI.rejectWithValue(
        error?.response?.data ? error?.response?.data : "Server error"
      );
    }
  }
);

export const getNewAccessToken = createAsyncThunk(
  "users/getNewAccessToken",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${
          process.env.NODE_ENV === "production"
            ? "api/auth/refresh_token"
            : `${constants.backendUrl}/api/auth/refresh_token`
        }`
      );
      console.log("Response after getNewAccessToken.", response);
      if (response.status === 200) {
        const { accessToken } = response.data;
        localStorage.setItem("access-token", accessToken);
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(
          response?.data ? response.data : "Server error"
        );
      }
    } catch (error) {
      console.log("Error during getNewAccessToken: ", error.response.data);
      if (error.response.status === 403) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(
        error.response?.data ? error.response?.data : "Server error"
      );
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    name: "",
    email: "",
    id: "",
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.name = "";
      state.email = "";
      state.id = "";
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("access-token");
      // to support logging out from all windows
      localStorage.setItem("logout", Date.now());
    },
    clearState: (state) => {
      state.status = "idle";
      state.error = null;
      return state;
    },
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, { payload }) => {
      state.email = payload.email;
      state.name = payload.name;
      state.id = payload.id;
      state.status = "succeeded";
    },
    [loginUser.rejected]: (state, { payload }) => {
      console.log("payload", payload);
      state.status = "failed";
      state.error = payload?.message ? payload.message : "Server error.";
    },
    [loginUser.pending]: (state) => {
      state.status = "loading";
    },
    [signupUser.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.error = payload?.message ? payload.message : "Server error.";
    },
    [signupUser.pending]: (state) => {
      state.status = "loading";
    },
    [getNewAccessToken.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.email = payload.email;
      state.name = payload.name;
      state.id = payload.id;
      console.log("finished getNewAccessToken");
    },
    [getNewAccessToken.rejected]: (state, { payload }) => {
      console.log("payload", payload);
      state.status = "failed";
      state.error = payload?.message ? payload.message : "Server error.";
    },
    [getNewAccessToken.pending]: (state) => {
      state.status = "loading";
    },
  },
});

export const { logout, clearState } = authSlice.actions;
export default authSlice.reducer;
