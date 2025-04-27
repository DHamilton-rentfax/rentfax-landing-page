// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { SinglePost } from './pages/SinglePost'; // ✅ Import the SinglePost page
import { useEffect, useState } from 'react';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(userPrefersDark ? 'dark' : 'light');
  }, []);

  return (
    <div className={theme}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<SinglePost />} /> {/* ✅ Add dynamic blog post route */}
          </Routes>
          <Footer />
        </Router>
      </div>
    </div>
  );
}

export default App;
