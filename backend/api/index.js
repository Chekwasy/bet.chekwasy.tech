import express from 'express'
import mapRoute from '../routes/routes'

const app = express()

mapRoute(app);

app.get('/api', (_req, res) => {
  res.json('Hello Express!')
})


export default app