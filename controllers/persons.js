const personRouter = require("express").Router()
const Person = require("../models/person")

personRouter.get("/", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

personRouter.get("/:id", (request, response, next) => {
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

personRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

personRouter.post("/", (request, response, next) => {
  const body = request.body

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

personRouter.put("/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(e => next(e))
})

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

module.exports = personRouter