import { createSlice } from '@reduxjs/toolkit';

export const quizOptionsSlice = createSlice({
  name: 'quiz',
  initialState: {
    response: {},
  },
  reducers: {
    clearState: (state) => {
      state.response = {};
      return state;
    },
    setOption: (state, action) => {
      const { questionId, option } = action.payload;
      console.log("in setOption reducer", action.payload);
      state.response[questionId] = option;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setOption, clearState } = quizOptionsSlice.actions;

export default quizOptionsSlice.reducer;
