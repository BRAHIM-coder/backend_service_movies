const express = require('express');
const mongoose = require('mongoose');
const logger = require("morgan");
const app = express();
const connectDB = require('./db'); 
const Movie = require('./db');
//const data = require("./movies.json");
const uuid = require('uuid');
const port =4000;





app.use(logger("dev"));
app.use(express.json());
app.get('/', (req, res) => {
    //console.log(`Request from ${req.url}`);
    res.send("Server running");
});

app.get('/movies', async (req, res) => {
  try {
      const movies = await Movie.find();
      res.status(200).json(movies);
  } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/movies/', (req, res) => {
  const moviesToInsert = req.body; // Array of movie objects

  Movie.insertMany(moviesToInsert)
    .then((movies) => {
      console.log('Movies added successfully:', movies);
      // Exclude _id and __v fields from the response
      const sanitizedMovies = movies.map(movie => {
        return {
          id: uuid.v4(),
          title: movie.title,
          release: movie.release,
          synopsis: movie.synopsis
        };
      });
      res.status(201).json(sanitizedMovies);
    })
    .catch(err => {
      console.error('Error adding movies:', err);
      res.status(500).json({ error: 'Could not add movies' });
    });
});


app.put('/movies/:id', async (req, res) => {
  const id = req.params.id;
  const { title, release, synopsis } = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, { title, release, synopsis }, { new: true });

    if (!updatedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    console.log('Movie updated successfully:', updatedMovie);
    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Could not update movie' });
  }
});




app.delete('/movies/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully', deletedMovie });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.delete('/movies', async (req, res) => {
  try {
    const deletedMovies = await Movie.deleteMany({});
    res.status(200).json({ message: 'All movies deleted successfully', deletedMovies });
  } catch (error) {
    console.error('Error deleting movies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.listen(port,  () => 
    console.log(`Express server listening at http://localhost:${port}`)
);
