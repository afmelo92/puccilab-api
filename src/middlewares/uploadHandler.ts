import config from '@/etc/config';
import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.storage.upload.uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const uploadHandler = multer({
  storage,
  limits: {
    fileSize: config.storage.upload.fileSize,
  },
});

export default uploadHandler;
