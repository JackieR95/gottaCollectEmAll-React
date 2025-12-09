/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

import { useState } from 'react';
import axios from 'axios';

// Manage card quantity within custom user sets
function CardSetQuantity({ card, setId, onUpdate }) {
  const [quantity, setQuantity] = useState(card.quantity || 0);
  const [isChanged, setIsChanged] = useState(false);

  // Increase quantity by 1
  const handleIncrease = () => {
    setQuantity(q => q + 1);
    setIsChanged(true);
  };

  // Decrease quantity by 1 (minimum 0)
  const handleDecrease = () => {
    setQuantity(q => (q - 1 < 0 ? 0 : q - 1));
    setIsChanged(true);
  };

  // Save quantity change or remove card if 0
  const handleChange = async () => {
    try {
      if (quantity === 0) {
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/sets/${setId}/cards/${card.cardId}`);
      } else {
        await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/sets/${setId}/cards/${card.cardId}`, { quantity });
      }
      setIsChanged(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '0.5rem',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <button
          onClick={handleIncrease}
          style={{
            width: '24px',
            height: '24px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          +
        </button>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '2rem', textAlign: 'center', color: 'white' }}>{quantity}</span>
        <button
          onClick={handleDecrease}
          style={{
            width: '24px',
            height: '24px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          -
        </button>
      </div>
      <button
        onClick={handleChange}
        disabled={!isChanged}
        style={{
          padding: '0.4rem 0.8rem',
          backgroundColor: isChanged ? '#ee3e41' : '#cccccc',
          color: 'white',
          border: '2px solid #2c2c2c',
          cursor: isChanged ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
          fontSize: '0.85rem',
        }}
      >
        Change
      </button>
    </div>
  );
}

export default CardSetQuantity;
