import jwt from 'jsonwebtoken'

import { IStudent } from '~/models/student.model'

export const signToken = async (student: Pick<IStudent, 'student_code'>) => {
  return await jwt.sign(student, process.env.TOKEN_SECRET as string, {
    expiresIn: '100d'
  })
}

export const verifyToken = async (token: string) => {
  return await jwt.verify(token, process.env.TOKEN_SECRET as string)
}
