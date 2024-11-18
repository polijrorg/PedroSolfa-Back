import { inject, injectable } from 'tsyringe';

import { Offers } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IOffersRepository from '@modules/offers/repositories/IOffersRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';

interface IRequest {
  offering_user_id: string;
  offering_user_duty_id: string;
}

@injectable()
export default class CreateOfferService {
  constructor(
    @inject('OffersRepository')
    private offersRepository: IOffersRepository,
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    offering_user_id, offering_user_duty_id,
  }: IRequest): Promise<Offers> {

    const offeringUserDuty = await this.dutiesRepository.findById(offering_user_duty_id);
    if (!offeringUserDuty) throw new AppError('Duty with this id does not exist');

    const offeringUser = await this.usersRepository.findById(offering_user_id);
    if (!offeringUser) throw new AppError('User with this id does not exist');

    const verifyIfOfferingUserIsOnDuty = await this.dutiesRepository.findUserDuty(offering_user_id, offering_user_duty_id);
    if (!verifyIfOfferingUserIsOnDuty) throw new AppError('User is not on this duty');

    const offerAlreadyExists = await this.offersRepository.offerAlreadyExists(offering_user_id, offering_user_duty_id);
    if (offerAlreadyExists) throw new AppError('Offer already exists');

    const offerEl = this.offersRepository.create({
      offering_user_id,
      offering_user_duty_id,
    });

    return offerEl;
  }
}
