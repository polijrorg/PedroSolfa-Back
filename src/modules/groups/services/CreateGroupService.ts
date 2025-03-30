import { inject, injectable } from 'tsyringe';
import { Groups } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ISubscriptionsRepository from '@modules/subscriptions/repositories/ISubscriptionsRepository';
import IInvitesRepository from '@modules/invites/repositories/IInvitesRepository';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import IGroupsRepository from '../repositories/IGroupsRepository';

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

interface IRequest {
  name: string;
  description: string;
  super_adm_id: string;
  subscription_id: string;
  image: string | Buffer | undefined;
}

@injectable()
class CreateGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionsRepository,

    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,
  ) { }

  public async execute({
    name, description, super_adm_id, subscription_id, image,
  }: IRequest): Promise<Groups> {
    const userAlreadyExists = await this.usersRepository.findById(super_adm_id);
    if (!userAlreadyExists) throw new AppError('User with this super_adm_id does not exist');

    const subscriptionAlreadyExists = await this.subscriptionsRepository.findById(subscription_id);
    if (!subscriptionAlreadyExists) throw new AppError('Subscription with this id does not exist');

    const groupAlreadyExists = await this.subscriptionsRepository.groupIsVinculated(subscription_id);
    if (groupAlreadyExists) throw new AppError('This subscription is already vinculated to a group');

    const group = await this.groupsRepository.create({
      name,
      description,
      super_adm_id,
      subscription_id,
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
        Key: `${group.id}.png`,
        Body: buffer,
        ContentType: 'image/png',
      };

      try {
        await s3.send(new PutObjectCommand(params));
        // eslint-disable-next-line no-param-reassign
        image = `${group.id}.png`;
      } catch (error: any) {
        console.log(error);
        throw new AppError('Error uploading image to S3');
      }
    }

    const updatedGroup = await this.invitesRepository.defaultAdm(group.id, super_adm_id);

    const updateGroupImage = await this.groupsRepository.updateImage(group.id, image as string);

    const subscription = await this.subscriptionsRepository.vinculateGroup(subscription_id, group.id);

    return updateGroupImage;
  }
}

export default CreateGroupService;
