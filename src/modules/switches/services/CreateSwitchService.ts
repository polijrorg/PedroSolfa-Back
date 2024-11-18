import { inject, injectable } from 'tsyringe';

import { Switches } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ISwitchesRepository from '@modules/switches/repositories/ISwitchesRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';

interface IRequest {
  new_user_id: string;
  new_user_duty_id: string;
  actual_user_id: string;
  actual_user_duty_id: string;

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
    new_user_id, new_user_duty_id, actual_user_id, actual_user_duty_id,
  }: IRequest): Promise<Switches> {

    const newUserDutyAlreadyExists = await this.dutiesRepository.findById(new_user_duty_id);
    if (!newUserDutyAlreadyExists) throw new AppError('New user duty with this id does not exist');

    const actualUserDutyAlreadyExists = await this.dutiesRepository.findById(actual_user_duty_id);
    if (!actualUserDutyAlreadyExists) throw new AppError('Actual user duty with this id does not exist');

    const newUser = await this.usersRepository.findById(new_user_id);
    if (!newUser) throw new AppError('New user with this id does not exist');

    const actualUser = await this.usersRepository.findById(actual_user_id);
    if (!actualUser) throw new AppError('Actual user with this id does not exist');

    const verifyIfNewUserIsOnDuty = await this.dutiesRepository.findUserDuty(new_user_id, new_user_duty_id);
    if (!verifyIfNewUserIsOnDuty) throw new AppError('New user is not on this duty');

    const verifyIfActualUserIsOnDuty = await this.dutiesRepository.findUserDuty(actual_user_id, actual_user_duty_id);
    if (!verifyIfActualUserIsOnDuty) throw new AppError('Actual user is not on this duty');

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
