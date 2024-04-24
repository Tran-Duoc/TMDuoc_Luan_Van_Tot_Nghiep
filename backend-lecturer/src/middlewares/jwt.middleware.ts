import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

import ApiError from '~/handlers/error.handler'
import { verifyToken } from '~/utils/jwt'

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization
    if (!token) throw new ApiError(StatusCodes.NON_AUTHORITATIVE_INFORMATION, "You are't authentication")

    const decoded = verifyToken(token)
    if (!decoded) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized')

    //@ts-ignore
    req.user = decoded
    next()
  } catch (error) {
    next(error)
  }
}
