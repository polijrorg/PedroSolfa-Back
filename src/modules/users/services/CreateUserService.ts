import { inject, injectable } from 'tsyringe';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IInvitesRepository from '@modules/invites/repositories/IInvitesRepository';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import IUsersRepository from '../repositories/IUsersRepository';

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

interface IRequest {
  name: string;
  nickname: string;
  email: string;
  cpf: string;
  profession: string;
  specialization: string;
  phone: string;
  password: string;
  city: string;
  state: string;
  image?: string | Buffer | null;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    // @inject('MailProvider')
    // private mailProvider: IMailProvider,
  ) { }

  public async execute({
    name, nickname, email, cpf, profession, specialization, phone, password, city, state, image,
  }: IRequest): Promise<Users> {
    const userAlreadyExists = await this.usersRepository.findByEmailPhoneOrCpf(email, phone, cpf);

    if (userAlreadyExists) throw new AppError('User with same name, phone or cpf already exists');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      nickname,
      email: email.toLowerCase(),
      cpf,
      profession,
      specialization,
      phone,
      password: hashedPassword,
      city,
      state,
    });

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
        Key: `${user.id}.png`,
        Body: buffer,
        ContentType: 'image/png',
      };

      try {
        await s3.send(new PutObjectCommand(params));
        image = `${user.id}.png`;
      } catch (error: any) {
        console.log(error);
        throw new AppError('Error uploading image to S3');
      }
    }

    console.log('image', image);

    const updatedUser = this.usersRepository.update(
      user.id,
      {
        name,
        nickname,
        email: email.toLowerCase(),
        profession,
        specialization,
        phone,
        password: hashedPassword,
        city,
        state,
        image: typeof image === 'string' ? image : null,
      },
    );

    await this.invitesRepository.updateInvites(email);

    return updatedUser;
  }
}
