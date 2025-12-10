# Gotta Collect Em All - Pokemon TCG Collection Manager

A React-based web application for managing and tracking your Pokemon Trading Card Game (TCG) collection. Built with a modern MERN stack (MongoDB, Express, React, Node.js), this app allows you to browse Pokemon TCG sets, track cards you own, and organize them into custom collections.

## Features

- **Browse Pokemon TCG Sets** - Explore official Pokemon Trading Card Game sets with images and information
- **Collection Tracking** - Add cards from official sets to your personal collection
- **Custom Sets** - Create your own custom sets to organize cards however you want
- **Card Management** - Track quantity and manage cards across different sets
- **Market Price Tracking** - View estimated market prices for cards in your collection
- **Responsive Design** - Dark-themed interface with pixel-art styling for a retro gaming aesthetic

## Tech Stack

**Frontend:**
- React 18+ with Vite
- React Router for navigation
- Axios for API calls
- Bootstrap 5 for styling
- Material-UI Pagination
- SCSS for custom styling

**Backend:**
- Express.js
- MongoDB Atlas for data persistence
- Mongoose for database modeling
- CORS enabled for cross-origin requests
- Node.js

## Project Structure

```
gottaCollectEmAll-React/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (MyCollection, Sets, Cards, etc.)
│   │   └── styles.scss     # Global styling
│   └── dist/               # Built production files
└── backend/
    ├── models/             # MongoDB schema definitions
    ├── server.js           # Express server & API routes
    └── db.js               # MongoDB connection
```

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account for database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Create a `.env` file in the backend directory with:
   ```
   PORT=5023
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Build frontend:
   ```bash
   cd frontend && npm run build
   ```

5. Start the backend:
   ```bash
   cd backend && npm start
   ```

The application will be available at `http://citweb:5023`

## Notes

- The frontend is served directly from the backend (Express serves static files)
- API calls use relative paths (`/api/sets`, etc.)
- MongoDB IDs are validated before attempting database queries to prevent invalid requests
- The app supports both official Pokemon TCG sets and user-created custom sets
