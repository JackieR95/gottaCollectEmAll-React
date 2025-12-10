/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

// Imports React hooks for state/effects, routing components, HTTP client, and stylesheet
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './styles.scss'

// Connect to Components-navbar
import Navbar from './components/Navbar';

// Connect to Pages
import MyCollection from './pages/MyCollection';
import Sets from './pages/Sets';
import Cards from './pages/Cards';
import SetCards from './pages/SetCards';


function App() {
     // Initilaize state variables for collection and card list state
     const [collection, setCollection] = useState([]);
     const [cards, setCards] = useState([]);

     // Form fields for adding a card
     const [cardId, setCardId] = useState("");
     const [cardName, setCardName] = useState("");
     const [cardImage, setCardImage] = useState("");
     const [count, setCount] = useState(1);

     // An object containing the logo for 2 base sets to show on page
     const availableSets = [
          { id: 'base1', name: 'Base Set', image: 'https://images.pokemontcg.io/base1/logo.png' },
          { id: 'base2', name: 'Base Set 2', image: 'https://images.pokemontcg.io/base2/logo.png' },
     ];

     // API endpoint URLs for fetching set data and Pokémon cards
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

     // Fetch Pokemon cards from API or localStorage, use localstorage for a cache so images don't take so long to load
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

     // Handles form submission to add a card to the collection
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
     // Handles form submission to delete a card from the collection
     const deleteCard = (id) => {
          console.log("Delete card:", id);
     };

     // Handles form submission to update how many cards of a particular card exist in the collection
     const updateCardCount = (id, newCount) => {
          console.log("Update card:", id, "count:", newCount);
     }

     // Renders navigation and page routing for the app
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