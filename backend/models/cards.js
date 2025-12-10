/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

/*
DEPRECATED: This model is no longer used. Use UserSet model instead.

I used this before implementing user sets to track collected cards.
*/



/* Legacy card schema - replaced by UserSet model
import mongoose from 'mongoose'


const cardSchema = new mongoose.Schema({
  cardId: String,
  name: String,
  image: String,
  count: Number,
})

cardSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default mongoose.model('CollectedCard', cardSchema)
*/