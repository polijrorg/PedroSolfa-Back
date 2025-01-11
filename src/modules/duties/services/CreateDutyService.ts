import { inject, injectable } from 'tsyringe';
import { Duties } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import IGroupsRepository from '../repositories/IDutiesRepository';
import IDutiesRepository from '../repositories/IDutiesRepository';
import IInvitesRepository from '@modules/invites/repositories/IInvitesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  solicitor_id: string;
  description: string;
  date: Date;
  duration: number;
  group_id: string;
  users: { id: string; role?: string }[];
}

@injectable()
export default class CreateGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,

    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,

    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    solicitor_id, description, date, duration, group_id, users
  }: IRequest): Promise<Duties> {

    const group = await this.groupsRepository.findById(group_id);
    if (!group) throw new AppError('Group with this id does not exist');

    const isAdm = await this.invitesRepository.isAlreadyAdm(group_id, solicitor_id);
    if (!isAdm) throw new AppError('You are not an adm of this group');

    const usersIds = users.map(user => user.id);

    const registeredUsers = await this.usersRepository.registeredUsers(usersIds);
    if (!registeredUsers) throw new AppError('One or more users are not registered');

    const duty = await this.dutiesRepository.create({
      description,
      date,
      duration,
      group_id,
      users,
    });

    return duty;
  }
}
