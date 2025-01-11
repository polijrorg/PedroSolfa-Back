import { inject, injectable } from 'tsyringe';

import { Duties } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IDutiesRepository from '../repositories/IDutiesRepository';
import IInvitesRepository from '@modules/invites/repositories/IInvitesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  solicitor_id: string;
  id: string;
  description: string;
  date: Date;
  duration: number;
  users: { id: string; role?: string }[];
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
    
    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    solicitor_id, id, description, date, duration, users
  }: IRequest): Promise<Duties> {
    const dutyAlreadyExists = await this.dutiesRepository.findById(id);
    if (!dutyAlreadyExists) throw new AppError('Duty with this id does not exist');

    const isAdm = await this.invitesRepository.isAlreadyAdm(dutyAlreadyExists.group_id, solicitor_id);
    if (!isAdm) throw new AppError('You are not an adm of this group');

    const usersIds = users.map(user => user.id);

    const registeredUsers = await this.usersRepository.registeredUsers(usersIds);
    if (!registeredUsers) throw new AppError('One or more users are not registered');

    const updatedDuty = this.dutiesRepository.update(
      id,
      {
        description,
        date,
        duration,
        users,
      },
    );

    return updatedDuty;
  }
}
