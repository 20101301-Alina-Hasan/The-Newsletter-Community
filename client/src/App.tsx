import './App.css';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Tab } from './components/Tab';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { applyTheme, getStoredTheme } from './utils/react/themeManager';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Server Connected', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Server Disconnected');
    });

    // Apply the stored theme when the app loads
    applyTheme(getStoredTheme());

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <Routes>
          <Route path="/" element={<Tab />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

