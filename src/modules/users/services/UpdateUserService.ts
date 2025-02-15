import { inject, injectable } from 'tsyringe';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

interface IRequest {
    id: string;
    name?: string;
    nickname?: string;
    email?: string;
    profession?: string;
    specialization?: string;
    phone?: string;
    password?: string;
    city?: string;
    state?: string;
    image?: string | Buffer | null;
  }

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({
    id, name, nickname, email, profession, specialization, phone, password, city, state, image
  }: IRequest): Promise<Users> {
    const userAlreadyExists = await this.usersRepository.findById(id);

    if (!userAlreadyExists) throw new AppError('User with this id does not exist');

    if (email) {
      const userWithUpdatedEmail = await this.usersRepository.findByEmailWithRelations(email.toLowerCase());
        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== id) {
          throw new AppError('Another user with same email already exists');
        }
    }

    if(password){
      const hashedPassword = await this.hashProvider.generateHash(password);
      userAlreadyExists.password = hashedPassword;
    }

    if(image){
      const s3 = new S3Client({
        region: bucketRegion,
        credentials: {
          accessKeyId: accessKey as string,
          secretAccessKey: secretAccessKey as string
        }
      });

      if (s3) {
      
        const buffer = await sharp(image).resize({height: 300, width: 300, fit: 'contain'}).png().toBuffer();
        image = userAlreadyExists.image;
        const params = {
          Bucket: bucketName,
          Key: `${id}.png`,
          Body: buffer,
          ContentType: 'image/png',
        };
  
        try {
          await s3.send(new PutObjectCommand(params));
          image = `${id}.png`;
        } catch (error: any) {
          throw new AppError('Error uploading image to S3');
        }
      }
    }

    const updatedUser = this.usersRepository.update(
      id,
      {
        name: name ? name : userAlreadyExists.name,
        nickname: nickname ? nickname : userAlreadyExists.nickname,
        email: email ? email.toLowerCase() : userAlreadyExists.email,
        profession: profession ? profession : userAlreadyExists.profession,
        specialization: specialization ? specialization : userAlreadyExists.specialization,
        phone: phone ? phone : userAlreadyExists.phone,
        password: userAlreadyExists.password,
        city: city ? city : userAlreadyExists.city,
        state: state ? state : userAlreadyExists.state,
        image: typeof image === 'string' ? image : userAlreadyExists.image,
      },
    );

    return updatedUser;
  }
}
