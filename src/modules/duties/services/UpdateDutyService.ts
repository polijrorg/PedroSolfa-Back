import { inject, injectable } from 'tsyringe';

import { Duties } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IDutiesRepository from '../repositories/IDutiesRepository';

interface IRequest {
  id: string;
  description: string;
  date: Date;
  duration: number;
  users_id: string[];
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
  ) { }

  public async execute({
    id, description, date, duration, users_id
  }: IRequest): Promise<Duties> {
    const dutyAlreadyExists = await this.dutiesRepository.findById(id);

    if (!dutyAlreadyExists) throw new AppError('Duty with this id does not exist');

    const updatedDuty = this.dutiesRepository.update(
      id,
      {
        description,
        date,
        duration,
        users_id,
      },
    );

    return updatedDuty;
  }
}
