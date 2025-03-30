import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import IGroupsRepository from '../repositories/IGroupsRepository';

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
// teste
interface IRequest {
  id: string;
  name?: string;
  image?: string | Buffer | undefined;
  description?: string;
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) { }

  public async execute({
    id, name, image, description,
  }: IRequest): Promise<Groups> {
    const groupAlreadyExists = await this.groupsRepository.findById(id);

    if (!groupAlreadyExists) throw new AppError('Group with this id does not exist');

    const s3 = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId: accessKey as string,
        secretAccessKey: secretAccessKey as string,
      },
    });

    if (image && s3) {
      const buffer = await sharp(image).resize({ height: 300, width: 300, fit: 'contain' }).png().toBuffer();

      const params = {
        Bucket: bucketName,
        Key: `${groupAlreadyExists.id}.png`,
        Body: buffer,
        ContentType: 'image/png',
      };

      try {
        await s3.send(new PutObjectCommand(params));
        // eslint-disable-next-line no-param-reassign
        image = `${groupAlreadyExists.id}.png`;
      } catch (error: any) {
        console.log(error);
        throw new AppError('Error uploading image to S3');
      }
    }

    const updatedGroup = this.groupsRepository.update(
      id,
      {
        name,
        description,
      },
    );

    return updatedGroup;
  }
}
