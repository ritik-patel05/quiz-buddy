import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import quizOptionsReducer from "./quizSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizOptionsReducer,
  },
});
