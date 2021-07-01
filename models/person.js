/* eslint-disable no-undef */
// mongodb+srv://aarnenm:<password>@cluster0.qm2s6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
require("dotenv").config()
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const url = process.env.MONGODB_URI
const PORT = process.env.PORT
// console.log(process.env);
console.log("connecting to", url, "on port:", PORT)

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then( () => console.log("connected to mongoDB"))
  .catch((error) => console.log("an error occured", error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true
  }, // yes i know it shouldn't be a string but examples included spetial chars so what can you do
  id: Number
})

personSchema.plugin(uniqueValidator)

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)
