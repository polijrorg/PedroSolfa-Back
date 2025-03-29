import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateOfferService from '@modules/offers/services/CreateOfferService';
import ReadOffersByDutyIdService from '@modules/offers/services/ReadOffersByDutyIdService';
import ReadAllOfferPropositionsService from '@modules/offers/services/ReadAllOfferPropositionsService';
import DeleteOfferService from '@modules/offers/services/DeleteOfferService';
import AcceptOfferService from '@modules/offers/services/AcceptOfferPropositionService';
import RejectOfferService from '@modules/offers/services/RejectOfferPropositionService';
import ReadOffersByIdService from '@modules/offers/services/ReadOfferByIdService';
import MakeOfferPropositionService from '@modules/offers/services/MakeOfferPropositionService';
import ReadOfferPropositionByIdService from '@modules/offers/services/ReadOfferPropositionByIdService';
import DeleteOfferPropositionService from '@modules/offers/services/DeleteOfferPropositionService';
import ReadOpenOffersByDutyIdService from '@modules/offers/services/ReadOpenOffersByDutyIdService';
import ReadClosedOffersByDutyIdService from '@modules/offers/services/ReadClosedOffersByDutyIdService';

export default class OffersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      offering_user_on_duty_id,
    } = req.body;

    const { id } = req.token;

    const createOffer = container.resolve(CreateOfferService);

    const offerEl = await createOffer.execute({
      user_id: id,
      offering_user_on_duty_id,
    });

    return res.status(201).json(offerEl);
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const { offer_id } = req.params;
    const { id } = req.token;

    const readOffer = container.resolve(ReadOffersByIdService);

    const user = await readOffer.execute({
      id,
      offer_id,
    });

    return res.status(201).json(user);
  }

  public async readAllOffersByDuty(req: Request, res: Response): Promise<Response> {
    const { duty_id } = req.params;
    const { id } = req.token;

    const readOffers = container.resolve(ReadOffersByDutyIdService);

    const user = await readOffers.execute({
      id,
      duty_id,
    });

    return res.status(201).json(user);
  }

  public async readAllOpenOffersByDuty(req: Request, res: Response): Promise<Response> {
    const { duty_id } = req.params;
    const { id } = req.token;

    const readOffers = container.resolve(ReadOpenOffersByDutyIdService);

    const user = await readOffers.execute({
      id,
      duty_id,
    });

    return res.status(201).json(user);
  }

  public async readAllClosedOffersByDuty(req: Request, res: Response): Promise<Response> {
    const { duty_id } = req.params;
    const { id } = req.token;

    const readOffers = container.resolve(ReadClosedOffersByDutyIdService);

    const user = await readOffers.execute({
      id,
      duty_id,
    });

    return res.status(201).json(user);
  }

  public async readAllOfferPropositions(req: Request, res: Response): Promise<Response> {
    const { offer_id } = req.params;
    const { id } = req.token;

    const readOfferPropositions = container.resolve(ReadAllOfferPropositionsService);

    const user = await readOfferPropositions.execute({
      id,
      offer_id,
    });

    return res.status(201).json(user);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { offer_id } = req.params;
    const { id } = req.token;

    const deleteOffer = container.resolve(DeleteOfferService);

    const user = await deleteOffer.execute({
      id,
      offer_id,
    });

    return res.status(201).json(user);
  }

  public async makeOfferProposition(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;
    const { offer_id, user_on_duty_id } = req.body;

    const makeOfferProposition = container.resolve(MakeOfferPropositionService);

    const group = await makeOfferProposition.execute({
      user_id: id,
      offer_id,
      user_on_duty_id,
    });

    return res.status(201).json(group);
  }

  public async accept(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;
    const { offer_proposition_id } = req.params;

    const acceptOffer = container.resolve(AcceptOfferService);

    const group = await acceptOffer.execute({
      offer_proposition_id,
      user_id: id,
    });

    return res.status(201).json(group);
  }

  public async reject(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;
    const { offer_proposition_id } = req.params;

    const rejectOffer = container.resolve(RejectOfferService);

    const group = await rejectOffer.execute({
      offer_proposition_id,
      user_id: id,
    });

    return res.status(201).json(group);
  }

  public async readOfferProposition(req: Request, res: Response): Promise<Response> {
    const { offer_proposition_id } = req.params;
    const { id } = req.token;

    const readOfferPropositions = container.resolve(ReadOfferPropositionByIdService);

    const user = await readOfferPropositions.execute({
      id,
      offer_proposition_id,
    });

    return res.status(201).json(user);
  }

  public async deleteOfferProposition(req: Request, res: Response): Promise<Response> {
    const { offer_proposition_id } = req.params;
    const { id } = req.token;

    const deleteOfferProposition = container.resolve(DeleteOfferPropositionService);

    const user = await deleteOfferProposition.execute({
      user_id: id,
      id: offer_proposition_id,
    });

    return res.status(201).json(user);
  }
}
