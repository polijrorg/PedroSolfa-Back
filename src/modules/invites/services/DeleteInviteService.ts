import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import IInvitesRepository from '../repositories/IInvitesRepository';

interface IRequest {
  id: string;
  group_id: string;
  email: string;
}

@injectable()
export default class DeleteInviteService {
  constructor(
    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) { }

  public async execute({ id, group_id, email }: IRequest): Promise<Groups> {
    const groupExists = await this.groupsRepository.findById(group_id);
    if (!groupExists) throw new AppError('Group with this id does not exist');

    const inviteAlreadyExists = await this.invitesRepository.findByEmail(group_id, email);
    if (!inviteAlreadyExists) throw new AppError('This invite does not exist');

    const isAlreadyAdm = await this.invitesRepository.isAlreadyAdm(group_id, id);
    if (!isAlreadyAdm) throw new AppError('You are not an adm of this group');

    const deletedInvite = this.invitesRepository.delete(group_id, email);

    return deletedInvite;
  }
}
