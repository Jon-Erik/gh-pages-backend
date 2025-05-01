require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()

const formsRouter = require('./routes/forms-router')

const { SERVER_PORT, BACKEND_API_KEY } = process.env

app.use(cors())
app.use(express.json())

const validatePublicReq = function (req, res, next) {
  console.log('Request URL:', req.url);
  const { apiKey } = req.body;
  if (apiKey && BACKEND_API_KEY == apiKey) {
    next(); 
  } else {
    const msg = 'Invalid API Key. Will not process request.';
    console.log(msg)
    res.status(403).send({ msg, success: false })
  }
};
app.use(validatePublicReq)

app.use('/forms', formsRouter)

app.listen(SERVER_PORT, () => {
  console.log(`Server listening at ${SERVER_PORT}`)
})