import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '../repositories/IGroupsRepository';

interface IRequest {
  id: string;
  name: string;
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) { }

  public async execute({
    id, name,
  }: IRequest): Promise<Groups> {
    const groupAlreadyExists = await this.groupsRepository.findById(id);

    if (!groupAlreadyExists) throw new AppError('Group with this id does not exist');

    const updatedGroup = this.groupsRepository.update(
      id,
      {
        name,
      },
    );

    return updatedGroup;
  }
}
