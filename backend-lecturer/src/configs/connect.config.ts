import mongoose from 'mongoose'

const mongoose_uri = process.env.MONGOOSE_URI as string

const ConnectDataBase = async () => {
  try {
    await mongoose.connect(mongoose_uri).then(
      () => {
        console.log(`mongoose is connected!!`)
      },
      (error) => {
        console.log(error)
      }
    )
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
}
export default ConnectDataBase
