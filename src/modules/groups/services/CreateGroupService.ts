import { inject, injectable } from 'tsyringe';
import { Groups } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IGroupsRepository from '../repositories/IGroupsRepository';
import ISubscriptionsRepository from '@modules/subscriptions/repositories/ISubscriptionsRepository';
import IInvitesRepository from '@modules/invites/repositories/IInvitesRepository';

interface IRequest {
  name: string;
  description: string;
  super_adm_id: string;
  subscription_id: string;
}

@injectable()
export default class CreateGroupService {
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
    name, description, super_adm_id, subscription_id
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

    const updatedGroup = await this.invitesRepository.defaultAdm(group.id, super_adm_id);

    const subscription = await this.subscriptionsRepository.vinculateGroup(subscription_id, group.id);

    return updatedGroup;
  }
}
