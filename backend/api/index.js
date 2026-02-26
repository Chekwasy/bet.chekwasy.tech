import express from 'express'

const app = express()

app.get('/api', (_req, res) => {
  res.send('Hello Express!')
})

app.get('/apii', (_req, res) => {
  res.send('jjklk')
})

app.get('/api/posts/:postId/comments/:commentId', (_req, res) => {
  res.json({ postId: _req.params.postId, commentId: _req.params.commentId })
})

export default app