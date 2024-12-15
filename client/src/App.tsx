import './App.css';
import { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './utils/react/ProtectedRoutes';
import { ThemeProvider } from './contexts/themeContext';
import { UserContext } from './interfaces/userInterfaces';
import { userReducer } from './reducers/userReducer';
import { ToastContainer } from 'react-toastify';
import { AuthenticationCard } from './components/AuthenticationCard';
import { CreateNewsPage } from './components/CreateNewsPage';
import { EditNewsPage } from './components/EditNewsPage';
import { MyNewsPage } from './components/MyNewsPage';
import { Navbar } from './components/Navbar';
import { io } from 'socket.io-client';
import axios from 'axios';
import Cookies from 'js-cookie';
import { NewsPage } from './components/NewsPage';

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
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route path="/" element={<NewsPage />} />
              <Route path="auth" element={<AuthenticationCard />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="my-articles" element={<MyNewsPage />} />
                <Route path="create" element={<CreateNewsPage />} />
                <Route path="edit" element={<EditNewsPage />} />
              </Route>
            </Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
