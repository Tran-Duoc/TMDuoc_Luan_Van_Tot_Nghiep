import { Router } from 'express'

import studentController from '~/controllers/student.controller'

const route = Router()

route.post('/register-student', studentController.registerAccount)
route.post('/login-student', studentController.loginAccount)

export default route
