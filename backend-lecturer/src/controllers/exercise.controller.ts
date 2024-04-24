import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import ApiError from '~/handlers/error.handler'
import fileModel from '~/models/exercise.model'

const fileController = {
  getExercise: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const exitFiles: any = await fileModel.findOne({ class_id: id }).sort({ createdAt: -1 })

      console.log(exitFiles)
      if (!exitFiles) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'No exit files')
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Get exercise successfully',
        files: exitFiles.files,
        title: exitFiles.title,
        description: exitFiles.description,
        _id: exitFiles._id,
        class_id: exitFiles.class_id,
        createdAt: exitFiles.createdAt
      })
    } catch (error) {
      next(error)
    }
  },
  getFilesByClassId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      console.table(id)
      const exitFileById = await fileModel.find({ class_id: id }).sort({ createdAt: -1 })
      if (!exitFileById) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'File not found')
      }
      console.log(exitFileById)

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Get file by id successfully',
        exercises: exitFileById
      })
    } catch (error) {
      next(error)
    }
  },
  createExercise: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as []
      const filesPath: string[] = []
      const { class_id, title, description } = req.body

      // const findFileById: any = await fileModel.findOne({ class_id: class_id })

      if (!files) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'No files')
      }
      files.forEach((file: Express.Multer.File) => {
        filesPath.unshift(file.filename)
      })

      const newFiles = new fileModel({
        files: filesPath,
        class_id: class_id,
        title: title,
        description: description
      })

      await newFiles.save()
      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Created files successfully',
        response: newFiles
      })
    } catch (error) {
      next(error)
    }
  },
  getFilesById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      console.table(id)
      const exitFileById = await fileModel.findById(id).sort({ createdAt: -1 })
      if (!exitFileById) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'File not found')
      }
      console.log(exitFileById)

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Get file by id successfully',
        exercises: exitFileById
      })
    } catch (error) {
      next(error)
    }
  }
}

export default fileController
