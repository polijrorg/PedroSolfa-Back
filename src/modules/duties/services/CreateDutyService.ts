import { inject, injectable } from 'tsyringe';
import { Duties } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import IGroupsRepository from '../repositories/IDutiesRepository';
import IDutiesRepository from '../repositories/IDutiesRepository';

interface IRequest {
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
  ) { }

  public async execute({
    description, date, duration, group_id, users
  }: IRequest): Promise<Duties> {

    const group = await this.groupsRepository.findById(group_id);
    if (!group) throw new AppError('Group with this id does not exist');

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
