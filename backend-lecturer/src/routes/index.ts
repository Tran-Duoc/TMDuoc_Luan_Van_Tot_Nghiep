import { Router } from 'express'

import classRouter from './class.route'
import coursesRoute from './courses.route'
import fileRouter from './exercise.route'
import studentRouter from './student.route'

const routers = Router()
routers.use('/class', classRouter)
routers.use('/file', fileRouter)
routers.use('/student', studentRouter)
routers.use('/courses', coursesRoute)
export default routers
