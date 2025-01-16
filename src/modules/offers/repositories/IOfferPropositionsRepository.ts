import { OfferPropositions } from '@prisma/client';

interface IOfferPropositionsRepository {
  create(offer_id: string, user_id: string, duty_id: string): Promise<OfferPropositions>;
  findAll(offer_id: string): Promise<OfferPropositions[] | null>;
  findById(id: string): Promise<OfferPropositions | null>
  offerPropositionAlreadyExists(offer_id: string, user_id: string): Promise<OfferPropositions | null>;
  delete(id: string): Promise<OfferPropositions>;
  accept(id: string): Promise<OfferPropositions>;
  refuse(id: string): Promise<OfferPropositions>;
}

export default IOfferPropositionsRepository;
