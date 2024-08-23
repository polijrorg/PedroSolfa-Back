import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IInvitesRepository from '../repositories/IInvitesRepository';

interface IRequest {
  id: string;
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
    id, group_id, email,
  }: IRequest): Promise<Groups> {
    const groupExists = await this.groupsRepository.findById(group_id);
    if (!groupExists) throw new AppError('Group with this id does not exist');

    const inviteAlreadyExists = await this.invitesRepository.findByEmail(group_id, email);
    if (inviteAlreadyExists) throw new AppError('An invite was already sent to this email');

    const isAlreadyUser = await this.invitesRepository.isAlreadyUser(group_id, email);
    if (isAlreadyUser) throw new AppError('This user is already a member of this group');

    const user = await this.usersRepository.findByEmailWithRelations(email);
    if(user){
      const isAlreadyAdm = await this.invitesRepository.isAlreadyAdm(group_id, user.id);
      if (isAlreadyAdm) throw new AppError('This user is already an adm of this group');
    }

    const isAdm = await this.invitesRepository.isAlreadyAdm(group_id, id);
    if (!isAdm) throw new AppError('You are not an adm of this group');

    const invite = this.invitesRepository.create({
      group_id,
      email,
    });

    return invite;
  }
}
