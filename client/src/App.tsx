import './App.css'
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Tab } from './components/Tab';
import { NewsCard } from "./components/NewsCard";
import { sampleNews } from './mock/sampleNews';
import { connectSocket, disconnectSocket } from './config/socketConnection';

function App() {
  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

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
