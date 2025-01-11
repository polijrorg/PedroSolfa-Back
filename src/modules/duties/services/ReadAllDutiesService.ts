import { inject, injectable } from 'tsyringe';

import { Duties } from '@prisma/client';

import IDutiesRepository from '../repositories/IDutiesRepository';
import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import AppError from '@shared/errors/AppError';

@injectable()
export default class ReadAllDutiesService {
  constructor(
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,

    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) { }

  public async execute(group_id: string): Promise<Duties[] | null> {
    const group = await this.groupsRepository.findById(group_id);
    
    if (!group) throw new AppError('Group with this id does not exist');
    const duties = this.dutiesRepository.findAll(group_id);

    return duties;
  }
}
