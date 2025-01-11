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
export default class AcceptSwitchService {
  constructor(
    @inject('SwitchesRepository')
    private switchesRepository: ISwitchesRepository,

    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
  ) { }

  public async execute({
    id, switch_id
  }: IRequest): Promise<Switches> {
    const switchEl = await this.switchesRepository.findById(switch_id);
    if (!switchEl) throw new AppError('Switch with this id does not exist');

    if(switchEl.actual_user_id !== id) throw new AppError('User is not the actual user of this switch');

    if(switchEl.analized) throw new AppError('Switch is not pending');

    const actual_user_duty = await this.dutiesRepository.findOmittedDuty(switchEl.actual_user_duty_id);
    if (!actual_user_duty) throw new AppError('Actual user duty does not exist');

    const new_user_duty = await this.dutiesRepository.findOmittedDuty(switchEl.new_user_duty_id);
    if (!new_user_duty) throw new AppError('New user duty does not exist');

    const actual_user_duty_index = actual_user_duty.users.findIndex(userOnDuty => userOnDuty.user.id === switchEl.actual_user_id);
    if (actual_user_duty_index === -1) throw new AppError('Actual user is not part of the actual user duty');

    const new_user_duty_index = new_user_duty.users.findIndex(userOnDuty => userOnDuty.user.id === switchEl.new_user_id);
    if (new_user_duty_index === -1) throw new AppError('New user is not part of the new user duty');

    const updatedDuties = await this.dutiesRepository.switchUsersOnDuty(switchEl.actual_user_id, switchEl.actual_user_duty_id, switchEl.new_user_id, switchEl.new_user_duty_id);
    if (!updatedDuties) throw new AppError('Error on switching users on duties process');

    const switchAccepted = this.switchesRepository.acceptSwitch(switch_id);
      
    return switchAccepted;
  }
}
