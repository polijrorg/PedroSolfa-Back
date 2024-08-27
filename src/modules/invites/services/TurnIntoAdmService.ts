import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IInvitesRepository from '../repositories/IInvitesRepository';

interface IRequest {
  id: string;
  user_id: string;
  group_id: string;
}

@injectable()
export default class TurnIntoAdmService {
  constructor(
    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    id, user_id, group_id,
  }: IRequest): Promise<Groups> {
    const groupExists = await this.groupsRepository.findById(group_id);
    if (!groupExists) throw new AppError('Group with this id does not exist');

    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('User with this id does not exist');

    const isAlreadyUser = await this.invitesRepository.isAlreadyUser(group_id, user.email);
    if (isAlreadyUser) throw new AppError('This user is not a member of this group');

    const isAlreadyAdm = await this.invitesRepository.isAlreadyAdm(group_id, id);
    if (!isAlreadyAdm) throw new AppError('You are not an adm of this group');

    const invite = this.invitesRepository.turnIntoAdm(
      group_id,
      user_id,
    );

    return invite;
  }
}
