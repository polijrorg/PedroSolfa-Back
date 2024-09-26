import { inject, injectable } from 'tsyringe';

import { Duties } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IDutiesRepository from '../repositories/IDutiesRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class ReadDutyByIdService {
  constructor(
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
  ) { }

  public async execute({ id }: IRequest): Promise<Duties | null> {
    const dutyAlreadyExists = await this.dutiesRepository.findById(id);

    if (!dutyAlreadyExists) throw new AppError('Duty with this id does not exist');

    const duty = this.dutiesRepository.findById(id);

    return duty;
  }
}
