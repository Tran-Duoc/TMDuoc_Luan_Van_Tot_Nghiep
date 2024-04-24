import { Document, model, Schema } from 'mongoose'

// Define an interface representing the document structure
export interface IStudent extends Document {
  student_code: string
  password: string
  email: string
  token?: string // Optional field
}

const studentModel = new Schema<IStudent>(
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
    }
  },
  {
    timestamps: true
  }
)

export default model('studentModel', studentModel)
