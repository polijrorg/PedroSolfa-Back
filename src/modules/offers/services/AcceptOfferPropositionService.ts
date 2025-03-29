import { inject, injectable } from 'tsyringe';

import { OfferPropositions } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IOffersRepository from '../repositories/IOffersRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';
import IOfferPropositionsRepository from '../repositories/IOfferPropositionsRepository';

interface IRequest {
  offer_proposition_id: string;
  user_id: string;
}

@injectable()
export default class AcceptOfferPropositionService {
  constructor(
    @inject('OffersRepository')
    private offersRepository: IOffersRepository,

    @inject('OfferPropositionsRepository')
    private offerPropositionsRepository: IOfferPropositionsRepository,

    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
  ) { }

  public async execute({
    offer_proposition_id, user_id
  }: IRequest): Promise<OfferPropositions> {

    const offerProposition = await this.offerPropositionsRepository.findById(offer_proposition_id);
    if (!offerProposition) throw new AppError('Offer proposition does not exist');

    const offer = await this.offersRepository.findById(offerProposition.offer_id);
    if( offer?.offering_user_id !== user_id) throw new AppError('User is not the responsible for this offer');

    if(offer.closed) throw new AppError('Offer is already closed');

    const switchDuties = await this.dutiesRepository.switchUsersOnDuty(offer.offering_user_id, offer.offering_user_duty_id, offerProposition.proposition_user_id, offerProposition.proposition_user_duty_id);
    if (!switchDuties) throw new AppError('Error on switching duties');

    const offerPropositionAccepted = await this.offerPropositionsRepository.accept(offer_proposition_id);

    const closeAllOfferPropositions = await this.offerPropositionsRepository.closeAllOfferPropositions(offer.id);
    
    const closeOffer = await this.offersRepository.close(offer.id);
    
    return offerPropositionAccepted;
  }
}
