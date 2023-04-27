import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import config from '@/etc/config';

type SendFileProps = {
  filePath: string;
  data: Buffer;
  contentType: string;
};

type RemoveFileProps = {
  filePath: string;
};

class S3StorageProvider {
  private client;

  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: config.storage.accessKeyId,
        secretAccessKey: config.storage.secretAccessKey,
      },
      region: config.storage.region,
    });
  }

  public async store({ filePath, data, contentType }: SendFileProps) {
    const command = new PutObjectCommand({
      ACL: 'public-read',
      Bucket: config.storage.bucket,
      ContentType: contentType,
      Key: filePath,
      Body: data,
    });

    await this.client.send(command);
  }

  public async remove({ filePath }: RemoveFileProps) {
    const command = new DeleteObjectCommand({
      Bucket: config.storage.bucket,
      Key: filePath,
    });

    await this.client.send(command);
  }
}

export default new S3StorageProvider();
