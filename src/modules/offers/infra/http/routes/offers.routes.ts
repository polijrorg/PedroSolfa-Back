import { Router } from 'express';
import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import OffersController from '../controller/OffersController';

const offersRoutes = Router();

const offersController = new OffersController();

offersRoutes.post('/register', ensureAuthenticated, offersController.create);
offersRoutes.get('/read/:offer_id', ensureAuthenticated, offersController.readById);
offersRoutes.get('/readAll/:duty_id', ensureAuthenticated, offersController.readAllOffersByDuty);
offersRoutes.get('/readAllOfferPropositions/:offer_id', ensureAuthenticated, offersController.readAllOfferPropositions);
offersRoutes.delete('/delete/:offer_id', ensureAuthenticated, offersController.delete);
offersRoutes.post('/makeOfferProposition', ensureAuthenticated, offersController.makeOfferProposition);
offersRoutes.get('/readOfferProposition/:offer_proposition_id', ensureAuthenticated, offersController.readOfferProposition);
offersRoutes.delete('/deleteOfferProposition/:offer_proposition_id', ensureAuthenticated, offersController.deleteOfferProposition);
offersRoutes.post('/accept/:offer_proposition_id', ensureAuthenticated, offersController.accept);
offersRoutes.post('/reject/:offer_proposition_id', ensureAuthenticated, offersController.reject);

export default offersRoutes;
