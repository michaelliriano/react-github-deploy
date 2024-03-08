import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
import router from './router'
import { PORT, HOST } from './constant'

dotenv.config({
  path: path.join(__dirname, '..', '.env'),
})

/**
 * Express application instance.
 * @type {express.Application}
 */
const app = express()

app.use(express.json())

router(app)

/**
 * Starts the server and listens on the specified port.
 */
app.listen(PORT, () => {
  console.log(`Application running on ${HOST + ':' + PORT}`)
})
