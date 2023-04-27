export default {
  app: {
    web: {
      url: process.env.APP_FRONTEND_URL || 'http://localhost:3000',
    },
  },
  hash: {
    salt: 8,
  },
  jwt: {
    secret: 'default',
    expiresIn: '1d',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
  email: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
  storage: {
    upload: {
      fileSize: 10485760,
      uploadDir: `${process.cwd()}/src/tmp/uploads`,
    },
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET,
  },
};
