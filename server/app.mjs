import path from 'path'
import express from 'express'
import apiRoutes from './api-routes/index.mjs'
import env from 'dotenv'
import "./helpers/db.mjs"
import cors from 'cors'
env.config()

const app = express()
const port = process.env.PORT || 8080

app.use(express.static('build'))
app.use(express.json())


// app.use(cors({
//   origin: "http://localhost:3000"
// }))

app.use('/api', apiRoutes)

app.use('*', (req, res) => {
  const indexHtml = path.resolve('build', 'index.html')
  res.sendFile(indexHtml)
})

app.use((req, res) => {
  res.status(404).json({ msg: 'page not found' })
})

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  res.status(500).json({ msg: 'invalid error occurred!' })
})

app.listen(port, () => {
  console.log(`Server start: http://localhost:${port}`)
})