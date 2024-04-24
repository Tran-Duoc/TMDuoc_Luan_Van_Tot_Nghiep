import { model, Schema } from 'mongoose'

import classModel from './class.model'

const courseModel = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: 'studentModel',
      default: ''
    },
    classes: { type: Schema.Types.ObjectId, default: '', ref: 'classModel' }
  },
  {
    timestamps: true
  }
)

export default model('courseModel', courseModel)
