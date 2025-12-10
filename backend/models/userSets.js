/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

// Import Mongoose for MongoDB schema definition
import mongoose from 'mongoose'

// Schema for user sets with cards array
const userSetSchema = new mongoose.Schema({
  name: String,
  setId: String,
  cards: [
    {
      cardId: String,
      name: String,
      image: String,
      collected: { type: Boolean, default: false },
      quantity: { type: Number, default: 0 },
    }
  ],
  createdAt: { type: Date, default: Date.now },
})

// Transform schema to use 'id' instead of '_id' when converting to JSON
userSetSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default mongoose.model('UserSet', userSetSchema)
