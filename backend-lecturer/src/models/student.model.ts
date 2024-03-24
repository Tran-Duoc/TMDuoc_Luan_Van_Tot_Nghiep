import { model, Schema } from 'mongoose'

const studentModel = new Schema(
  {
    student_code: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    token: {
      type: String,
      default: ''
    },
    class_id: {
      type: Schema.Types.ObjectId,
      ref: 'classModel'
    }
  },
  {
    timestamps: true
  }
)

export default model('studentModel', studentModel)
