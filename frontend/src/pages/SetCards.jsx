/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

import Card from "../components/Card";
import CardQuantity from "../components/CardQuantity";
import CardSetQuantity from "../components/CardSetQuantity";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

// Display cards for a specific set with pagination
function SetCards({ cards }) {
  const { setId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [userSetCards, setUserSetCards] = useState([]);
  const [isCustomSet, setIsCustomSet] = useState(false);
  const [setName, setSetName] = useState('');
  const cardsPerPage = 30;

  useEffect(() => {
    // Only fetch from database if setId looks like a MongoDB ID (24 hex characters)
    const isMongoId = /^[0-9a-f]{24}$/i.test(setId);

    if (!isMongoId) {
      // It's a Pokemon TCG set, not a custom set
      setIsCustomSet(false);
      return;
    }

    // Fetch custom user set from database
    const fetchCustomSet = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/sets/${setId}`);
        if (response.data && response.data.name) {
          setIsCustomSet(true);
          setSetName(response.data.name);
          setUserSetCards(response.data.cards || []);
        }
      } catch (error) {
        // Not a custom set, must be a Pokemon TCG set
        setIsCustomSet(false);
      }
    };
    fetchCustomSet();
  }, [setId]);

  // Set names for Pokemon TCG sets
  const setNames = {
    'base1': 'Base Set',
    'base2': 'Base Set 2'
  };

  // Get cards from custom set or Pokemon TCG set
  let setCards;
  if (isCustomSet) {
    setCards = userSetCards;
  } else {
    setCards = cards.filter(card => card.set?.id === setId);
  }

  // Pagination logic: calculate total pages and get cards for current page
  const totalPages = Math.ceil(setCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = setCards.slice(startIndex, endIndex);

  // Handler for setting the page
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Display set name
  const displayName = isCustomSet ? setName : (setNames[setId] || setId);

  // Refreshes custom set data after updates for instance quantity changes.
  const fetchCustomSetRefresh = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/sets/${setId}`);
      setUserSetCards(response.data.cards || []);
    } catch (error) {
      console.error('Error refreshing set:', error);
    }
  };

  // Renders the page for showing all the cards using html code made for React, handles the Pokemon tcg card image, name and pagination
  return (
    <div>
      <div className="text-center mt-4">
        <h1 className="pixel-text">{displayName}</h1>
        <p>Page {currentPage} of {totalPages} ({setCards.length} total cards)</p>
      </div>

      <hr className="border-dark border-2" />

      <div className="row g-4" style={{ marginLeft: '2rem', marginRight: '2rem' }}>
        {currentCards.map((card) => {
          const cardData = isCustomSet ? { ...card, images: { small: card.image }, name: card.name, id: card.cardId } : card;
          const quantityComponent = isCustomSet ?
            <CardSetQuantity card={card} setId={setId} onUpdate={fetchCustomSetRefresh} /> :
            <CardQuantity card={cardData} />;

          return (
            <div key={card.id || card.cardId} style={{ flex: '0 0 20%', minWidth: '20%' }}>
              <Card card={cardData} quantityComponent={quantityComponent} />
            </div>
          );
        })}
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
export default SetCards;
