import './App.css';
import { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { applyTheme, getStoredTheme } from './utils/react/themeManager';
import { UserContext } from './interfaces/User';
import { io } from 'socket.io-client';
import { Navbar } from './components/Navbar';
import { Tab } from './components/Tab';
import { userReducer } from './reducers/userReducer';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthenticationCard } from './components/AuthenticationCard';

function App() {
  const [userState, userDispatch] = useReducer(userReducer, {
    token: '',
    user: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Server Connected', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Server Disconnected');
    });

    applyTheme(getStoredTheme());

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = Cookies.get('access_token');
        if (token) {
          const response = await axios.get('http://localhost:3000/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            userDispatch({ type: 'login', payload: { token, user: response.data.user } });
          } else {
            userDispatch({ type: 'logout' });
          }
        } else {
          userDispatch({ type: 'logout' });
        }
        console.log(userState);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error during user initialization:", err);
        if (err.message !== 'Request canceled') {
          userDispatch({ type: 'logout' });
          setError(err.message);
        }
      }
    };

    initializeUser();
  }, []);

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Tab />} />
            <Route path="auth" element={<AuthenticationCard />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
