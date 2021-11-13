import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetQuestionDetails from "../hooks/useGetQuestionDetails";
import useGetQuestions from "../hooks/useGetQuestions";
import { setOption } from "../redux/quizSlice";
import { Formik, Field, Form } from "formik";
import { ConfirmationDialog } from "./ConfirmationDialog";
import axios from "axios";
import { constants } from "../util/constant";
import toast, { Toaster } from "react-hot-toast";

export const Quiz = ({
  quizId,
  title,
  topic,
  timeInMinutes,
  correctResponseScore,
  incorrectResponseScore,
  totalQuestions,
  triggerCloseQuiz,
}) => {
  const {
    data: allQuestionsData,
    status: allQuestionsStatus,
    error: allQuestionsError,
  } = useGetQuestions(quizId);
  const [activeQuestionId, setActiveQuestionId] = useState("");
  const {
    data: questionData,
    status: questionStatus,
    error: questionError,
  } = useGetQuestionDetails(
    allQuestionsData?.questions?.[activeQuestionId]
      ? allQuestionsData?.questions?.[activeQuestionId]
      : ""
  );
  const [answeredCount, setAnsweredCount] = useState(0);

  // Timer States(hours, minutes, seconds)
  const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timeInSeconds, setTimeInSeconds] = useState(timeInMinutes * 60);

  const [isEndTestDialogBoxOpen, setIsEndTestDialogBoxOpen] = useState(false);

  const addLeadingZeros = (value) => {
    value = String(value);
    while (value.length < 2) {
      value = "0" + value;
    }
    return value;
  };

  // Handle Countdown Timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      // clear countdown when date is reached
      if (timeInSeconds <= 0) {
        triggerCloseQuiz();
        return false;
      }

      let currTime = timeInSeconds;
      console.log(currTime, "timeee");

      const timeLeft = {
        hours: 0,
        minutes: 0,
        seconds: 0,
      };

      if (currTime >= 3600) {
        // 60 * 60
        timeLeft.hours = Math.floor(currTime / 3600);
        currTime -= timeLeft.hours * 3600;
      }
      if (currTime >= 60) {
        timeLeft.minutes = Math.floor(currTime / 60);
        currTime -= timeLeft.minutes * 60;
      }
      timeLeft.seconds = currTime;

      setTimeInSeconds(timeInSeconds - 1);
      setTimer(timeLeft);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeInSeconds]);

  const dispatch = useDispatch();
  const optionsSelected = useSelector((state) => state.quiz.response);

  // On first time quiz page load,
  // Load the first question.
  useEffect(() => {
    if (allQuestionsStatus === "success") {
      if (activeQuestionId === "") {
        setActiveQuestionId(0);
      }
    }
  }, [allQuestionsStatus, activeQuestionId]);

  // When the question loads,
  // Check if it is already answered, then set its Option id
  useEffect(() => {
    if (questionStatus === "success") {
    }
  }, [questionStatus]);

  const handleQuestionChange = (index) => {
    setActiveQuestionId(index);
  };

  const handlePreviousQuestionButtonClick = () => {
    if (activeQuestionId !== 0) setActiveQuestionId(activeQuestionId - 1);
  };

  const handleDialogBoxClose = (message) => {
    setIsEndTestDialogBoxOpen(false);

    if (message === "success") {
      axios
        .get(
          `${
            process.env.NODE_ENV === "production"
              ? `api/quiz/${quizId}/end`
              : `${constants.backendUrl}/api/quiz/${quizId}/end`
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          }
        )
        .then((res) => {
          console.log("Success, Quiz ended");
          // Trigger parent state update to close the quiz.
          triggerCloseQuiz();
        })
        .catch((err) => {
          console.log(err);
          toast.error("Server error");
        });
    }
  };

  const callSaveQuestionApi = (option) => {
    const payload = { questionId: activeQuestionId, optionSelected: option };
    axios
      .post(
        `${
          process.env.NODE_ENV === "production"
            ? `api/quiz/${quizId}/save`
            : `${constants.backendUrl}/api/quiz/${quizId}/save`
        }`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      )
      .then((res) => {
        console.log(
          `Success, Question saved: ${activeQuestionId}, with option: ${option}`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(optionsSelected);

  return (
    <main className="min-w-6xl max-w-7xl mx-auto grid grid-cols-7030 h-screen bg-base-0">
      {questionStatus === "error" && (
        <div>
          Server Error: {allQuestionsError} {questionError}
        </div>
      )}
      {questionStatus !== "error" && (
        <>
          <div>
            {/* Left Side */}
            <div className="grid grid-rows-3x">
              {/* Header */}
              <div className="sticky bg-base-0 top-0 z-10 flex justify-between items-center mx-2 py-6 px-2 ">
                <div className="mr-4">
                  {/* Logo */}
                  <h1 className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">
                    Quiz-Buddy
                  </h1>
                </div>
                <div className="flex">
                  <h2 className="text-xl font-semibold">
                    {addLeadingZeros(timer.hours) + " :"}&nbsp;
                  </h2>
                  <h2 className="text-xl font-semibold">
                    {addLeadingZeros(timer.minutes) + " : "}&nbsp;
                  </h2>
                  <h2 className="text-xl font-semibold">
                    {addLeadingZeros(timer.seconds)}
                  </h2>
                </div>
              </div>

              {/* Question Body + Options */}
              {questionStatus === "success" && (
                <Formik
                  initialValues={{
                    options: optionsSelected.hasOwnProperty(activeQuestionId)
                      ? optionsSelected[activeQuestionId]
                      : String(-1),
                  }}
                  onSubmit={(values) => {
                    const payload = {
                      questionId: activeQuestionId,
                      option: values.options,
                    };
                    // if any option is selected
                    // save the option in global state
                    // and call api to save it.
                    if (values.options !== "-1") {
                      dispatch(setOption(payload));
                      callSaveQuestionApi(values.options);
                    }
                    // if it is not the last question
                    if (activeQuestionId + 1 !== totalQuestions)
                      setActiveQuestionId(activeQuestionId + 1);
                    // call database to store that user has answered this question.
                  }}
                  enableReinitialize
                >
                  {({ values, handleChange, setValues }) => (
                    <Form>
                      <fieldset
                        onClick={(e) => {
                          // <- note: onClick not onChange
                          // Check if currently selected value in group is the currently clicked item and its already active
                          if (
                            values.options === e.target.id &&
                            e.target.checked
                          ) {
                            e.target.checked = false; // deactivate it
                            setValues({ options: "-1" }); // set value to null since nothing is selected
                          }
                        }}
                      >
                        <div className="mt-12 p-4">
                          {(questionStatus === "idle" ||
                            questionStatus === "loading") && (
                            <div> Loading... </div>
                          )}
                          {questionStatus === "success" && (
                            <>
                              <div className="p-6 mb-6 select-none bg-base-1">
                                <div className="flex flex-col mb-6">
                                  <h2 className="">
                                    Question {activeQuestionId + 1}
                                  </h2>
                                  <h3 className="text-sm">
                                    +{correctResponseScore} marks, -
                                    {incorrectResponseScore} marks
                                  </h3>
                                </div>
                                <div>{questionData.question.questionBody} </div>
                              </div>
                              <div className="grid grid-cols-2 gap-1 mb-32">
                                {questionData.question.options.map(
                                  (option, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className="p-6 cursor-pointer select-none flex items-center bg-base-1"
                                      >
                                        <span className="pr-4">
                                          <Field
                                            type="radio"
                                            onChange={handleChange}
                                            name="options"
                                            id={index}
                                            value={String(index)}
                                          />
                                        </span>
                                        <label
                                          className="cursor-pointer"
                                          htmlFor={index}
                                        >
                                          {option}
                                        </label>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </fieldset>

                      {/* Footer */}
                      <div className="sticky bottom-0 py-5 px-10">
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={handlePreviousQuestionButtonClick}
                            className="btn-sm font-normal w-32 h-12 bg-base-1"
                          >
                            Previous
                          </button>
                          <button
                            type="submit"
                            className="btn-sm bg-green-400 text-white font-semibold w-44 h-12"
                          >
                            Save and Next
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>

          {/* Right Side  */}
          <div className="h-full select-none py-3 px-6 bg-base-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="truncate mx-3 text-sm h-5">{title}</h3>
              <button
                onClick={() =>
                  setIsEndTestDialogBoxOpen(!isEndTestDialogBoxOpen)
                }
                aria-haspopup={true}
                aria-controls="end-test"
                className="btn-sm font-bold w-32 h-12"
              >
                End Test
              </button>
            </div>

            <div className="overflow-x-hidden overflow-y-scroll fixh no-scrollbar">
              <div className="mb-6">
                <div className="sticky top-0 flex items-center justify-between py-3">
                  <div className="w-9/12">
                    <h4 className="font-semibold">Questions</h4>
                    <div className="text-sm">Attempt All</div>
                  </div>
                  <div className="w-3/12 flex items-center"> </div>
                </div>

                <div className="flex flex-wrap my-6 items-center justify-between">
                  <div className="flex items-center mb-3">
                    <div className="bullet bg-green-400 border-green-400 mr-2"></div>
                    <p className="text-sm font-normal">
                      {answeredCount} answered
                    </p>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="bullet bg-white border-gray-400 mr-2"></div>
                    <p className="text-sm font-normal">
                      {totalQuestions - answeredCount} unanswered
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 grid-cols-auto-40">
                  {[...Array(totalQuestions)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionChange(index)}
                      className={`question-box ${
                        index === activeQuestionId && "active"
                      } ${
                        optionsSelected.hasOwnProperty(index) && "answered"
                      } ${
                        !optionsSelected.hasOwnProperty(index) &&
                        index !== activeQuestionId &&
                        "unanswered"
                      } `}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ConfirmationDialog
            id="end-test"
            keepMounted
            open={isEndTestDialogBoxOpen}
            onClose={handleDialogBoxClose}
            answeredCount={answeredCount}
            unansweredCount={totalQuestions - answeredCount}
          />
        </>
      )}
      <Toaster />
    </main>
  );
};
