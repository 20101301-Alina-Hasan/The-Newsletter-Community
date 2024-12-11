import './App.css'
import { io } from 'socket.io-client';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Server Connected', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Server Disconnected');
    });
    return () => {
      socket.disconnect();
    };
  })

  return (
    <>

    </>
  )
}

export default App
