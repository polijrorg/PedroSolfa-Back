import { inject, injectable } from 'tsyringe';
import { Groups } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
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

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    name, super_adm_id,
  }: IRequest): Promise<Groups> {
    const userAlreadyExists = await this.usersRepository.findById(super_adm_id);
    if (!userAlreadyExists) throw new AppError('User with this super_adm_id does not exist');

    const group = this.groupsRepository.create({
      name,
      super_adm_id,
    });

    return group;
  }
}
