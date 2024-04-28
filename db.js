const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/esp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const movieSchema = new mongoose.Schema({
  id: Number,
  title: String,
  release: Number,
  synopsis: String
});


const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
