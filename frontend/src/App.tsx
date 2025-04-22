import { useState, useCallback } from 'react';
import './App.css';
import SwipeableViews from '@mui/base/SwipeableViews';
import FilterPanel from './components/FilterPanel';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MyList from './MyList';
import usePapers from './hooks/usePapers';
import PaperCard from './components/PaperCard';

function App() {
  const [categories, setCategories] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [papers, likePaper, unlikePaper] = usePapers(categories);

  const handleCategoryChange = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const handleChangeIndex = useCallback((index: number) => {
    setIndex(index);
  }, []);

  return (
    <Router>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">arXiv Swiper</h1>
          <nav>
            <ul>
              <li>
                <Link to="/my-list">My List</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-gray-100 p-4">
          <h2>Filters</h2>
          <p>Category</p>
          <div>
            <label>
              <input
                type="checkbox"
                value="cs.AI"
                checked={categories.includes('cs.AI')}
                onChange={() => handleCategoryChange('cs.AI')}
              />
              cs.AI
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="cs.LG"
                checked={categories.includes('cs.LG')}
                onChange={() => handleCategoryChange('cs.LG')}
              />
              cs.LG
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="stat.ML"
                checked={categories.includes('stat.ML')}
                onChange={() => handleCategoryChange('stat.ML')}
              />
              stat.ML
            </label>
          </div>
          <p>Date Range</p>
          <p>Keyword Search</p>
        </aside>

        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={
              papers.length > 0 ? (
                <>
                  <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
                    {papers.map((paper, index) => (
                      <PaperCard key={index} paper={paper} likePaper={likePaper} unlikePaper={unlikePaper} />
                    ))}
                  </SwipeableViews>
                </>
              ) : (
                <p>Loading papers...</p>
              )
            } />
            <Route path="/my-list" element={<MyList likedPapers={papers.filter(paper => paper.liked)} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
