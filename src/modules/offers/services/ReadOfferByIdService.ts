import { inject, injectable } from 'tsyringe';

import { Offers } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IOffersRepository from '../repositories/IOffersRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';

interface IRequest {
  id: string;
  offer_id: string;
}

@injectable()
export default class ReadOffersByIdService {
  constructor(
    @inject('OffersRepository')
    private offersRepository: IOffersRepository,
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
  ) { }

  public async execute({ id, offer_id }: IRequest): Promise<Offers | null> {

    // verificar quais usuários podem acessar a troca
    
    const dutyExists = await this.dutiesRepository.findById(offer_id);
    if (!dutyExists) throw new AppError('Offer with this id does not exist');

    const offerEl = await this.offersRepository.findById(offer_id);

    return offerEl;
  }
}
