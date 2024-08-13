import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IInvitesRepository from '../repositories/IInvitesRepository';

interface IRequest {
  group_id: string;
  email: string;
}

@injectable()
export default class CreateInviteService {
  constructor(
    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    group_id, email,
  }: IRequest): Promise<Groups> {
    const groupExists = await this.groupsRepository.findById(group_id);
    if (!groupExists) throw new AppError('Group with this id does not exist');

    const inviteAlreadyExists = await this.invitesRepository.findByEmail(group_id, email);
    if (inviteAlreadyExists) throw new AppError('An invite was already sent to this email');

    const invite = this.invitesRepository.create({
      group_id,
      email,
    });

    return invite;
  }
}
