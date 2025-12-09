/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import UserSet from './models/userSets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5023;

// Connect to MongoDB
connectDB();

// Middleware for CORS and JSON parsing
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['http://citweb:5023', 'https://citstudent.lanecc.edu', 'http://citstudent.lanecc.edu', 'http://localhost:5173', 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Gotta Catch Em All TCG API' });
});

// ==================== USER SETS ROUTES ====================

// Get all user sets
app.get('/api/sets', (request, response) => {
  UserSet.find({}).then((sets) => {
    response.json(sets)
  })
})

// Get single set by ID
app.get('/api/sets/:id', (request, response, next) => {
  UserSet.findById(request.params.id)
    .then((set) => {
      if (set) {
        response.json(set)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// Create new set
app.post('/api/sets', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name required' })
  }

  const set = new UserSet({
    name: body.name,
    setId: body.setId || 'custom',
    cards: [],
  })

  set.save()
    .then((savedSet) => {
      response.json(savedSet)
    })
    .catch((error) => next(error))
})

// Add card to set
app.post('/api/sets/:id/cards', (request, response, next) => {
  const { cardId, name, image, collected, quantity } = request.body

  UserSet.findById(request.params.id)
    .then((set) => {
      if (!set) {
        return response.status(404).end()
      }

      // Check if card already exists, update quantity if it does
      const existingCard = set.cards.find(c => c.cardId === cardId)
      if (existingCard) {
        existingCard.quantity = quantity || 0
      } else {
        // Add new card to set
        set.cards.push({ cardId, name, image, collected: collected || false, quantity: quantity || 0 })
      }

      return set.save().then((updatedSet) => {
        response.json(updatedSet)
      })
    })
    .catch((error) => next(error))
})

// Update card quantity in set
app.patch('/api/sets/:id/cards/:cardId', (request, response, next) => {
  const { quantity } = request.body

  UserSet.findById(request.params.id)
    .then((set) => {
      if (!set) {
        return response.status(404).end()
      }

      const card = set.cards.find(c => c.cardId === request.params.cardId)
      if (!card) {
        return response.status(404).json({ error: 'Card not found in set' })
      }

      card.quantity = quantity
      return set.save().then((updatedSet) => {
        response.json(updatedSet)
      })
    })
    .catch((error) => next(error))
})

// Delete card from set
app.delete('/api/sets/:id/cards/:cardId', (request, response, next) => {
  UserSet.findById(request.params.id)
    .then((set) => {
      if (!set) {
        return response.status(404).end()
      }

      // Remove card from set
      set.cards = set.cards.filter(c => c.cardId !== request.params.cardId)
      return set.save().then((updatedSet) => {
        response.json(updatedSet)
      })
    })
    .catch((error) => next(error))
})

// Delete entire set
app.delete('/api/sets/:id', (request, response, next) => {
  UserSet.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Global error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(unknownEndpoint);
app.use(errorHandler);

// Start server and create Collection set if it doesn't exist
app.listen(PORT, async () => {
  try {
    const collectionExists = await UserSet.findOne({ name: 'Collection' })
    if (!collectionExists) {
      await UserSet.create({
        name: 'Collection',
        setId: 'collection',
        cards: [],
      })
      console.log('Collection set created')
    }
  } catch (error) {
    console.error('Error creating Collection set:', error)
  }
  console.log(`Server running on http://localhost:${PORT}`);
});

