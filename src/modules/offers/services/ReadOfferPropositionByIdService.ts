import { inject, injectable } from 'tsyringe';

import { OfferPropositions } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IOfferPropositionsRepository from '../repositories/IOfferPropositionsRepository';

interface IRequest {
  id: string;
  offer_proposition_id: string;
}

@injectable()
export default class ReadOfferPropositionsByIdService {
  constructor(
    @inject('OfferPropositionsRepository')
    private offersRepository: IOfferPropositionsRepository,
  ) { }

  public async execute({ id, offer_proposition_id }: IRequest): Promise<OfferPropositions | null> {

    // verificar quais usuários podem acessar a troca
    const offerProposition = await this.offersRepository.findById(offer_proposition_id);
    if (!offerProposition) throw new AppError('Offer with this id does not exist');

    return offerProposition;
  }
}
