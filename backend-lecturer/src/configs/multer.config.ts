import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './src/../public')
  },
  //? "file.originalname" tên image sao khi được lưu về máy
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    callback(null, uniqueSuffix + '_' + file.originalname)
  }
})
const upload = multer({ storage: storage })

export default upload
