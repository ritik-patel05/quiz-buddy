import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout, loginUser, signupUser, getNewAccessToken, clearState } from './redux/authSlice';

function App() {

  const dispatch = useDispatch();

  // Add event listener that gets triggered when logout is called in one of the tabs.
  // This will call logout in all of the tabs.
  useEffect(() => {
    const syncLogout = (event) => {
      console.log("Logged out from storage :)");
      dispatch(logout());
    }

    const doUpdates = async () => {
      dispatch(clearState());
      await dispatch(signupUser({email:"ritik5@gmail.com", password:"123456" , name: "Ritik Patel"}));
      
      dispatch(clearState());
      await dispatch(loginUser({email: "ritik5@gmail.com", password: "123456"}));
      
      dispatch(clearState());
      dispatch(getNewAccessToken());  
    }

    doUpdates();

    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  },[dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
