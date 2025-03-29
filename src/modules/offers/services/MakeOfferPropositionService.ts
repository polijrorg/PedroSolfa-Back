import { inject, injectable } from 'tsyringe';

import { OfferPropositions, Offers } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IOffersRepository from '@modules/offers/repositories/IOffersRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';
import IOfferPropositionsRepository from '@modules/offers/repositories/IOfferPropositionsRepository';

interface IRequest {
  user_id: string;
  user_on_duty_id: string;
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
    user_id, user_on_duty_id, offer_id
  }: IRequest): Promise<OfferPropositions> {

    const userOnDuty = await this.dutiesRepository.findDutyByUserOnDutyId(user_on_duty_id);
    if (!userOnDuty) throw new AppError('This user on duty id does not exist');
    const offering_user_duty_id = userOnDuty.duty_id;
    const offering_user_id = userOnDuty.user_id;

    if(user_id != offering_user_id) throw new AppError('You cannot make an offer on others behalf');

    const offerExists = await this.offersRepository.findById(offer_id);
    if (!offerExists) throw new AppError('Offer with this id does not exist');

    if (offerExists.closed) throw new AppError('Offer is closed');

    if(offerExists.offering_user_id === user_id) throw new AppError('User is the responsible for this offer');

    if(offerExists.offering_user_duty_id === offering_user_duty_id) throw new AppError('You cannot make an offer on your own duty');

    const verifyIfDutiesAreOnTheSameGroup = await this.dutiesRepository.dutiesOnSameGroup(offerExists.offering_user_duty_id, offering_user_duty_id);
    if (!verifyIfDutiesAreOnTheSameGroup) throw new AppError('Duties are not on the same group');

    const offerPropositionAlreadyExists = await this.offerPropositionsRepository.offerPropositionAlreadyExists(offering_user_id, offering_user_duty_id);
    if (offerPropositionAlreadyExists) throw new AppError('Offer Proposition already exists');

    const offerEl = this.offerPropositionsRepository.create(
      offer_id,
      user_id,
      offering_user_duty_id,
    );

    return offerEl;
  }
}
