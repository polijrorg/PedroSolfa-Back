import { inject, injectable } from 'tsyringe';

import { Offers } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IOffersRepository from '../repositories/IOffersRepository';
import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';

interface IRequest {
  id: string;
  duty_id: string;
}

@injectable()
export default class ReadOffersByDutyIdService {
  constructor(
    @inject('OffersRepository')
    private offersRepository: IOffersRepository,
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,
  ) { }

  public async execute({ id, duty_id }: IRequest): Promise<Offers[] | null> {

    // verificar se deve ter restrições para visualizar
    
    const dutyExists = await this.dutiesRepository.findById(duty_id);
    if (!dutyExists) throw new AppError('Duty with this id does not exist');

    const offerEl = await this.offersRepository.findAll(duty_id);

    return offerEl;
  }
}
