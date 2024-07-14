import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '../repositories/IGroupsRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class ReadGroupByIdService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) { }

  public async execute({ id }: IRequest): Promise<Groups | null> {

    const groupAlreadyExists = await this.groupsRepository.findById(id);

    if (!groupAlreadyExists) throw new AppError('Group with this id does not exist');

    const group = this.groupsRepository.findById(id);

    return group;
  }
}
