import prisma from '@shared/infra/prisma/client';
import { Offers } from '@prisma/client';

import IOffersRepository from '@modules/offers/repositories/IOffersRepository';
import ICreateOfferDTO from '@modules/offers/dtos/ICreateOfferDTO';

export default class OffersRepository implements IOffersRepository {
  create(data: ICreateOfferDTO): Promise<Offers> {
    return prisma.offers.create({
      data: {
        offering_user_id: data.offering_user_id,
        offering_user_duty_id: data.offering_user_duty_id,
        closed: false
      }
    });
  }

  findById(id: string): Promise<Offers | null> {
    return prisma.offers.findUnique({
      where: {
        id
      }
    });
  }

  findAll(duty_id: string): Promise<Offers[]> {
    return prisma.offers.findMany({
      where: {
        offering_user_duty_id: duty_id
      }
    });
  }

  findAllOpen(duty_id: string): Promise<Offers[]> {
    return prisma.offers.findMany({
      where: {
        offering_user_duty_id: duty_id,
        closed: false
      }
    });
  }

  findAllClosed(duty_id: string): Promise<Offers[]> {
    return prisma.offers.findMany({
      where: {
        offering_user_duty_id: duty_id,
        closed: true
      }
    });
  }

  delete(id: string): Promise<Offers> {
    return prisma.offers.delete({
      where: {
        id
      }
    });
  }

  offerAlreadyExists(offering_user_id: string, offering_user_duty_id: string): Promise<Offers | null> {
    return prisma.offers.findFirst({
      where: {
        offering_user_id,
        offering_user_duty_id
      }
    });
  }

  close(offer_id: string): Promise<Offers> {
    return prisma.offers.update({
      where: {
        id: offer_id
      },
      data: {
        closed: true
      }
    });
  }

}
