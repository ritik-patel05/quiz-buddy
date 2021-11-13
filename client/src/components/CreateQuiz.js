import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import styled from "@emotion/styled";
import useCreateQuiz from "../hooks/useCreateQuiz";

// import { clearState, loginUser } from '../../redux/authSlice';

export const CreateQuiz = () => {
  const { mutateAsync: createQuiz } = useCreateQuiz();

  return (
    <main className="flex flex-col min-h-screen overflow-hidden">
      <div className="flex-grow">
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-8 pb-12 md:pb-20">
              {/* Form */}
              <div className="max-w-sm mx-auto">
                <Formik
                  initialValues={{
                    title: "",
                    topic: "",
                    time: 30,
                    scoreForCorrectResponse: 2,
                    scoreForIncorrectResponse: 0,
                    isPrivate: "", // for select
                  }}
                  validationSchema={Yup.object({
                    title: Yup.string().required("Required"),
                    topic: Yup.string().required("Required"),
                    time: Yup.number().required("Required"),
                    scoreForCorrectResponse: Yup.number()
                      .max(10, "Score should be <= 10.")
                      .min(-10, "Score should be >= -10"),
                    scoreForIncorrectResponse: Yup.number()
                      .max(10, "Score should be <= 10.")
                      .min(-10, "Score should be >= -10"),
                    isPrivate: Yup.string()
                      // specify the set of valid values for job type
                      // @see http://bit.ly/yup-mixed-oneOf
                      .oneOf(["private", "public"], "Invalid Quiz Visibility")
                      .required("Required"),
                  })}
                  onSubmit={async (values) => {
                    values.time = String(values.time);

                    if (values.isPrivate === "private") values.isPrivate = true;
                    else values.isPrivate = false;

                    try {
                      await createQuiz(values);
                      toast.success("Successfully created new quiz!");
                    } catch (error) {
                      toast.error(error);
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <MyTextInput
                        label="Title"
                        name="title"
                        type="text"
                        placeholder="Enter your quiz title"
                      />

                      <MyTextInput
                        label="Topic"
                        name="topic"
                        type="text"
                        placeholder="Enter your quiz topic"
                      />

                      <MyTextInput
                        label="Time (minutes)"
                        name="time"
                        type="number"
                        placeholder="Enter your quiz time in minutes"
                      />

                      <MyTextInput
                        label="Correct answer score"
                        name="scoreForCorrectResponse"
                        type="number"
                        placeholder="Enter your score for correct answer"
                      />

                      <MyTextInput
                        label="Incorrect answer score"
                        name="scoreForIncorrectResponse"
                        type="number"
                        placeholder="Enter your score for incorrect answer"
                      />

                      <MySelect label="Quiz Visibility" name="isPrivate">
                        <option value="">Select quiz type</option>
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                      </MySelect>

                      <div className="flex flex-wrap -mx-3 mt-6">
                        <div className="w-full px-3">
                          <button
                            type="submit"
                            className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Create Quiz"}
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Toaster />
    </main>
  );
};

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="flex flex-wrap -mx-3 mb-4">
      <div className="w-full px-3">
        <label
          htmlFor={props.name}
          className="block text-gray-800 text-sm font-medium mb-1"
        >
          {label}
        </label>
        <input
          className={`form-input w-full text-gray-800 outline-none ${
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
      </div>
    </div>
  );
};

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="flex flex-wrap -mx-3 mb-4">
      <div className="w-full px-3">
        <label
          htmlFor={props.name}
          className="block text-gray-800 text-sm font-medium mb-1"
        >
          {label}
        </label>
        <select {...field} {...props} />
        {meta.touched && meta.error ? (
          <StyledErrorMessage className="mt-1 text-xs">
            {meta.error}
          </StyledErrorMessage>
        ) : null}
      </div>
    </div>
  );
};

const StyledErrorMessage = styled.div`
  &:before {
    content: "❌ ";
    font-size: 10px;
  }
`;
