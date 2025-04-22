import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { Paper } from '../types/paper';

const usePapers = (categories: string[]): [Paper[], (paper: Paper) => void, (paper: Paper) => void] => {
  const [papers, setPapers] = useState<Paper[]>([]);


  useEffect(() => {
    const fetchPapers = async () => {
      try {
        let query = 'all:electron';
        if (categories.length > 0) {
          query = categories.map(category => `cat:${category}`).join(' OR ');
        }
        const response = await axios.get(`http://export.arxiv.org/api/query?search_query=${query}&start=0&max_results=10`);
        const parser = new XMLParser();
        const jObj = parser.parse(response.data);
        console.log(jObj);
        const entries = jObj.feed.entry;
        const paperData = entries.map((entry: any) => ({
          title: entry.title,
          authors: entry.author.map((author: any) => author.name).join(', '),
          summary: entry.summary,
          liked: false,
        }));
        setPapers(paperData);
      } catch (error) {
        console.error('Error fetching papers:', error);
      }
    };

    fetchPapers();
  }, [categories]);

  const likePaper = useCallback((paper: Paper) => {
    setPapers(prevPapers => prevPapers.map(p => (p.title === paper.title ? { ...p, liked: true } : p)));
  }, []);

  const unlikePaper = useCallback((paper: Paper) => {
    setPapers(prevPapers => prevPapers.map(p => (p.title === paper.title ? { ...p, liked: false } : p)));
  }, []);

  return [papers, likePaper, unlikePaper];
};

export default usePapers;
