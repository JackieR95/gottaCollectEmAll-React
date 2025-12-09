/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

import { useState, useEffect } from 'react';
import axios from 'axios';

// Collection progress dashboard showing stats and progress bar
function MyCollection({ collection }) {
  const [allSets, setAllSets] = useState([]);
  const [cardPrices, setCardPrices] = useState({});
  const [allCollectionCards, setAllCollectionCards] = useState([]);
  const [marketPrice, setMarketPrice] = useState(0);

  const setsUrl = "http://localhost:5001/api/sets";

  // Fetch all user sets excluding Collection set
  useEffect(() => {
    axios.get(setsUrl)
      .then((response) => {
        const userSets = response.data.filter(set => set.name !== 'Collection');
        setAllSets(userSets);
      })
      .catch((error) => {
        console.error("Error fetching sets:", error);
      });
  }, []);

  // Combine all cards from all user sets
  useEffect(() => {
    const allCards = [];
    allSets.forEach(set => {
      if (set.cards && set.cards.length > 0) {
        allCards.push(...set.cards);
      }
    });
    setAllCollectionCards(allCards);
  }, [allSets]);

  // Fetch card prices from Pokemon TCG API
  useEffect(() => {
    const fetchCardPrices = async () => {
      try {
        const prices = {};
        for (const card of allCollectionCards) {
          if (prices[card.cardId]) continue;
          
          try {
            const response = await axios.get(`https://api.pokemontcg.io/v2/cards/${card.cardId}`);
            const cardData = response.data.data;
            
            let price = 0.50;
            if (cardData.cardmarket?.prices?.averageSellPrice) {
              price = cardData.cardmarket.prices.averageSellPrice / 100;
            }
            
            prices[card.cardId] = price;
          } catch (error) {
            prices[card.cardId] = 0.50;
          }
        }
        setCardPrices(prices);
      } catch (error) {
        console.error('Error fetching card prices:', error);
      }
    };

    if (allCollectionCards.length > 0) {
      fetchCardPrices();
    }
  }, [allCollectionCards]);

  // Calculate total market price of all cards
  useEffect(() => {
    const total = allCollectionCards.reduce((total, card) => {
      const cardPrice = cardPrices[card.cardId] || 0;
      return total + (cardPrice * (card.quantity || 0));
    }, 0);
    setMarketPrice(total);
  }, [cardPrices, allCollectionCards]);

  // Calculate collection stats
  const uniqueCardsOwned = allCollectionCards.length;
  const totalCardsOwned = allCollectionCards.reduce((sum, card) => sum + (card.quantity || 0), 0);
  const totalUniqueCards = 102;
  const percentComplete = (uniqueCardsOwned / totalUniqueCards) * 100;

  return (
    <div>
        <div className="text-center mt-5 mb-2">
            <h1 className="retro-title">Collection Progress</h1>
        </div>

        <div className="container d-flex flex-column align-items-center mt-5">
            <div className="progress w-75 custom-progress">
              <div
                  className="progress-bar custom-progress-bar"
                  role="progressbar"
                  style={{width: `${percentComplete}%`, backgroundColor: '#9bbc0f'}}
                  aria-valuenow={uniqueCardsOwned}
                  aria-valuemin="0"
                  aria-valuemax={totalUniqueCards}>
              </div>
            </div>

          <div className="mt-1 w-75 text-end custom-progress-text">
              {uniqueCardsOwned} / {totalUniqueCards}
          </div>
        </div>

        <div className="d-flex justify-content-center gap-4 mt-4">
            <div className="stats-box d-flex flex-column justify-content-center align-items-center p-3 border rounded text-center shadow-sm">
            <h5 className="mb-2 boxTotal">Total Cards</h5>
            <p className="mb-0 retroNumber">{totalCardsOwned}</p>
            </div>

            <div className="stats-box d-flex flex-column justify-content-center align-items-center p-3 border rounded text-center shadow-sm">
            <h5 className="mb-2 boxMarket">Market Price</h5>
            <p className="mb-0 retroNumber">${marketPrice.toFixed(2)}</p>
            </div>
      </div>
    </div>
  );
}
export default MyCollection;