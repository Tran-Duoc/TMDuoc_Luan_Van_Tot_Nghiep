import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import path from 'path'

import ConnectDataBase from '~/configs/connect.config'
import { errorHandlingMiddleware } from '~/middlewares/error.middleware'

import routers from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use('/api/v1', routers)
app.use(errorHandlingMiddleware)

const port = process.env.PORT || 8181

ConnectDataBase()
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`)
})
