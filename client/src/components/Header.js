import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

// import { setUser, logout } from '../features/user/userSlice';

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [top, setTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const name = useSelector((state) => state.auth.name);

  // detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  const logoutHandler = (e) => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
        !top && "bg-white blur shadow-lg"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="mr-4">
            {/* Logo */}
            <Link
              to="/"
              className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
              aria-label="Quiz-Buddy"
            >
              Quiz-Buddy
            </Link>
          </div>

          {/* Site navigation */}
          <nav className="hidden md:flex md:flex-grow">
            <ul className="flex flex-grow justify-end flex-wrap items-center">
              <li>
                <Link
                  to="/dashboard"
                  className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Dashboard
                </Link>
              </li>
              {!name ? (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3"
                    >
                      <span>Sign up</span>
                      <svg
                        className="w-3 h-3 fill-current text-gray-400 flex-shrink-0 ml-2 -mr-1"
                        viewBox="0 0 12 12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                          fillRule="nonzero"
                        />
                      </svg>
                    </Link>
                  </li>{" "}
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800"
                    >
                      Log Out
                    </button>
                  </li>{" "}
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Sidebar */}
          <div className="flex md:hidden">
            {/* Render Close icon if menu not open.
							else: Render Hamburger icon
						 */}
            <button className="" onClick={() => setMenuOpen(!menuOpen)}>
              {!menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Mobile Navigation */}
            <nav
              style={{ maxHeight: "220px" }}
              className={` ${
                !menuOpen && "hidden"
              } z-20 w-full top-full left-0 absolute p-6 h-screen bg-blue-50 overflow-hidden`}
            >
              <ul className="px-5 py-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex justify-center w-full transition duration-150 ease-in-out"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex justify-center w-full transition duration-150 ease-in-out"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="btn-sm flex w-full my-2 py-2 px-4 text-gray-200 bg-gray-900 hover:bg-gray-800"
                  >
                    <span>Sign up</span>
                    <svg
                      className="w-3 h-3 fill-current text-gray-400 flex-shrink-0 ml-2 -mr-1"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                        fillRule="nonzero"
                      />
                    </svg>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
