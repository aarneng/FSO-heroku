const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")
// const { get } = require('mongoose')

const app = express()

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"), "-",
    tokens["response-time"](req, res), "ms",
    JSON.stringify(req.body)
  ].join(" ")
}))
app.use(cors())
app.use(express.json())
app.use(express.static("build"))


app.get("/", (request, response) => {
  response.send("<div>hello there </div>")
})

app.get("/info", (request, response) => {
  Person.find({})
    .then(persons => {
      response.send(`
        <h1>Phonebook API </h1><br>
        Phonebook has the information of ${persons.length} people<br>
        ${new Date()}
      `)
    })
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person)
        response.json(person)
      else
        response.status(404).end()
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  // if (!body.name) {
  //   return response.status(400).json({
  //     error: "name missing"
  //   })
  // }
  // if (!body.number) {
  //   return response.status(400).json({
  //     error: "number missing"
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  })

  person.save()
    .then(person =>
      response.json(person)
    )
    .catch(e => next(e))
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(e => next(e))
})

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


// function getMaxUnusedId() {
//   // runs in O(n), yay!
//   // not the implementation specified in the excercise,
//   // but i fail to see how this is (much) worse
//   // just in case though, here is my would-have-been implementation
//   //
//   // return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
//   //

//   let usedIDs = new Array(persons.length + 1).fill(false)
//   for (let i in persons) {
//     person = persons[i]
//     usedIDs[person.id] = true
//   }
//   for (let i = 0; i < usedIDs.length; i++) {
//     if (!usedIDs[i]) return i
//   }
// }

function errorHandler(error, request, response, next) {
  console.error(error.name, error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" })
  }
  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message })
  }


  next(error)
}

app.use(errorHandler)  // has to be the last loaded middleware and after the request that fails