import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import IInvitesRepository from '../repositories/IInvitesRepository';

interface IRequest {
  group_id: string;
}

@injectable()
export default class ReadInvitesByGroupIdService {
  constructor(
    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) { }

  public async execute({ group_id }: IRequest): Promise<Groups | null> {
    const groupExists = await this.groupsRepository.findById(group_id);
    if (!groupExists) throw new AppError('Group with this id does not exist');

    const group = this.invitesRepository.findGroupById(group_id);

    return group;
  }
}
