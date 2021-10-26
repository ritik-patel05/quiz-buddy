import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useGetQuestionDetails from '../hooks/useGetQuestionDetails';
import useGetQuestions from '../hooks/useGetQuestions';
import { setOption } from '../redux/quizOptionsSlice';
import { Formik, Field, Form } from 'formik';

export const Quiz = ({ quizId, title, topic, time, correctResponseScore, incorrectResponseScore, totalQuestions }) => {

  const {data: allQuestionsData, status: allQuestionsStatus, error: allQuestionsError} = useGetQuestions(quizId);
  const [activeQuestionId, setActiveQuestionId] = useState('');
  const {data: questionData, status: questionStatus, error: questionError} = useGetQuestionDetails( (allQuestionsData?.questions?.[activeQuestionId] ? allQuestionsData?.questions?.[activeQuestionId] : '' ) );
  const [answeredCount, setAnsweredCount] = useState(0);
  
  const dispatch = useDispatch();
  const optionsSelected = useSelector((state) => state.quiz.response);
    
  // On first time quiz page load,
  // Load the first question.
  useEffect(() => {
    if (allQuestionsStatus === 'success') {
      if (activeQuestionId === '') {
        setActiveQuestionId(0);
      }
    }
  }, [allQuestionsStatus, activeQuestionId]);

  // When the question loads,
  // Check if it is already answered, then set its Option id
  useEffect(() => {
    if (questionStatus === 'success') {
      
    }
  }, [questionStatus]);

  const handleQuestionChange = (index) => {
    setActiveQuestionId(index);
  }

  console.log(optionsSelected);

  return <main className='min-w-6xl max-w-7xl mx-auto grid grid-cols-7030 h-screen bg-base-0'>
    {questionStatus === 'error' && (
      <div>Server Error: {allQuestionsError} {questionError}</div>
    )}
    { (questionStatus === 'idle' || questionStatus === 'loading') && (
      <div>Loading...</div>
    )}
    {questionStatus === 'success' && (
      <>
      <div>
        <div className='grid grid-rows-3x'>
          <div> </div>

          <Formik
            initialValues={{
              options: optionsSelected.hasOwnProperty(activeQuestionId) ? optionsSelected[activeQuestionId] : -1,
            }}
            onSubmit={(values) => {
              const payload = {questionId: activeQuestionId, option: values.options};
              dispatch(setOption(payload));
              // call database to store that user has answered this question.
              
            }}
            enableReinitialize
          > 
            {({ values, handleChange }) => (
              <Form>
                <div className='mt-12 p-4'>
                  <div className='p-6 mb-6 select-none bg-base-1'>
                    <div className='flex flex-col mb-6'> 
                      <h2 className=''>Question {activeQuestionId + 1}</h2>
                      <h3 className='text-sm'>+{correctResponseScore} marks, -{incorrectResponseScore} marks</h3>
                    </div>
                    <div>{questionData.question.questionBody} </div>
                  </div>
                  <div className='grid grid-cols-2 gap-1 mb-32'> 
                    {questionData.question.options.map((option, index) => {
                      return ( 
                        <div key={index} className='p-6 cursor-pointer select-none flex items-center bg-base-1'>
                          <span className='pr-4'>
                            <Field type='radio' onChange={handleChange} name='options' id={`answer-${index + 1}`} value={String(index)} />
                          </span>
                          <label className='cursor-pointer' htmlFor={`answer-${index + 1}`}>{option}</label>
                        </div>
                        )})
                    }
                  </div>
                  <div>Picked: {values.options}</div>
                </div>

                <div className='sticky bottom-0 py-5 px-10'> 
                  <div className='flex items-center justify-between'> 
                    <button type='button' className='btn-sm font-normal w-32 h-12'>Previous</button>
                    <button type='submit' className='btn-sm bg-green-400 text-white font-semibold w-44 h-12'>Save and Next</button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          

        </div>
      </div>

      <div className='h-full select-none py-3 px-6 bg-base-1'>
        
        <div className='flex justify-between items-center mb-6'> 
          <h3 className='truncate mx-3 text-sm h-5'>{title}</h3>
          <button className='btn-sm font-bold w-32 h-12'>End Test</button>
        </div>

        <div className='overflow-x-hidden overflow-y-scroll fixh no-scrollbar'> 
          <div className='mb-6'> 

            <div className='sticky top-0 flex items-center justify-between py-3'> 
              <div className='w-9/12'>
                <h4 className='font-semibold'>Questions</h4>
                <div className='text-sm'>Attempt All</div>
              </div>
              <div className='w-3/12 flex items-center'> </div>
            </div>

            <div className='flex flex-wrap my-6 items-center justify-between'> 
              <div className='flex items-center mb-3'>
                <div className='bullet bg-green-400 border-green-400 mr-2'> </div>
                <p className='text-sm font-normal'> {answeredCount} answered </p>
              </div>
              <div className='flex items-center mb-3'> 
                <div className='bullet bg-white border-gray-400 mr-2'> </div>
                <p className='text-sm font-normal'> {totalQuestions - answeredCount} unanswered </p>
              </div>
            </div>
            
            <div className='grid gap-6 grid-cols-auto-40'> 
              {[...Array(totalQuestions)].map((_, index) => (
                <button key={index} onClick={() => handleQuestionChange(index) } className={`question-box ${index === activeQuestionId && 'active'} ${optionsSelected.hasOwnProperty(index) && 'answered'} ${( !optionsSelected.hasOwnProperty(index) && index !== activeQuestionId ) && 'unanswered' } `} >{index + 1}</button>
              ))}
              {/* <div className='question-box unanswered'> 1 </div>
              <div className='question-box active'> 2 </div>
              <div className='question-box answered active'> 3 </div> */}
            </div>
          </div>
        </div>
      </div>
      </>
    )}
  </main>;
};
