import { inject, injectable } from 'tsyringe';

import { OfferPropositions } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IOfferPropositionsRepository from '../repositories/IOfferPropositionsRepository';
import IOffersRepository from '@modules/offers/repositories/IOffersRepository';

interface IRequest {
  id: string;
  offer_id: string;
}

@injectable()
export default class ReadOfferPropositionsByDutyIdService {
  constructor(
    @inject('OfferPropositionsRepository')
    private offerPropositionsRepository: IOfferPropositionsRepository,
    @inject('OffersRepository')
    private offersRepository: IOffersRepository,
  ) { }

  public async execute({ id, offer_id }: IRequest): Promise<OfferPropositions[] | null> {
    const offerExists = await this.offersRepository.findById(offer_id);
    if (!offerExists) throw new AppError('Offer with this id does not exist');

    const offerPropositions = await this.offerPropositionsRepository.findAll(offer_id);

    return offerPropositions;
  }
}
