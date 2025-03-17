import { inject, injectable } from 'tsyringe';

import { Switches } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ISwitchesRepository from '@modules/switches/repositories/ISwitchesRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';

interface IRequest {
  user_on_duty_id: string;
  user_on_another_duty_id: string;
}

@injectable()
export default class CreateSwitchService {
  constructor(
    @inject('SwitchesRepository')
    private switchesRepository: ISwitchesRepository,
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    user_on_duty_id, user_on_another_duty_id,
  }: IRequest): Promise<Switches> {

    const new_duty = await this.dutiesRepository.findDutyByUserOnDutyId(user_on_duty_id);
    if (!new_duty) throw new AppError('Duty with this user on duty id does not exist');
    const new_user_id = new_duty.user_id;
    const new_user_duty_id = new_duty.duty_id;

    const actual_duty = await this.dutiesRepository.findDutyByUserOnDutyId(user_on_another_duty_id);
    if (!actual_duty) throw new AppError('Duty with this user on another duty id does not exist');
    const actual_user_id = actual_duty.user_id;
    const actual_user_duty_id = actual_duty.duty_id;

    const dutiesOnSameGroup = await this.dutiesRepository.dutiesOnSameGroup(actual_user_duty_id, new_user_duty_id);
    if (!dutiesOnSameGroup) throw new AppError('Actual user and new user are not on the same group');

    const switchAlreadyExists = await this.switchesRepository.switchAlreadyExists(new_user_id, new_user_duty_id, actual_user_id, actual_user_duty_id);
    if (switchAlreadyExists) throw new AppError('Switch already exists');

    const switchEl = this.switchesRepository.create({
      new_user_id,
      new_user_duty_id,
      actual_user_id,
      actual_user_duty_id,
    });

    return switchEl;
  }
}
