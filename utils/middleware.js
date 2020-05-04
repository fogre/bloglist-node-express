const logger = require('./logger')

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'invalid token'
    })
  }
  next(error)
}

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  if (req.path === '/api/blogs')
    logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  errorHandler,
  requestLogger,
  unknownEndpoint
}