const express = require("express")
// const morgan = require("morgan")
const cors = require("cors")
// eslint-disable-next-line no-unused-vars
const Person = require("./models/person")
const personRouter = require("./controllers/persons")
const config = require("./utils/config")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const mongoose = require("mongoose")


const app = express()

logger.info("connecting to", config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then( () => console.log("connected to mongoDB"))
  .catch((error) => console.log("an error occured while trying to connect to mongoDB: \n", error.message))

app.use(cors())
app.use(express.json())
app.use(express.static("build"))
app.use(middleware.requestLogger)

app.use("/api/persons", personRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app