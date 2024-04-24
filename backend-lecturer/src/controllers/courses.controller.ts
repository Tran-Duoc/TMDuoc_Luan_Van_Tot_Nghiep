import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { mailOptions, transporter } from '~/configs/mailer.config'
import ApiError from '~/handlers/error.handler'
import classModel from '~/models/class.model'
import coursesModel from '~/models/courses.model'
import studentModel from '~/models/student.model'

const coursesController = {
  addStudentsToCourse: async (req: Request, res: Response, next: NextFunction) => {
    const { email, class_id } = req.body

    const student = await studentModel.findOne({ email: email })
    console.log(student)
    if (!student) throw new ApiError(StatusCodes.NOT_FOUND, 'Student not found')

    const option = mailOptions({
      to: email,
      html: `
        <html>
          <head>
            <style>
              /* Add your CSS styles here */
              body {
                font-family: Arial, sans-serif;
              }
              .container {
                width: 80%;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #333;
              }
              p {
                color: #666;
              }
              a {
                background-color: blue;
                border-radius: 12px;
                color: #fff !important;
                padding: 5px 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Hello, User!</h1>
              <p>Please click to button to verify account</p>
              <a href="http://localhost:8080/api/v1/courses/verify-course?student_id=${student._id}&class_id=${class_id}" >Click Here!</a>
            </div>
          </body>
        </html>
      `
    })

    await transporter.sendMail(option)

    return res.status(200).json({
      success: true
    })
  },
  getCourseOfStudent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { student_id } = req.query
      const courseOfStudent = await coursesModel.find({ student_id: student_id }).populate('classes')

      const classes: any = []
      courseOfStudent.forEach((course) => {
        classes.push(course.classes)
      })

      return res.status(StatusCodes.OK).json({
        success: true,
        data: {
          student_id: student_id,
          classes: classes
        }
      })
    } catch (error) {
      next(error)
    }
  },
  verifyCourse: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { student_id, class_id } = req.query
      console.log(student_id)
      const exitedStudent = await studentModel.findById(student_id)
      if (!exitedStudent) throw new ApiError(StatusCodes.NOT_FOUND, "Can't find student")

      const course = new coursesModel({
        classes: class_id,
        student_id: student_id
      })
      await course.save()
      return res.send('Add student to courses successfully')
    } catch (error) {
      next(error)
    }
  }
}
export default coursesController
