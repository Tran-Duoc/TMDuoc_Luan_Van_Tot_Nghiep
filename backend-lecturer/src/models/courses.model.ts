import { model, Schema } from 'mongoose'

const courseModel = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: 'studentModel'
    },
    exercises: {
      type: Schema.Types.ObjectId,
      ref: 'fileModel'
    }
  },
  {
    timestamps: true
  }
)

export default model('courseModel', courseModel)
