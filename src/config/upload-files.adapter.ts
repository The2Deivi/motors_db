import multer from 'multer';

const storage = multer.memoryStorage()

const upload = multer({ storage })

export const uploadSingle = (filename: string) => upload.single(filename) // la información viene por req.file

export const uploadArray = (filename: string, maxFileNumber: number) => upload.array(filename, maxFileNumber) 