import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Paper } from '../types/paper';

const usePapers = (categories: string[], keyword: string, sortBy: string): [Paper[], (paper: Paper) => void, (paper: Paper) => void] => {
  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        let query = 'all:electron';
        if (categories.length > 0) {
          query = categories.map(category => `cat:${category}`).join(' OR ');
        }

        if (keyword) {
          query += ` AND all:${keyword}`;
        }

        let sortParam = 'relevance';
        if (sortBy === 'date') {
          sortParam = 'submittedDate';
        }

        const response = await axios.get(`/.netlify/functions/api/papers?search_query=${query}&sortBy=${sortParam}`);
        setPapers(response.data);
      } catch (error) {
        console.error('Error fetching papers:', error);
      }
    };

    fetchPapers();
  }, [categories, keyword, sortBy]);

  const likePaper = useCallback((paper: Paper) => {
    setPapers(prevPapers => prevPapers.map(p => (p.title === paper.title ? { ...p, liked: true } : p)));
  }, []);

  const unlikePaper = useCallback((paper: Paper) => {
    setPapers(prevPapers => prevPapers.map(p => (p.title === paper.title ? { ...p, liked: false } : p)));
  }, []);

  return [papers, likePaper, unlikePaper];
};

export default usePapers;
