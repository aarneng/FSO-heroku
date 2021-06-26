// mongodb+srv://aarnenm:<password>@cluster0.qm2s6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> name number')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://aarnenm:${password}@cluster0.qm2s6.mongodb.net/FSO?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false, 
  useCreateIndex: true 
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String, // yes i know it shouldn't be a string but examples included spetial chars so what can you do
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
  })

  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}



