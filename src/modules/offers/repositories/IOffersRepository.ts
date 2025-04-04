import { Offers } from '@prisma/client';

import ICreateOfferDTO from '../dtos/ICreateOfferDTO';

interface IOffersRepository {
  create(data: ICreateOfferDTO): Promise<Offers>;
  findAll(duty_id: string): Promise<Offers[]>;
  findAllOpen(duty_id: string): Promise<Offers[]>;
  findAllClosed(duty_id: string): Promise<Offers[]>;
  findById(id: string): Promise<Offers | null>;
  delete(id: string): Promise<Offers>;
  offerAlreadyExists(offering_user_id: string, offering_user_duty_id: string): Promise<Offers | null>;
  close(offer_id: string): Promise<Offers>;
}

export default IOffersRepository;
