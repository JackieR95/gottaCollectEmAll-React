/*
Modified by: Jacqueline Rael
Date: 06/11/2025
Lab: Final Project - GottaCollectEmAll
*/


export const navbarHTML = `
    <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="./">
            <img src="assets/images/pokebollLogo.png" alt="Pokéball" width="30" height="30" class="d-inline-block align-text-top">
            Gotta Collect 'Em All
        </a>
        </button>
        <div class="container-fluid" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item active">
                    <a class="nav-link" href="./">Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="./cards.html">Cards</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="./sets.html">Sets</a>
                </li>
            </ul>
        </div>
    </nav>
`;

// Function to load the navbar HTML and set the active link based on the current page
export function loadNavbar(currentPage = "") {
  const container = document.getElementById("navbar-container");
  // If currentPage is not provided, default to an empty string
  if (container) {
    container.innerHTML = navbarHTML; // Load the navbar HTML into the container

    // Set the active link based on the current page
    const links = container.querySelectorAll(".nav-link");
    //Determine which link should be active
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if ((currentPage === "" && href === "./") || href.includes(currentPage)) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
}
