/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './styles.scss'

// Components
import Navbar from './components/Navbar';

// Pages
import MyCollection from './pages/MyCollection';
import Sets from './pages/Sets';
import Cards from './pages/Cards';
import SetCards from './pages/SetCards';

function App() {
     const [collection, setCollection] = useState([]);
     const [cards, setCards] = useState([]);

     const [cardId, setCardId] = useState("");
     const [cardName, setCardName] = useState("");
     const [cardImage, setCardImage] = useState("");
     const [count, setCount] = useState(1);

     const availableSets = [
          { id: 'base1', name: 'Base Set', image: 'https://images.pokemontcg.io/base1/logo.png' },
          { id: 'base2', name: 'Base Set 2', image: 'https://images.pokemontcg.io/base2/logo.png' },
     ];

     const setsUrl = `${import.meta.env.VITE_SERVER_URL}/api/sets`;
     const pokemonApiUrl = "https://api.pokemontcg.io/v2/cards?q=set.id:base1";

     // Fetch all user sets and extract Collection set cards
     useEffect(() => {
          axios.get(setsUrl)
               .then((response) => {
                    const collectionSet = response.data.find(set => set.name === 'Collection');
                    if (collectionSet) {
                         setCollection(collectionSet.cards || []);
                    } else {
                         setCollection([]);
                    }
               })
               .catch((error) => {
                    console.error("Error fetching sets:", error);
               });
     }, []);

     // Fetch Pokemon cards from API or localStorage
     useEffect(() => {
          const cachedCards = localStorage.getItem('pokemonCards');
          if (cachedCards) {
               setCards(JSON.parse(cachedCards));
          } else {
               axios.get(pokemonApiUrl)
                    .then((response) => {
                         setCards(response.data.data);
                         localStorage.setItem('pokemonCards', JSON.stringify(response.data.data));
                    })
                    .catch((error) => {
                         console.error("Error fetching cards:", error);
                    });
          }
     }, []);

     const addCard = (e) => {
          e.preventDefault();
          const cardObject = {
               cardId: cardId,
               name: cardName,
               image: cardImage,
               count: count,
          };
          console.log("Add card:", cardObject);
     };

     const deleteCard = (id) => {
          console.log("Delete card:", id);
     };

     const updateCardCount = (id, newCount) => {
          console.log("Update card:", id, "count:", newCount);
     }

     return (
          <>
               <Navbar />
               <Routes>
                    <Route
                    path="/"
                    element={<MyCollection collection={collection} />}
                    />
                    <Route
                    path="/sets"
                    element={
                         <Sets
                         sets={availableSets}
                         onDelete={deleteCard}
                         onUpdateCount={updateCardCount}
                         />
                    }
                    />
                    <Route
                    path="/cards"
                    element={
                         <Cards
                         cards={cards}
                         onAddCard={addCard}
                         cardId={cardId}
                         setCardId={setCardId}
                         cardName={cardName}
                         setCardName={setCardName}
                         cardImage={cardImage}
                         setCardImage={setCardImage}
                         count={count}
                         setCount={setCount}
                         />
                    }
                    />
                    <Route
                    path="/sets/:setId"
                    element={<SetCards cards={cards} onAddCard={addCard} />}
                    />
               </Routes>
          </>
     );
}

export default App;