import { inject, injectable } from 'tsyringe';

import { Switches } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import ISwitchesRepository from '../repositories/ISwitchesRepository';

interface IRequest {
  id: string;
  switch_id: string;
}

@injectable()
export default class RejectSwitchService {
  constructor(
    @inject('SwitchesRepository')
    private switchesRepository: ISwitchesRepository,
  ) { }

  public async execute({
    id, switch_id
  }: IRequest): Promise<Switches> {
    const switchEl = await this.switchesRepository.findById(switch_id);
    if (!switchEl) throw new AppError('Switch with this id does not exist');

    if(switchEl.actual_user_id !== id) throw new AppError('User is not the actual user of this switch');

    if(switchEl.analized) throw new AppError('Switch is not pending');

    const switchAccepted = this.switchesRepository.refuseSwitch(switch_id);
      
    return switchAccepted;
  }
}
