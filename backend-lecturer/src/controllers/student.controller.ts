import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import ApiError from '~/handlers/error.handler'
import coursesModel from '~/models/courses.model'
import studentModel from '~/models/student.model'
import { comparePassword, hashPassword } from '~/utils/bcrypt'
import { signToken } from '~/utils/jwt'

const studentController = {
  registerAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { student_code, password, email } = req.body
      const alreadyStudent = await studentModel.findOne({ student_code: student_code })
      if (alreadyStudent) {
        throw new ApiError(StatusCodes.CONFLICT, 'User already exists in the database')
      }

      const newPassword = await hashPassword(password)

      const student = new studentModel({
        student_code: student_code,
        email: email,
        password: newPassword
      })

      await student.save()

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Created successfully',
        //@ts-ignore
        data: student
      })
    } catch (error) {
      next(error)
    }
  },
  loginAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { student_code, password } = req.body

      const studentExisted = await studentModel.findOne({ student_code: student_code })

      if (!studentExisted) throw new ApiError(StatusCodes.NOT_FOUND, 'Student does not exist')

      const validPassword = await comparePassword(password, studentExisted.password)

      if (!validPassword) throw new ApiError(StatusCodes.BAD_REQUEST, 'wrong student code or password')

      const token = await signToken({ student_code: student_code })

      await studentModel.findOneAndUpdate(
        { student_code: student_code },
        { token: token },
        {
          new: true
        }
      )

      const student = {
        //@ts-ignore
        ...studentExisted._doc,
        token: token
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Student logged in successfully',
        data: {
          student: student
        }
      })
    } catch (error) {
      next(error)
    }
  }
}
export default studentController
