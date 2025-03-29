import { inject, injectable } from 'tsyringe';

import { OfferPropositions } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IOfferPropositionsRepository from '../repositories/IOfferPropositionsRepository';
import IOffersRepository from '../repositories/IOffersRepository';

interface IRequest {
  offer_proposition_id: string;
  user_id: string;
}

@injectable()
export default class RejectOfferPropositionService {
  constructor(
    @inject('OfferPropositionsRepository')
    private offerPropositionsRepository: IOfferPropositionsRepository,

    @inject('OffersRepository')
    private offersRepository: IOffersRepository,
  ) { }

  public async execute({
    offer_proposition_id, user_id
  }: IRequest): Promise<OfferPropositions> {
    const offerProposition = await this.offerPropositionsRepository.findById(offer_proposition_id);
    if (!offerProposition) throw new AppError('Offer proposition does not exist');

    const offer = await this.offersRepository.findById(offerProposition.offer_id);
    if( offer?.offering_user_id !== user_id) throw new AppError('User is not the responsible for this offer');

    if(offer.closed) throw new AppError('Offer is already closed');

    const offerPropositionRejected = await this.offerPropositionsRepository.refuse(offer_proposition_id);
    
    const closeOffer = await this.offersRepository.close(offer.id);

    return offerPropositionRejected;
  }
}
