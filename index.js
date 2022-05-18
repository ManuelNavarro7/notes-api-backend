// const http= require('http')
const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./middlewre/loggerMiddleware')

app.use(cors())
app.use(express.json())
app.use(logger)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server runin on port ${PORT}`))

let notes = [
  {
    id: 1,
    body: 'Me tengo que levantar a las 8:30mpara trabajar',
    date: '2019-05-30T17:30:31.0982',
    important: true
  },
  {
    id: 2,
    body: 'Comprar avena',
    date: '2019-05-30T18:30:31.0982',
    important: false
  },
  {
    id: 3,
    body: 'Dormir temprano',
    date: '2019-05-30T19:30:31.0982',
    important: true
  }
]

// const app= http.createServer((req,res)=>{
//   res.writeHead(200,{'Content-Type':'application/json'})
//   res.end(JSON.stringify (notes))
// })

app.get('/', (req, res) => {
  res.send('<h1/>Hello World</h1>')
})
app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.body) {
    return res.status(400).json({
      error: 'note.body is missing'
    })
  }
  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    body: note.body,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]
  // o notes=notes.concat(newNote)
  res.status(201).json(note)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find((note) => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter((note) => note.id !== id)
  res.send({ message: 'Note has been eliminated' })
  res.status(204).end()
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.use((req, res) => {
  console.log(req.path)
  res.status(404).json({
    error: 'Not found'
  })
})
