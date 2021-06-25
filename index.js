const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let persons =  [
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
  {
    name: "Arto Hellas",
    number: "123-456789",
    id: 1
  },
  {
    name: "Phone man",
    number: "74786",
    id: 5
  },
  {
    name: "test",
    number: "12312321",
    id: 2
  }
]

app.get("/", (request, response) => {
  response.send("<div>hello there </div>")
})

app.get("/info", (request, response) => {
  response.send(`
    <h1>Phonebook API </h1><br>
    Phonebook has the information of ${persons.length} people<br>
    ${new Date()}
  `)
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.filter(person => person.id === id)[0]
  if (person) 
    response.json(person)
  else 
    response.status(404).end()
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id != id)
  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  const person = request.body

  if (!person.name) {
    return response.status(400).json({
      error: "name missing"
    })
  }
  if (!person.number) {
    return response.status(400).json({
      error: "number missing"
    })
  }
  if (persons.find(i => i.name === person.name)) {
    return response.status(400).json({
      error: "name is already in the book"
    })
  }
  person.id = getMaxUnusedId()
  console.log(getMaxUnusedId());
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

function getMaxUnusedId() {
  // runs in O(n), yay!
  // not the implementation specified in the excercise, 
  // but i fail to see how this is (much) worse
  // just in case though, here is my would-have-been implementation
  //
  // return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  //

  let usedIDs = new Array(persons.length + 1).fill(false)
  for (let i in persons) {
    person = persons[i]
    usedIDs[person.id] = true
  }
  for (let i = 0; i < usedIDs.length; i++) {
    if (!usedIDs[i]) return i
  }
}
