import { Router } from 'express'

import upload from '~/configs/multer.config'
import fileController from '~/controllers/exercise.controller'

const router = Router()

router.get('/exercise/:id', fileController.getExercise)
router.get('/:id', fileController.getFilesByClassId)

router.post('/', upload.array('files', 6), fileController.createExercise)

router.delete('/:id')

export default router
