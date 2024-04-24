import { model, Schema } from 'mongoose'

const classModel = new Schema(
  {
    class_name: {
      type: String
    },
    class_id: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

export default model('classModel', classModel)
