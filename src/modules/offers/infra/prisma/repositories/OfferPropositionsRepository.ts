import prisma from '@shared/infra/prisma/client';
import { OfferPropositions } from '@prisma/client';

import IOfferPropositionsRepository from '@modules/offers/repositories/IOfferPropositionsRepository';

export default class OfferPropositionsRepository implements IOfferPropositionsRepository {
  create(offer_id: string, user_id: string, duty_id: string): Promise<OfferPropositions> {
    return prisma.offerPropositions.create({
      data: {
        proposition_user_id: user_id,
        proposition_user_duty_id: duty_id,
        offer_id
      }
    });
  }

  findAll(offer_id: string): Promise<OfferPropositions[] | null> {
    return prisma.offerPropositions.findMany({
      where: {
        offer_id
      }
    });
  }

  findById(id: string): Promise<OfferPropositions | null> {
    return prisma.offerPropositions.findUnique({
      where: {
        id
      }
    });
  }

  delete(id: string): Promise<OfferPropositions> {
    return prisma.offerPropositions.delete({
      where: {
        id
      }
    });
  }

  accept(id: string): Promise<OfferPropositions> {
    return prisma.offerPropositions.update({
      where: {
        id
      },
      data: {
        accepted: true,
        analized: true
      }
    });
  }

  refuse(id: string): Promise<OfferPropositions> {
    return prisma.offerPropositions.update({
      where: {
        id
      },
      data: {
        accepted: false,
        analized: true
      }
    });
  }
  
  offerPropositionAlreadyExists(offer_id: string, user_id: string): Promise<OfferPropositions | null> {
    return prisma.offerPropositions.findFirst({
      where: {
        proposition_user_id: user_id,
        offer_id
      }
    });
  }
}
