const logger = require("./logger")

function requestLogger(request, response, next) {
  logger.info("Method:", request.method)
  logger.info("Path:  ", request.path)
  logger.info("Body:  ", request.body)
  logger.info("-".repeat(20))
  next()
}

function unknownEndpoint(request, response) {
  response.status(404).send({
    error: "unknown endpoint"
  })
}


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

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}