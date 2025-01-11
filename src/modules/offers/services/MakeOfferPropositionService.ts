import { inject, injectable } from 'tsyringe';

import { OfferPropositions, Offers } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IOffersRepository from '@modules/offers/repositories/IOffersRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';
import IOfferPropositionsRepository from '@modules/offers/repositories/IOfferPropositionsRepository';

interface IRequest {
  user_id: string;
  user_duty_id: string;
  offer_id: string;
}

@injectable()
export default class CreateOfferService {
  constructor(
    @inject('OffersRepository')
    private offersRepository: IOffersRepository,
    @inject('OfferPropositionsRepository')
    private offerPropositionsRepository: IOfferPropositionsRepository,
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    user_id, user_duty_id, offer_id
  }: IRequest): Promise<OfferPropositions> {

    const offeringUserDuty = await this.dutiesRepository.findById(user_duty_id);
    if (!offeringUserDuty) throw new AppError('Duty with this id does not exist');

    const offeringUser = await this.usersRepository.findById(user_id);
    if (!offeringUser) throw new AppError('User with this id does not exist');

    const verifyIfOfferingUserIsOnDuty = await this.dutiesRepository.findUserDuty(user_id, user_duty_id);
    if (!verifyIfOfferingUserIsOnDuty) throw new AppError('User is not on informed duty');

    const offerExists = await this.offersRepository.findById(offer_id);
    if (!offerExists) throw new AppError('Offer with this id does not exist');

    if (offerExists.closed) throw new AppError('Offer is closed');

    if(offerExists.offering_user_id === user_id) throw new AppError('User is the responsible for this offer');

    if(offerExists.offering_user_duty_id === user_duty_id) throw new AppError('You cannot offer on your own duty');

    const verifyIfDutiesAreOnTheSameGroup = await this.dutiesRepository.dutiesOnSameGroup(user_duty_id, user_duty_id);
    if (!verifyIfDutiesAreOnTheSameGroup) throw new AppError('Duties are not on the same group');

    const offerPropositionAlreadyExists = await this.offerPropositionsRepository.offerPropositionAlreadyExists(user_id, user_duty_id);
    if (offerPropositionAlreadyExists) throw new AppError('Offer Proposition already exists');

    const offerEl = this.offerPropositionsRepository.create(
      offer_id,
      user_id,
      user_duty_id,
    );

    return offerEl;
  }
}
