
/*
Modified by: Jacqueline Rael
Date: 06/11/2025
Lab: Final Project - GottaCollectEmAll
*/

// Import the general styles
import "./general";

// Import the function to load the navbar
import { loadNavbar } from "./navbar.js";

// Import the function to get the regex for name matching
// Commented out for now, as it was not working properly with the search functionality
// import { getNameMatchRegex } from "../assets/searchValidate.js"; //

// Card handling class
class Card {
  // define class properties
  constructor() {
    this.cardBackImage = "assets/images/cardBack.png"; // default card back image
    this.apiUrl = "https://api.pokemontcg.io/v2/cards?q=set.id:base1"; // base set API URL
    this.defaultContainer = "cardsContainer"; // default container ID for cards
  }

  //////////////////////////////////////// Rendering Methods - Cards //////////////////////////////////////////////////////

  // This method renders the collection layout
  renderCollectionLayout() {
    // Get the container by class name
    const container = document.getElementById("cards-container");

    // Check if the container exists and then set its inner HTML, this html gets injected into cards.html when the page 'my collection' is selected
    container.innerHTML = `
      <div class="container mt-4">

        <!-- Collection Header with back button -->
        <div class="row align-items-center mb-3 border-bottom border-2 border-dark pb-2">
          <div class="col">
            <a href="sets.html" class="btn pixel-font btn-outline-dark btn-sm mb-2">← Back</a>
            <h2 class="pixel-font mb-0">My Collection</h2>
          </div>
        </div>

        <p><strong>Total Cards: </strong><span id="totalCardsCount">0</span></p>

        <div id="cardsContainer" class="row g-4 justify-content-center"></div>
      </div>
    `;
  }

  // This method renders the base set layout
  renderBaseLayout() {
    // Get the container by class name
    const container = document.getElementById("cards-container");

    // Check if the container exists and then set its inner HTML, this html gets injected into cards.html when the page 'base set' is selected
    container.innerHTML = `
      <div class="container mt-4">
        <!-- Back Button -->
        <a href="sets.html" class="btn pixel-font btn-outline-dark btn-sm mb-2">← Back</a>

        <div class="row align-items-center mb-3 border-bottom border-2 border-dark pb-2">
          <div class="col">
            <h2 class="pixel-font mb-0">Base Set</h2>
          </div>
        </div>

        <div id="cardsContainer" class="row g-4 justify-content-center"></div>
      </div>
    `;
  }

  // This method renders the cards layout for the cards page
  renderCardsLayout() {
    // Get the container by class name
    const container = document.getElementById("cards-container");
    // Check if the container exists
    if (!container) {
      console.warn("cards-container not found"); // Log a warning if the container is not found
      return;
    }

    // Set the inner HTML of the container, this html gets injected into cards.html when the page 'all cards' is selected
    container.innerHTML = `
    <!-- Text Cards -->
  <div class="text-center mt-4">
    <h1 class="pixel-text">All Cards</h1>
  </div>

    <!-- Cards row -->
    <div class="row justify-content-between text-center">
      <div id="cardsContainer" class="row g-4 justify-content-center">
      </div>
    </div>
    `;
  }

  ////////////////////////////////////////Rendering Methods - Fetch //////////////////////////////////////////////////////

  // This method fetches cards from the API and renders them into the specified container
  fetchAndRender(url, containerId) {
    console.log("=== FETCH START ===");
    console.log("Fetching from URL:", url, "into container:", containerId);
    
    const container = document.getElementById(containerId);
    console.log("Container element found:", container);
    
    // Fetch the data from the API
    fetch(url)
      .then((response) => {
        console.log("Response received:", response.status, response.ok);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`); // Throw an error if the response is not ok
        return response.json();
      })
      .then((data) => {
        console.log("JSON parsed, full data:", data);
        // Get the cards from the data
        const cards = data.data;
        console.log("Fetched cards count:", cards ? cards.length : 0);
        console.log("First card:", cards ? cards[0] : "none");
        // Call the renderCards method to render the fetched cards into the specified container
        this.renderCards(cards, containerId);
      })
      .catch((error) => {
        console.error("Failed to fetch cards:", error);
        // Render 20 placeholders with null cards so createCardElement shows back image if API fails
        const placeholderArray = new Array(20).fill(null);
        // Call the renderCards method to render the placeholders
        this.renderCards(placeholderArray, containerId);
      });
  }

  // This method renders the cards into the specified container
  renderCards(cardsArray, containerId) {
    //Get the container by ID
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    // Loop through the cards array and create card elements
    cardsArray.forEach((card) => {
      const cardElem = this.createCardElement(card);
      // Check if the card element is valid before appending, then append it to the container
      container.appendChild(cardElem);
    });
  }

  // This method renders the collection cards from localStorage
  renderCollectionCards() {
    // Get the container and total cards count elements
    const cardsContainer = document.getElementById("cardsContainer");
    const totalCardsCount = document.getElementById("totalCardsCount");

    // Get the collection from localStorage, or initialize it as an empty object if not found
    const collection = JSON.parse(localStorage.getItem("myCollection") || "{}");

    // Initialize total count and clear the container
    let totalCount = 0;
    cardsContainer.innerHTML = "";

    // Go through each card in the collection and create a column for it by using Object.entries and grabbing the cardId, count, image and name
    Object.entries(collection).forEach(([cardId, { count, image, name }]) => {
      totalCount += count;

      // Create a column element for the card with a div wrapped around
      const col = document.createElement("div");
      col.className =
        "col-6 col-sm-4 col-md-3 col-lg-5th d-flex flex-column align-items-center";
      //from col get the cardId and set it as a data attribute
      col.dataset.cardId = cardId;

      // Set the inner HTML of the column with the card image, name, count and buttons
      col.innerHTML = `
        <img src="${image}" alt="${name}" class="img-fluid mb-3" style="max-height: 200px;">

        <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
          <button class="btn btn-outline-secondary btn-sm decrement">-</button>
          <span class="counter">${count}</span>
        </div>

        <button class="btn btn-danger btn-sm remove-card">Remove</button>
      `;

      // Add event listeners to the buttons in the column
      const decrementBtn = col.querySelector(".decrement");
      const counterSpan = col.querySelector(".counter");
      const removeBtn = col.querySelector(".remove-card");

      // Add event listeners for increment, decrement and remove buttons
      decrementBtn.addEventListener("click", () => {
        // Decrement the count and update the counter span
        if (collection[cardId].count > 1) {
          collection[cardId].count--;
          counterSpan.textContent = collection[cardId].count;
        } else {
          // If count is 0, remove the card from the collection
          delete collection[cardId];
          col.remove(); // Remove the column from the DOM
        }
        // Update the collection in localStorage
        localStorage.setItem("myCollection", JSON.stringify(collection));
        this.renderCollectionCards(); // Re-render to update total
      });

      // Add event listener for the remove button
      removeBtn.addEventListener("click", () => {
        // Remove the card from the collection and update the UI
        delete collection[cardId];
        // Update the collection in localStorage
        localStorage.setItem("myCollection", JSON.stringify(collection));
        col.remove(); // Remove the column from the DOM
        this.renderCollectionCards(); // Re-render to update total
      });

      // Append the column to the cards container
      cardsContainer.appendChild(col);
    });

    // Update the total cards count in the UI
    totalCardsCount.textContent = totalCount;
  }

  //////////////////////////////////////// Card Handling //////////////////////////////////////////////////////

  // This method creates a card element with buttons for incrementing, decrementing and adding to collection
  createCardElement(card) {
    // Create a column element for the card with a div wrapped around
    const col = document.createElement("div");
    // Set the class for the column to style it properly
    col.className =
      "col-6 col-sm-4 col-md-3 col-lg-5th d-flex flex-column align-items-center card-col";

    // Set a data attribute for the card ID
    const cardImage = card?.images?.small || this.cardBackImage;
    const cardName = card?.name || "Pokémon Card Back";

    // Set the inner HTML of the column with the card image, name, counter and buttons
    col.innerHTML = `
    <img
      src="${cardImage}"
      alt="${cardName}"
      class="img-fluid mb-3"
      style="max-height: 200px;"
    >

    <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
      <button class="btn btn-outline-secondary btn-sm decrement">-</button>
      <span class="counter">0</span>
      <button class="btn btn-outline-secondary btn-sm increment">+</button>
    </div>

    <button class="btn btn-primary btn-sm add-card">Add</button>
  `;

    // Call the setupCardButtons method to add functionality to the buttons
    this.setupCardButtons(col, card);
    return col;
  }


  // This method adds a card to the collection in localStorage
  addToCollection(card) {
    // Get the collection from localStorage, or initialize it as an empty object if not found
    const collection = JSON.parse(localStorage.getItem("myCollection") || "{}");

    // Check if the card ID exists in the collection then increment the count, otherwise add it with count 1
    if (collection[card.id]) {
      collection[card.id].count += 1;
    } else {
      collection[card.id] = {
        count: 1,
        image: card.images.small,
        name: card.name,
        price: card.cardmarket?.prices?.averageSellPrice || 0, // get average sell price if available
      };
    }

    // Update the collection in localStorage
    localStorage.setItem("myCollection", JSON.stringify(collection));
  }

  // This method sets up the buttons for incrementing, decrementing and adding to collection for each card
  setupCardButtons(cardElement, card) {
    // Get the buttons and counter elements from the card element, get the decrement, increment and add buttons plus the counter span which is used to display the count of cards to be added
    const decrementBtn = cardElement.querySelector(".decrement");
    const incrementBtn = cardElement.querySelector(".increment");
    const counter = cardElement.querySelector(".counter");
    const addButton = cardElement.querySelector(".add-card");

    // Add event listeners to the buttons
    decrementBtn.addEventListener("click", () => {
      let value = parseInt(counter.textContent, 10);
      if (value > 0) counter.textContent = value - 1;
    });

    incrementBtn.addEventListener("click", () => {
      let value = parseInt(counter.textContent, 10);
      counter.textContent = value + 1;
    });

    addButton.addEventListener("click", () => {
      const count = parseInt(counter.textContent, 10) || 0;

      // Check if the card has an ID and count is greater than 0
      if (card?.id && count > 0) {
        for (let i = 0; i < count; i++) {
          this.addToCollection(card); // Add the card to the collection
        }
        // Reset counter to 0
        counter.textContent = "0";

        // Show toast
        this.showToast(
          `${count} ${card.name} card${count > 1 ? "s" : ""
          } added to your collection!`
        );
      }
    });
  }


  //////////////////////////////////////// Toast Handling //////////////////////////////////////////////////////


  // This method shows a toast message at the top right corner of the screen when a card is added to the collection
  showToast(message) {
    // Remove any existing toast message to avoid duplicates
    const existingToast = document.getElementById("toast-message");
    if (existingToast) existingToast.remove(); // Remove existing toast if present

    // Create a new toast message element
    const toast = document.createElement("div");
    toast.id = "toast-message";
    toast.className =
      "toast-message position-fixed top-0 end-0 m-4 p-3 bg-dark text-white rounded shadow";
    toast.style.zIndex = "1055";
    toast.textContent = message; // Set the message text

    // Append the toast to the body
    document.body.appendChild(toast);

    // Automatically remove the toast after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Initialize the Card class and set up event listeners when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar("cards"); // Load the navbar for the cards page

  // Create an instance of the Card class
  const cardApp = new Card();

  // Get the URL parameters to determine which set is selected
  const params = new URLSearchParams(window.location.search);
  const selectedSet = params.get("set"); // e.g., "base" or "collection"

  // Check if the current page is the cards page
  const isCardsPage = window.location.pathname.includes("cards.html");

  // Render the appropriate layout based on the selected set or if it's the cards page
  if (selectedSet === "base") {
    cardApp.renderBaseLayout();
    cardApp.fetchAndRender(cardApp.apiUrl, "cardsContainer");
  } else if (selectedSet === "collection") {
    cardApp.renderCollectionLayout();
    cardApp.renderCollectionCards();
  } else if (isCardsPage) {
    // This is the generic "All Cards" page
    cardApp.renderCardsLayout(); //  renders search bar + container
    cardApp.fetchAndRender(
      "https://api.pokemontcg.io/v2/cards?q=set.id:base1",
      "cardsContainer"
    );
  } else {
    cardApp.renderBaseLayout(); // fallback
    cardApp.fetchAndRender(cardApp.apiUrl, cardApp.defaultContainer); // default to base set
  }
});

//Code removed for now, to be added later when i have time to make it work
/*


//Code for rendering the base set layout, removed the radio buttons for now and search bar
    container.innerHTML = `
    <!-- Back Button -->
      <div class="container mt-4">
        <a href="sets.html" class="btn pixel-font btn-outline-dark btn-sm mb-2">← Back</a>

        <!-- Search Bar -->
        <div class="row justify-content-center mb-4">
          <div class="col-md-6">
            <input type="text" class="form-control" placeholder="Search Pokémon cards..." id="searchBar">
          </div>
        </div>

        <div class="row align-items-center mb-3 border-bottom border-2 border-dark pb-2">
          <div class="col">
            <h2 class="pixel-font mb-0">Base Set</h2>
          </div>
        </div>

        <div class="d-flex align-items-center justify-content-between mb-4">
          <div><p class="mb-0"><strong>102 Cards</strong></p></div>
          <div class="d-flex justify-content-center flex-grow-1">
            <label class="form-check-label mx-3 mb-0">
              <input type="radio" name="filter" value="all" checked> All
            </label>
            <label class="form-check-label mx-3 mb-0">
              <input type="radio" name="filter" value="in"> In Collection
            </label>
            <label class="form-check-label mx-3 mb-0">
              <input type="radio" name="filter" value="notin"> Not in Collection
            </label>
          </div>
        </div>

        <div id="cardsContainer" class="row g-4 justify-content-center"></div>
      </div>
    `;
  }

    container.innerHTML = `
    <!-- Text Cards -->
  <div class="text-center mt-4">
    <h1 class="pixel-text">All Cards</h1>
  </div>

    <!-- Search Bar -->
    <div class="row justify-content-center mb-2 mt-5">
      <div class="col-md-6">
        <input
          type="text"
          class="form-control"
          placeholder="Search Pokémon cards..."
          id="searchBar"
        >
      </div>


    <!-- Cards row -->
    <div class="row justify-content-between text-center">
      <div id="cardsContainer" class="row g-4 justify-content-center">
      </div>
    </div>
    `;
  }

// This method sets up the search filter for the cards page
i wasnt able to get it to work, i would have to debug it more, in console it shows the search term and number of card elements, but it does not remove the cards that do not match the search term, it just shows all cards


    setupSearchFilter() {
    // Get the search input element and check if it exists
    const searchInput = document.getElementById("cardSearch");
    // If search input is not found, log a warning and return
    if (!searchInput) {
      console.warn("Search input not found");
      return;
    }

    // Add an event listener for input changes on the search input
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.trim(); // Get the trimmed search term from the input
      const cardElements = document.querySelectorAll(".card-col"); // Get all card elements with the class "card-col"

      console.log("Search term: –", searchTerm);
      console.log("Number of card elements: –", cardElements.length);

      // Function to get the regex for matching names based on the search term
      const regex = getNameMatchRegex(searchTerm);
      // Initialize counters for exact and partial matches
      let exactMatches = 0;
      let partialMatches = 0;

      // Loop through each card element and check if it matches the search term
      cardElements.forEach((col) => {
        const img = col.querySelector("img");
        const name = img?.alt || ""; // Get the alt text of the image as the card name, or an empty string if not found

        // Hide placeholder cards if the name is "Pokémon Card Back"
        if (name === "Pokémon Card Back") {
          col.style.display = "none";
          return;
        }

        // Test the name against the regex to see if it matches the search term
        const isMatch = regex.test(name);

        // Set the display style based on whether it matches the search term
        if (searchTerm === "") {
          col.style.display = "flex";
        } else if (isMatch) {
          col.style.display = "flex";
          partialMatches++;
          // Check for exact match
          if (name.toLowerCase() === searchTerm.toLowerCase()) {
            exactMatches++;
          }
          console.log("Showing: –", name);
        } else {
          col.style.display = "none";
          console.log("Hiding: –", name); //
        }
      });

      // Log the number of exact and partial matches
      if (searchTerm !== "") {
        console.log("Exact matches: –", exactMatches);
        console.log("Partial matches: –", partialMatches);
      } else {
        console.log("Empty search, show all cards");
      }
    });

}


*/
