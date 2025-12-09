/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

import Card from "../components/Card";
import { useState } from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

// Display all Pokemon cards with pagination
function Cards({ cards }) {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 30;

  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = cards.slice(startIndex, endIndex);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  }

  return (
    <div>
      <div className="text-center mt-4">
        <h1 className="pixel-text">All Cards</h1>
        <p>Page {currentPage} of {totalPages}</p>
      </div>

      <hr style={{ borderColor: '#000000', backgroundColor: '#000000', height: '2px' }} />

      <div className="row g-4" style={{ marginLeft: '2rem', marginRight: '2rem' }}>
        {currentCards.map((card) => (
          <div key={card.id} style={{ flex: '0 0 20%', minWidth: '20%' }}>
            <Card card={card} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
          />
        </Stack>
      </div>
    </div>
  );
}
export default Cards;