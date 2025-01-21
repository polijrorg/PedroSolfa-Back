import { Router } from 'express';
import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import SubscriptionsController from '../controller/SubscriptionsController';

const subscriptionsRoutes = Router();

const subscriptionsController = new SubscriptionsController();

subscriptionsRoutes.post('/register', ensureAuthenticated, subscriptionsController.create);
subscriptionsRoutes.get('/readAll', ensureAuthenticated, subscriptionsController.readAll);
subscriptionsRoutes.get('/read/:subscription_id', ensureAuthenticated, subscriptionsController.readById);
subscriptionsRoutes.get('/readByUserId/:user_id', ensureAuthenticated, subscriptionsController.readByUserId);

export default subscriptionsRoutes;
