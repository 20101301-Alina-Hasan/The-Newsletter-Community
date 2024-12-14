import './App.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Tab } from './components/Tab';
import { NewsCard } from "./components/NewsCard";
import { fetchNews } from './services/News';
import { NewsProps } from './interfaces/News';

function App() {
  const [newsList, setNewsList] = useState([]);  // State to store news data
  const [loading, setLoading] = useState<boolean>(true);  // Loading state

  // Fetch news data when the component mounts
  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchNews();  // Fetch data from the API
        setNewsList(newsData);  // Store the fetched data in the state
      } catch (error) {
        console.error("Error loading news:", error);
      } finally {
        setLoading(false);  // Set loading to false after data fetch is done
      }
    };

    loadNews();  // Call the function to fetch news data
  }, []);  // Empty dependency array means it runs once after the first render

  // Socket connection setup
  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Server Connected', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Server Disconnected');
    });

    // Clean up socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);  // Empty dependency array means it runs once after the first render

  if (loading) {
    return <div>Loading...</div>;  // Show a loading message while news is being fetched
  }

  return (
    <>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <Tab />
        <main className="container mx-auto px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.length === 0 ? (
              <p>No news available.</p>
            ) : (
              newsList.map((news: NewsProps['news']) => (
                <NewsCard key={news.news_id} {...news} />  // Pass the fetched news data to NewsCard
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
