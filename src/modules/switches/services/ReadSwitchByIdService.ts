import { inject, injectable } from 'tsyringe';

import { Switches } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import ISwitchesRepository from '../repositories/ISwitchesRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';

interface IRequest {
  id: string;
  switch_id: string;
}

@injectable()
export default class ReadSwitchesByIdService {
  constructor(
    @inject('SwitchesRepository')
    private switchesRepository: ISwitchesRepository,
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
  ) { }

  public async execute({ id, switch_id }: IRequest): Promise<Switches | null> {

    // verificar quais usuários podem acessar a troca
    
    const dutyExists = await this.switchesRepository.findById(switch_id);
    if (!dutyExists) throw new AppError('Switch with this id does not exist');

    const switchEl = await this.switchesRepository.findById(switch_id);

    return switchEl;
  }
}
