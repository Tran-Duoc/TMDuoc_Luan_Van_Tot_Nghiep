import { Router } from 'express'

import coursesController from '~/controllers/courses.controller'

const route = Router()

route.get('/', coursesController.getCourseOfStudent)
route.post('/', coursesController.addStudentsToCourse)
route.get('/verify-course', coursesController.verifyCourse)
export default route
