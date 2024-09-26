import { inject, injectable } from 'tsyringe';

import { Duties } from '@prisma/client';

import IDutiesRepository from '../repositories/IDutiesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

@injectable()
export default class ReadAllDutiesService {
  constructor(
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute(id: string): Promise<Duties[] | null> {
    const user = await this.usersRepository.findById(id);
    if(!user) throw new AppError('User with this id does not exist');

    const duties = this.dutiesRepository.findUserDuties(id);

    return duties;
  }
}
