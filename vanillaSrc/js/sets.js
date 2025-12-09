/*
Modified by: Jacqueline Rael
Date: 06/11/2025
Lab: Final Project - GottaCollectEmAll
*/

// Shared CSS (Bootstrap + your styles)
import './general';

// Import the navbar HTML and load it
import { loadNavbar } from './navbar.js';

// Function to load the navbar and load the top expensive cards and my collection preview for the Sets page
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar("sets");

  renderTopExpensiveCards("setPreviewContainer", 5);// Top 5 expensive base set cards
  renderMyCollectionPreview("myCollectionContainer", 5); // My collection preview
  //updateBaseSetProgressBar(); // Update the base set progress bar, commented out as it wasn't working for me //
});

const imgUrl = "assets/images/cardBack.png";
const altText = "Preview Image";

// Function to create a card preview element
function createCardPreviewElement(imgUrl, altText) {

  // create a column element that creates a div when the used
  const col = document.createElement("div");

  // Set the class names for the column to ensure proper layout in Bootstrap using col to wrap the card preview in a div
  col.className = "col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center";

  // Set the inner HTML of the column to include a card preview with an image wrapped in a div
  col.innerHTML = `
    <div class="card-preview">
      <img src="${imgUrl}" alt="${altText}" class="img-fluid">
    </div>
  `;

  // Return the column element
  return col;
}

// Function to render the top expensive cards in the specified container
function renderTopExpensiveCards(containerId, count) {
  // Get the container element by its ID and clear its content
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  // Fetch the top expensive cards from the Pokémon TCG API
  const apiUrl = "https://api.pokemontcg.io/v2/cards?q=set.id:base1";

  // Fetch the data from the API
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Check if the data is valid and contains cards
      const cards = data.data;

      // Filter the cards to find those with an average sell price and sort them by price in descending order
      const cardsWithPrices = cards
        .filter(card => card.cardmarket?.prices?.averageSellPrice) // Ensure the card has a price
        .sort((a, b) => b.cardmarket.prices.averageSellPrice - a.cardmarket.prices.averageSellPrice) // Sort by price in descending order
        .slice(0, count); // Limit to the specified count

      // If no cards found, log a message and return
      cardsWithPrices.forEach((card) => {
        const img = card.images?.small || "assets/images/cardBack.png"; // Fallback image if no image is available
        const alt = card.name || "Card"; // Use the card name as alt text, or fallback to "Card" if not available
        const col = createCardPreviewElement(img, alt); // Create a card preview element with the image and alt text
        container.appendChild(col); // Append the card preview element to the container
      });
    })
    .catch(err => {
      // Log the error if the API call fails
      console.error("Failed to load top cards:", err);
      // If the API call fails, render placeholders instead
      for (let i = 0; i < count; i++) {
        // Create and append a placeholder card preview element
        container.appendChild(createCardPreviewElement());
      }
    });
}

// Function to render a preview of the user's collection
function renderMyCollectionPreview(containerId, count) {
  // Get the container element by its ID and clear its content
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  // Retrieve the user's collection from localStorage
  const collection = JSON.parse(localStorage.getItem("myCollection") || "{}");
  const collectedCards = Object.values(collection);

  // If no cards are collected, show placeholders
  if (collectedCards.length === 0) {
    // Show placeholders
    for (let i = 0; i < count; i++) {
      container.appendChild(createCardPreviewElement());
    }
  } else {
    // If there are collected cards, create card preview elements for the specified count
    collectedCards.slice(0, count).forEach(card => {
      // Create a card preview element with the card's image and name
      const col = createCardPreviewElement(card.image, card.name);
      container.appendChild(col); // Append the card preview element to the container
    });
  }
}

/*// Function to update the base set progress bar

/*
Tried to calculate the progress of the base set collection based on the cards that are distinct kept inside the localStorage.
It wouldnt update the progress bar, so I commented it out.
Most likely because it's being called before the DOM is fully loaded or the localStorage is not set up correctly or i'm not using the correct class names or IDs.



function updateBaseSetProgressBar() {
  const collection = JSON.parse(localStorage.getItem("myCollection") || "{}");

  const baseSetId = "base1";
  const maxCards = 102;

  // Get distinct base1 cards from the collection
  const distinctBaseCards = Object.values(collection).filter(card => card.setId === baseSetId);
  const distinctCount = distinctBaseCards.length;

  // Calculate percentage
  const percentage = Math.min((distinctCount / maxCards) * 100, 100);

  // Update progress bar (same class as Sets page uses)
  const progressBar = document.querySelector(".progress-bar.custom-progress-bar");
  // Update the width and aria attributes of the progress bar
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute("aria-valuenow", Math.floor(percentage));
  }

  // Update text like "3 / 102"
  const progressText = document.querySelector(".custom-progress-text");
  if (progressText) {
    progressText.textContent = `${distinctCount} / ${maxCards}`;
  }

  // Update the % shown in the header (e.g. "5%")
  const percentText = document.querySelector(".set-header .text-muted.fs-5");
  if (percentText) {
    percentText.textContent = `${Math.floor(percentage)}%`;
  }
} */