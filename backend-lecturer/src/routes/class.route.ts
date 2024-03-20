import { Router } from 'express'

import classController from '~/controllers/class.controller'

const router = Router()

router.get('/', classController.getAllClass)
router.get('/:id', classController.getClassById)

router.post('/', classController.createClass)
router.put('/:id', classController.changeName)

export default router
