import { inject, injectable } from 'tsyringe';

import { OfferPropositions } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IOfferPropositionsRepository from '../repositories/IOfferPropositionsRepository';

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
export default class DeleteOfferPropositionService {
  constructor(
    @inject('OfferPropositionsRepository')
    private offerPropositionsRepository: IOfferPropositionsRepository,
  ) { }

  public async execute({ id, user_id }: IRequest): Promise<OfferPropositions> {
    const offerPropositionEl = await this.offerPropositionsRepository.findById(id);
    if (!offerPropositionEl) throw new AppError('Offer proposition with this id does not exist');

    if(offerPropositionEl.proposition_user_id !== user_id) throw new AppError('User did not make this offer proposition');

    if(offerPropositionEl.analized) throw new AppError('Offer Proposition was already analized');

    const deletedOfferProposition = this.offerPropositionsRepository.delete(id);
    return deletedOfferProposition;
  }
}
