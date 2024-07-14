import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '../repositories/IGroupsRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class DeleteUserService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) { }

  public async execute({ id }: IRequest): Promise<Groups> {
    const groupAlreadyExists = await this.groupsRepository.findById(id);

    if (!groupAlreadyExists) throw new AppError('Group with this id does not exist');

    const deletedGroup = this.groupsRepository.delete(id);

    return deletedGroup;
  }
}
