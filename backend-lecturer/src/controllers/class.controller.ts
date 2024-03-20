import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import ApiError from '~/handlers/error.handler'
import classModel from '~/models/class.model'

const classController = {
  getAllClass: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const exitClass = await classModel.find().sort({ createdAt: -1 })
      if (!exitClass) {
        throw new ApiError(404, 'Invalid class ')
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'get classes successfully',
        classes: exitClass
      })
    } catch (error) {
      next(error)
    }
  },
  getClassById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const exitClassById = await classModel.findById({ _id: id })
      if (!exitClassById) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Class does not exist')
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Get class successfully',
        class: exitClassById
      })
    } catch (error) {
      next(error)
    }
  },

  createClass: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      const newClassName = new classModel({
        class_name: req.body.class_name
      })

      await newClassName.save()
      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Class created successfully',
        class: newClassName
      })
    } catch (error) {
      next(error)
    }
  },

  changeName: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { class_name } = req.body

      const exitClassById = classModel.findById(id)
      if (!exitClassById) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Class dose not exist')
      }
      await classModel.findByIdAndUpdate(id, {
        class_name: class_name
      })
      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Change class name successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}

export default classController
