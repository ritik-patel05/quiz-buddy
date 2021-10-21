import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useGetQuizDetails from '../../hooks/useGetQuizDetails';
import useGetQuestionDetails from '../../hooks/useGetQuestionDetails';
import { Formik, Form, useField } from 'formik';
import styled from '@emotion/styled';
import useSaveQuestion from '../../hooks/useSaveQuestion';
import useCreateQuestion from '../../hooks/useCreateQuestion';
import { Header } from '../../components';

export const EditQuiz = () => {
  const { quizId } = useParams();
  const { status, data, error } = useGetQuizDetails(quizId);
  const [activeQuestionId, setActiveQuestionId] = useState('');
  const {
    status: questionStatus,
    data: questionData,
    error: questionError,
  } = useGetQuestionDetails(activeQuestionId);
  const [options, setOptions] = useState([]);
  const [isAddNewOptionOpen, setIsAddNewOptionOpen] = useState(false);
  const [addNewOptionText, setAddNewOptionText] = useState('');
  const { mutateAsync: saveQuestion, status: saveQuestionStatus } =
    useSaveQuestion();
  const [isAddNewQuestionFormOpen, setIsAddNewQuestionFormOpen] =
    useState(false);
  const { mutateAsync: createQuestion, status: createQuestionStatus } =
    useCreateQuestion();

  // As the data loads for quiz details.
  // Update the current active question id to the first.
  useEffect(() => {
    if (status === 'success') {
      if (!activeQuestionId) {
        if (data.quiz.questions.length) {
          setActiveQuestionId(data.quiz.questions[0]);
        }
      }
    }
  }, [status, activeQuestionId, data]);

  // As the question loads, update the options state.
  useEffect(() => {
    if (questionStatus === 'success') {
      if (!options.length) {
        setOptions(questionData.question.options);
      }
    }
  }, [questionStatus, questionData, options]);

  console.log(
    activeQuestionId,
    questionData,
    questionStatus,
    questionError,
    isAddNewQuestionFormOpen
  );

  const handleQuestionDisplay = (questionId) => {
    setOptions([]);
    setActiveQuestionId(questionId);
  };

  const toggleAddOptionField = () => {
    setIsAddNewOptionOpen(!isAddNewOptionOpen);
  };

  const toggleAddQuestionForm = () => {
    console.log('add question clicked');
    setIsAddNewQuestionFormOpen(!isAddNewQuestionFormOpen);
  };

  const handleAddOptionSurely = () => {
    console.log('clicked');
    options.push(addNewOptionText);
    setAddNewOptionText('');
    setOptions(options);
    console.log('executed');
  };

  return (
    <>
      <Header />
      <main className="w-full">
        <div className="pt-20 min-w-6xl max-w-7xl mx-auto px-5 sm:px-6">
          {isAddNewQuestionFormOpen && (
            <Formik
              initialValues={{
                questionBody: '',
              }}
              onSubmit={async (values) => {
                try {
                  const obj = {
                    values: { ...values, options },
                    quId: quizId,
                  };
                  await createQuestion(obj);
                  toast.success('Saved!');
                } catch (error) {
                  toast.error(error);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="z-50 mb-4">
                  <MyTextInput
                    label="Question Body"
                    name="questionBody"
                    type="text"
                    placeholder="Enter question body"
                  />

                  <button className="btn-sm mr-4" type="submit">
                    Add
                  </button>
                  <button
                    className="btn-sm"
                    onClick={toggleAddQuestionForm}
                    type="button"
                  >
                    Cancel
                  </button>
                </Form>
              )}
            </Formik>
          )}
          <div className="flex flex-row flex-grow">
            <div className="justify-start flex-grow max-w-xs p-2 border-red-800 border-2 mr-4">
              Questions
              {status === 'loading' ? (
                <div> Loading... </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-1">
                    {data.quiz.questions.map((questionId, index) => {
                      return (
                        <div
                          key={index}
                          className="text-center border-2 border-green-400"
                        >
                          <button
                            onClick={() => handleQuestionDisplay(questionId)}
                          >
                            {index + 1}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={toggleAddQuestionForm}
                    className="btn-sm"
                  >
                    Add Question
                  </button>
                </>
              )}
            </div>
            <div className="p-2 border-blue-400 border-2 w-full">
              Edit Question
              {!activeQuestionId ? (
                <div> No questions </div>
              ) : (
                <>
                  {questionStatus === 'loading' ? (
                    <div>Loading Questions...</div>
                  ) : (
                    <Formik
                      enableReinitialize
                      initialValues={{
                        questionBody: questionData?.question?.questionBody
                          ? questionData?.question?.questionBody
                          : '',
                        correctOption: questionData?.question?.correctOption
                          ? questionData?.question?.correctOption
                          : '',
                      }}
                      onSubmit={async (values) => {
                        try {
                          const obj = {
                            values: { ...values, options },
                            quesId: activeQuestionId,
                          };
                          await saveQuestion(obj);
                          toast.success('Saved!');
                        } catch (error) {
                          toast.error(error);
                        }
                      }}
                    >
                      {({ isSubmitting }) => (
                        <Form className="p-6">
                          <MyTextInput
                            label="Question Body"
                            name="questionBody"
                            type="text"
                            placeholder="Enter question body"
                          />
                          <div className="grid grid-cols-2">
                            <ol className="list-decimal mb-2 pl-4">
                              {options.map((option, index) => {
                                return <li key={index}> {option} </li>;
                              })}
                            </ol>

                            <MySelect
                              label="Correct Option"
                              name="correctOption"
                            >
                              {options.map((option, index) => {
                                return (
                                  <option key={index} value={index + 1}>
                                    {index + 1}
                                  </option>
                                );
                              })}
                            </MySelect>
                          </div>
                          <button
                            type="button"
                            className="btn-sm mb-2"
                            onClick={toggleAddOptionField}
                          >
                            Add Option
                          </button>

                          {isAddNewOptionOpen && (
                            <div className="flex flex-wrap mt-2 mb-4">
                              <input
                                onChange={(event) =>
                                  setAddNewOptionText(event.target.value)
                                }
                                type="text"
                                placeholder="Enter new option text"
                              />
                              <button
                                type="button"
                                className="btn-sm ml-2"
                                onClick={handleAddOptionSurely}
                              >
                                Add
                              </button>
                              <button
                                type="button"
                                className="btn-sm ml-2"
                                onClick={toggleAddOptionField}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          <button
                            type="submit"
                            className={`btn-sm text-white bg-blue-600 hover:bg-blue-700 max-w-sm ${
                              !isAddNewOptionOpen && 'ml-2'
                            }`}
                          >
                            {isSubmitting ? 'Submitting...' : 'Save Question'}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  )}
                </>
              )}
              <div></div>
            </div>
          </div>
        </div>
        <Toaster />
      </main>
    </>
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
            meta.touched && meta.error && 'border-2 border-red-600'
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
    content: '❌ ';
    font-size: 10px;
  }
`;
