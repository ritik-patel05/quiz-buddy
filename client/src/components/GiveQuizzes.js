import { Formik, Form, useField } from "formik";
import styled from "@emotion/styled";
import axios from "axios";
import * as Yup from "yup";

import { QuizBoxPublic } from ".";
import useGetPublicQuizzes from "../hooks/useGetPublicQuizzes";
import { constants } from "../util/constant";
import toast, { Toaster } from "react-hot-toast";

export const GiveQuizzes = ({ callNavigateParent }) => {
  const { status, data, error } = useGetPublicQuizzes();

  return (
    <main className="">
      <div className="flex flex-col">
        <h2 className="text-center h4 p-3"> Enter Private Quiz Code</h2>
        <div className="flex flex-wrap mx-auto">
          <Formik
            initialValues={{
              quizCode: "",
            }}
            validationSchema={Yup.object({
              quizCode: Yup.string()
                .required("Required")
                .min(5, "Must be greater than 5 digits"),
            })}
            onSubmit={async ({ quizCode }) => {
              axios
                .get(
                  `${
                    process.env.NODE_ENV === "production"
                      ? `api/quiz/private-quiz/${quizCode}`
                      : `${constants.backendUrl}/api/quiz/private-quiz/${quizCode}`
                  }`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "access-token"
                      )}`,
                    },
                  }
                )
                .then((res) => {
                  const { quizId } = res.data;
                  callNavigateParent(`/quiz/${quizId}`);
                  console.log(res);
                })
                .catch((error) => {
                  if (error?.response.status === 404) {
                    toast.error("Invalid quiz code");
                  } else {
                    toast.error("Server Error");
                  }
                });
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <MyTextInput
                  name="quizCode"
                  type="text"
                  placeholder="Quiz Code"
                />
                <button type="submit" className="btn max-w-xs m-2 bg-green-400">
                  Give Quiz
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <h2 className="mt-3 text-center h4 p-3">Open To All Quizzes</h2>
        <div className="grid grid-col-1 gap-4 sm:grid-cols-2 md:grid-cols-3 mx-auto">
          {status === "loading" ? (
            <span> Loading... </span>
          ) : status === "error" ? (
            <span> Error: {error.message} </span>
          ) : (
            <>
              {data.quizzes.map((quiz) => (
                <QuizBoxPublic
                  key={quiz._id}
                  title={quiz.title}
                  time={quiz.time}
                  topic={quiz.topic.topic}
                  to={`/quiz/${quiz._id}`}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <Toaster />
    </main>
  );
};

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <input
        className={`form-input text-gray-800 rounded-md max-w-xs outline-none m-2 ${
          meta.touched && meta.error && "border-2 border-red-600"
        }`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <StyledErrorMessage className="mt-1 text-xs">
          {meta.error}
        </StyledErrorMessage>
      ) : null}
    </>
  );
};

const StyledErrorMessage = styled.div`
  &:before {
    content: "❌ ";
    font-size: 10px;
  }
`;
