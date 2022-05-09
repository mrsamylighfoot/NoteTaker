const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
//const api = require('./routes')

const PORT = process.env.port || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
//app.use('/api', api);

app.use(express.static('public'));

// Home Routes
app.get('/', (req, res)=>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// API Routes

// GET all notes
app.get('/api/notes', (req, res) => {
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(notes);
})

// POST - create new note
app.post('/api/notes', (req, res) => {
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  let newNote = req.body;
  newNote.id = uuidv4();
  let updatedNotes = [...notes, newNote];

  fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes))

  res.json(updatedNotes)

})

// DELETE - delete note (Bonus)

app.delete('/api/notes/:id', (req, res) => {
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  let noteDelete = req.params.id;
  let updatedNotes = notes.filter((note) => note.id != noteDelete);

  fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes))
  
  res.json(updatedNotes)
}
)


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);