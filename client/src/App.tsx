import './App.css'
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Tab } from './components/Tab';
import { NewsCard } from "./components/NewsCard";
import { sampleNews } from './mock/sampleNews';

function App() {
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
  })

  return (
    <>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <Tab />
        <main className="container mx-auto px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleNews.map((news) => (
              <NewsCard key={news.id} {...news} />
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

export default App
