import { inject, injectable } from 'tsyringe';

import { Offers } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IOffersRepository from '@modules/offers/repositories/IOffersRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';

interface IRequest {
  user_id: string;
  offering_user_on_duty_id: string;
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
    offering_user_on_duty_id, user_id
  }: IRequest): Promise<Offers> {

    const offering_user_on_duty = await this.dutiesRepository.findDutyByUserOnDutyId(offering_user_on_duty_id);
    if (!offering_user_on_duty) throw new AppError('This user on duty id does not exist');
    const offering_user_id = offering_user_on_duty.user_id;
    const offering_user_duty_id = offering_user_on_duty.duty_id;

    if(user_id != offering_user_id) throw new AppError('You cannot make an offer on others behalf');

    const offerAlreadyExists = await this.offersRepository.offerAlreadyExists(offering_user_id, offering_user_duty_id);
    if (offerAlreadyExists) throw new AppError('Offer already exists');

    const offerEl = this.offersRepository.create({
      offering_user_id,
      offering_user_duty_id,
    });

    return offerEl;
  }
}
