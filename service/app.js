'use strict'
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const port = 3000

mongoose.connection()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  console.dir(123)
  res.send({ aaa: 123 })
})

app.use(function (req, res, next) {
  res.sendStatus(404)
})
// Export your express server so you can import it in the lambda function.
module.exports = app

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
