import { inject, injectable } from 'tsyringe';

import { Offers } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IOffersRepository from '../repositories/IOffersRepository';
import IOfferPropositionsRepository from '../repositories/IOfferPropositionsRepository';

interface IRequest {
  id: string;
  offer_id: string;
}

@injectable()
export default class DeleteInviteService {
  constructor(
    @inject('OffersRepository')
    private offersRepository: IOffersRepository,
    @inject('OfferPropositionsRepository')
    private offerPropositionsRepository: IOfferPropositionsRepository,
  ) { }

  public async execute({ id, offer_id }: IRequest): Promise<Offers> {
    const offerEl = await this.offersRepository.findById(offer_id);
    if (!offerEl) throw new AppError('Offer with this id does not exist');

    if(offerEl.offering_user_id !== id) throw new AppError('User is not the responsible for this offer');

    if(offerEl.closed) throw new AppError('Offer was already taken');

    const deletedOffer = this.offersRepository.delete(offer_id);

    const deleteOfferPropositions = await this.offerPropositionsRepository.deleteByOfferId(offer_id);
    
    return deletedOffer;
  }
}
