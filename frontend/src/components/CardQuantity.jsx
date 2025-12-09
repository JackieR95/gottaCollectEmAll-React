/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

import { useState, useEffect } from 'react';
import axios from 'axios';

// Add cards from Pokemon TCG sets to user's collection
function CardQuantity({ card }) {
  const [quantity, setQuantity] = useState(0);
  const [showSetModal, setShowSetModal] = useState(false);
  const [userSets, setUserSets] = useState([]);

  useEffect(() => {
    fetchSets();
  }, []);

  // Fetch all user sets from database
  const fetchSets = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/sets`);
      setUserSets(response.data);
    } catch (error) {
      console.error('Error fetching sets:', error);
    }
  };

  // Increase quantity by 1
  const handleIncrease = () => {
    setQuantity(q => q + 1);
  };

  // Decrease quantity by 1 (minimum 0)
  const handleDecrease = () => {
    setQuantity(q => (q - 1 < 0 ? 0 : q - 1));
  };

  // Add card to selected set
  const handleAddToSet = async (setId) => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/sets/${setId}/cards`, {
        cardId: card.id,
        name: card.name,
        image: card.images.small,
        quantity: quantity > 0 ? quantity : 1,
      });
      setQuantity(0);
      setShowSetModal(false);
    } catch (error) {
      console.error('Error adding card to set:', error);
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
        onClick={() => setShowSetModal(true)}
        disabled={quantity === 0}
        style={{
          padding: '0.4rem 0.8rem',
          backgroundColor: quantity === 0 ? '#cccccc' : '#ee3e41',
          color: 'white',
          border: '2px solid #2c2c2c',
          cursor: quantity === 0 ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '0.85rem',
        }}
      >
        Add
      </button>

      {/* Set Selection Modal */}
      {showSetModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            minWidth: '300px',
            border: '3px solid #2c2c2c',
          }}>
            <h2 className="pixel-text" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              Add to Set
            </h2>
            <p style={{ marginBottom: '1rem' }}>Select a set to add this card:</p>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
              {userSets.filter(set => set.name !== 'Collection').map(set => (
                <button
                  key={set.id}
                  onClick={() => handleAddToSet(set.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    backgroundColor: '#f0f0f0',
                    border: '2px solid #2c2c2c',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    borderRadius: '4px',
                  }}
                >
                  {set.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSetModal(false)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#cccccc',
                border: '2px solid #2c2c2c',
                cursor: 'pointer',
                fontWeight: 'bold',
                borderRadius: '4px',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardQuantity;
