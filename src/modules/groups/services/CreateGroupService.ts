import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import IGroupsRepository from '../repositories/IGroupsRepository';

interface IRequest {
  name: string;
  super_adm_id: string;
}

@injectable()
export default class CreateGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,

  ) { }

  public async execute({
    name, super_adm_id,
  }: IRequest): Promise<Groups> {

    const group = this.groupsRepository.create({
      name,
      super_adm_id,
    });

    return group;
  }
}
