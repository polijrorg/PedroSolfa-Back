import { inject, injectable } from 'tsyringe';

import { Duties } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IDutiesRepository from '../repositories/IDutiesRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class DeleteUserService {
  constructor(
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
  ) { }

  public async execute({ id }: IRequest): Promise<Duties> {
    const dutyAlreadyExists = await this.dutiesRepository.findById(id);

    if (!dutyAlreadyExists) throw new AppError('Duty with this id does not exist');

    const deletedDuty = this.dutiesRepository.delete(id);

    return deletedDuty;
  }
}
