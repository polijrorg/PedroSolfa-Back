import { inject, injectable } from 'tsyringe';

import { Switches } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import ISwitchesRepository from '../repositories/ISwitchesRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';

interface IRequest {
  id: string;
  duty_id: string;
}

@injectable()
export default class ReadSwitchesByDutyIdService {
  constructor(
    @inject('SwitchesRepository')
    private switchesRepository: ISwitchesRepository,
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
  ) { }

  public async execute({ id, duty_id }: IRequest): Promise<Switches[] | null> {
    const dutyExists = await this.dutiesRepository.findById(duty_id);
    if (!dutyExists) throw new AppError('Duty with this id does not exist');

    const switchEl = await this.switchesRepository.findAll(duty_id);

    return switchEl;
  }
}
