import { inject, injectable } from 'tsyringe';

import { Switches } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ISwitchesRepository from '@modules/switches/repositories/ISwitchesRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';

interface IRequest {
  user_id: string;
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
    user_id, user_on_duty_id, user_on_another_duty_id,
  }: IRequest): Promise<Switches> {
    const new_duty = await this.dutiesRepository.findDutyByUserOnDutyId(user_on_duty_id);

    console.log('new_duty', new_duty, user_on_duty_id);

    if (!new_duty) throw new AppError('This user on duty id does not exist');
    const new_user_id = new_duty.user_id;
    const new_user_duty_id = new_duty.duty_id;

    const actual_duty = await this.dutiesRepository.findDutyByUserOnDutyId(user_on_another_duty_id);

    if (!actual_duty) throw new AppError('This user on another duty id does not exist');

    console.log('actual_duty', actual_duty, user_on_another_duty_id);

    const actual_user_id = actual_duty.user_id;

    const actual_user_duty_id = actual_duty.duty_id;

    const user = await this.usersRepository.findById(user_id);

    console.log('user', user, user_id, actual_user_id, new_user_id, actual_user_duty_id, new_user_duty_id);

    if (user?.id !== new_user_id) throw new AppError('You cannot make a switch on others behalf');

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
