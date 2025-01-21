import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import IInvitesRepository from '../repositories/IInvitesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ReadInvitesByGroupIdService {
  constructor(
    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({ user_id }: IRequest): Promise<Groups[]> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('User with this id does not exist');

    const groups = this.invitesRepository.readInvitesByUser(user_id);

    return groups;
  }
}
