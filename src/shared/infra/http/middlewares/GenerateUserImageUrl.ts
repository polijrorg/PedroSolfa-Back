import { Users } from '@prisma/client';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

export async function generateUserImageUrl(user: Users): Promise<string | null> {
  console.log(`1`);

  let url = null;

  if (user.image) {

    const s3 = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId: accessKey as string,
        secretAccessKey: secretAccessKey as string
      }
    });

    const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: user.image,
    }

    const command = new GetObjectCommand(getObjectParams);
    url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  }

  return url;
}

export async function generateUserImageUrlbyId(userId: string): Promise<string | null> {
  console.log(`2`);
  let url = null;

  if (userId) {

    const s3 = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId: accessKey as string,
        secretAccessKey: secretAccessKey as string
      }
    });

    const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: userId,
    }

    const command = new GetObjectCommand(getObjectParams);
    url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  }

  return url;
}
