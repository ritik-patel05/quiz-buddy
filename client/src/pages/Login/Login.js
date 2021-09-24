import { Formik, Form, useField } from 'formik';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import { clearState, loginUser } from '../../redux/authSlice';

export const Login = () => {
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);
  const name = useSelector((state) => state.auth.name);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearState());
    if (name) {
      navigate('/');
    }
    return () => dispatch(clearState()); // clean up function.
  }, [dispatch, name, navigate]);

  useEffect(() => {
    if (status === 'failed') {
      toast.error(error);
      dispatch(clearState());
    }

    if (status === 'succeeded') {
      navigate('/');
    }
  }, [status, navigate, error, dispatch]);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page Heading */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1">Welcome back. </h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <Formik
                  initialValues={{
                    email: '',
                    password: '',
                  }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .email('Invalid email address')
                      .required('Required'),
                    password: Yup.string()
                      .min(4, 'Must be 4 characters or more.')
                      .required('Required'),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    if (status === 'idle') {
                      const login = async () => {
                        console.log('Login user func called!');
                        await dispatch(loginUser(values));
                        console.log('Login finished.');
                      };

                      login();
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <MyTextInput
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                      />

                      <MyTextInput
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                      />

                      <div className="flex flex-wrap -mx-3 mt-6">
                        <div className="w-full px-3">
                          <button
                            type="submit"
                            className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                            disabled={isSubmitting}
                          >
                            Sign in
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>

                <div className="text-gray-600 text-center mt-6">
                  Don't You have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:underline transition duration-150 ease-in-out"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Toaster />
    </div>
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
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    </div>
  );
};
