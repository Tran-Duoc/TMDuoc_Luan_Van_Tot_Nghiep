import { model, Schema } from 'mongoose'

const fileModel = new Schema(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: 'classModel'
    },
    title: {
      type: String
    },
    description: {
      type: String,
      default: ''
    },
    files: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
)

export default model('fileModel', fileModel)
