import React from 'react';
import { Paper } from './types/paper';

interface Props {
  likedPapers: Paper[];
}

function MyList({ likedPapers }: Props) {
  return (
    <div>
      <h1>My List</h1>
      {likedPapers && likedPapers.length > 0 ? (
        likedPapers.map((paper, index) => (
          <div key={index}>
            <h2>{paper.title}</h2>
            <p>{paper.authors}</p>
            <p>{paper.summary}</p>
          </div>
        ))
      ) : (
        <p>No liked papers yet.</p>
      )}
    </div>
  );
}

export default MyList;
