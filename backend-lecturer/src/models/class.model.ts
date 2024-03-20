import { model, Schema } from 'mongoose'

const classModel = new Schema(
  {
    class_name: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

export default model('classModel', classModel)
