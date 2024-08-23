import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import IInvitesRepository from '../repositories/IInvitesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  group_id: string;
}

@injectable()
export default class DeleteInviteService {
  constructor(
    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({ user_id, group_id }: IRequest): Promise<Groups> {

    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('User with this id does not exist');

    const groupExists = await this.groupsRepository.findById(group_id);
    if (!groupExists) throw new AppError('Group with this id does not exist');

    const inviteAlreadyExists = await this.invitesRepository.findByEmail(group_id, user.email);
    if (!inviteAlreadyExists) throw new AppError('This invite does not exist');

    const deletedInvite = this.invitesRepository.delete(group_id, user.email);

    return deletedInvite;
  }
}
