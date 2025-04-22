import React, { useCallback } from 'react';
import { Paper } from '../types/paper';

interface Props {
  paper: Paper;
  likePaper: (paper: Paper) => void;
  unlikePaper: (paper: Paper) => void;
}

function PaperCard({ paper, likePaper, unlikePaper }: Props) {
  const handleLikeClick = useCallback(() => {
    likePaper(paper);
  }, [likePaper, paper]);

  const handleUnlikeClick = useCallback(() => {
    unlikePaper(paper);
  }, [unlikePaper, paper]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold">{paper.title}</h2>
      <p className="text-gray-600">{paper.authors}</p>
      <p className="text-gray-800">{paper.summary}</p>
      {paper.liked ? (
        <button onClick={handleUnlikeClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Unlike
        </button>
      ) : (
        <button onClick={handleLikeClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Like
        </button>
      )}
    </div>
  );
}

export default PaperCard;
