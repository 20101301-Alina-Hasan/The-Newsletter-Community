import './App.css';
import { useEffect, useReducer } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoutes } from './utils/react/ProtectedRoutes';
import { ThemeProvider } from './contexts/themeContext';
// import { UpvoteProvider } from './contexts/upvoteContext';
import { UserContext } from './interfaces/userInterfaces';
import { userReducer } from './reducers/userReducer';
import { ToastContainer } from 'react-toastify';
import { fetchUser } from './services/authService';
import { LoginPage } from './components/LoginCard';
import { SignupPage } from './components/SignupCard';
import { View } from './components/View';
import { MyArticles } from './components/MyArticles';
import { CreateNewsPage } from './components/CreateNewsPage';
import { EditNewsPage } from './components/EditNewsPage';
import { Navbar } from './components/Navbar';
import { io } from 'socket.io-client';
import { Explore } from './components/Explore';

function App() {
  const [userState, userDispatch] = useReducer(userReducer, {
    token: '',
    user: null,
  });

  const initializeUser = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const response = await fetchUser(token);
      if (response.status === 200) {
        userDispatch({ type: 'login', payload: { token, user: response.data.user } });
      } else { userDispatch({ type: 'logout' }) }
    }
  };

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
    initializeUser();
  }, [userState.token]);

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      {/* <UpvoteProvider> */}
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navbar />}>
              {/* <Route path="/" element={<NewsPage />} /> */}
              <Route path="/" element={<Explore />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="news-view" element={<View />} />
              <Route element={<ProtectedRoutes />}>
                {/* <Route path="dashboard" element={<MyNewsPage />} /> */}
                <Route path="dashboard" element={<MyArticles />} />
                <Route path="create" element={<CreateNewsPage />} />
                <Route path="edit" element={<EditNewsPage />} />
              </Route>
            </Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </ThemeProvider>
      {/* </UpvoteProvider> */}
    </UserContext.Provider>
  );
}

export default App;
