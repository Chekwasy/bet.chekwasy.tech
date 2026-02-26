import express from 'express'
import mapRoute from '../routes/routes'
import GamesController from '../controllers/GamesController';

const app = express()

  app.get('/api/games/:date', GamesController.getGames);
mapRoute(app);

app.get('/api', (_req, res) => {
  res.json('Hello Express!')
})


export default app