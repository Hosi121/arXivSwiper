import { useState } from 'react';
import './App.css';


import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MyList from './MyList';
import usePapers from './hooks/usePapers';
import PaperCard from './components/PaperCard';
import FilterPanel from './components/FilterPanel';

function App() {
  const [categories, setCategories] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [papers, likePaper, unlikePaper] = usePapers(categories, keyword, sortBy);

  const handleCategoryChange = (categories: string[]) => {
    setCategories(categories);
  };

  const handleKeywordChange = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
  };

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
           <FilterPanel
            onCategoryChange={handleCategoryChange}
            onKeywordChange={handleKeywordChange}
            onSortChange={handleSortChange}
          />
        </aside>

        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={
              papers.length > 0 ? (
                <>
                  <div>
                    {papers.map((paper, index) => (
                      <PaperCard key={index} paper={paper} likePaper={likePaper} unlikePaper={unlikePaper} />
                    ))}
                  </div>
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
