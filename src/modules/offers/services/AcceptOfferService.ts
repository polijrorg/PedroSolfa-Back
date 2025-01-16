import { inject, injectable } from 'tsyringe';

import { OfferPropositions } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IOffersRepository from '../repositories/IOffersRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';
import IOfferPropositionsRepository from '../repositories/IOfferPropositionsRepository';

interface IRequest {
  id: string;
  user_id: string;
  offer_id: string;
}

@injectable()
export default class AcceptOfferService {
  constructor(
    @inject('OffersRepository')
    private offersRepository: IOffersRepository,

    @inject('OfferPropositionsRepository')
    private offerPropositionsRepository: IOfferPropositionsRepository,

    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
  ) { }

  public async execute({
    id, offer_id, user_id
  }: IRequest): Promise<OfferPropositions> {
    const offerEl = await this.offersRepository.findById(offer_id);
    if (!offerEl) throw new AppError('Offer with this id does not exist');

    const offerProposition = await this.offerPropositionsRepository.findById(id);
    if (!offerProposition) throw new AppError('Offer proposition does not exist');

    if(offerEl.offering_user_id !== user_id) throw new AppError('User is not the responsible for this offer');

    if(offerEl.closed) throw new AppError('Offer is closed');

    if(offerProposition.offer_id !== offer_id) throw new AppError('Offer proposition does not belong to this offer');

    const switchDuties = await this.dutiesRepository.switchUsersOnDuty(offerEl.offering_user_duty_id, offerEl.offering_user_duty_id, id, user_id);
    if (!switchDuties) throw new AppError('Error on switching duties');

    const offerAccepted = await this.offerPropositionsRepository.accept(id);
      
    return offerAccepted;
  }
}
