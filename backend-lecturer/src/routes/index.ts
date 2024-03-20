import { Router } from 'express'

import classRouter from './class.route'
import fileRouter from './exercise.route'

const routers = Router()
routers.use('/class', classRouter)
routers.use('/file', fileRouter)

export default routers
