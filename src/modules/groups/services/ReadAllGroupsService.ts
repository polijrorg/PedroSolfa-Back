import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import IGroupsRepository from '../repositories/IGroupsRepository';

@injectable()
export default class ReadAllGroupsService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) { }

  public async execute(): Promise<Groups[] | null> {
    const groups = this.groupsRepository.findAll();

    return groups;
  }
}
