import { inject, injectable } from 'tsyringe';

import { OfferPropositions } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IOfferPropositionsRepository from '../repositories/IOfferPropositionsRepository';
import IOffersRepository from '../repositories/IOffersRepository';

interface IRequest {
  id: string;
  user_id: string;
  offer_id: string;
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
    id, user_id, offer_id
  }: IRequest): Promise<OfferPropositions> {
    const offerEl = await this.offersRepository.findById(offer_id);
    if (!offerEl) throw new AppError('Offer with this id does not exist');

    const offerProposition = await this.offerPropositionsRepository.findById(id);
    if (!offerProposition) throw new AppError('Offer proposition does not exist');

    if(offerEl.offering_user_id !== user_id) throw new AppError('User is not the responsible for this offer');

    if(offerEl.closed) throw new AppError('Offer is closed');

    if(offerProposition.offer_id !== offer_id) throw new AppError('Offer proposition does not belong to this offer');

    const offerPropositionAccepted = this.offerPropositionsRepository.refuse(id);
      
    return offerPropositionAccepted;
  }
}
