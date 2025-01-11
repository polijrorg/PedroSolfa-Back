import { Router } from 'express';
import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import DutiesController from '../controller/DutiesController';

const dutiesRoutes = Router();

const dutiesController = new DutiesController();

dutiesRoutes.post('/register', ensureAuthenticated, dutiesController.create);
dutiesRoutes.get('/readAll/:group_id', ensureAuthenticated, dutiesController.readAll);
dutiesRoutes.get('/read/:id', ensureAuthenticated, dutiesController.readById);
dutiesRoutes.patch('/update/:duty_id', ensureAuthenticated, dutiesController.update);
dutiesRoutes.delete('/delete/:duty_id', ensureAuthenticated, dutiesController.delete);
dutiesRoutes.get('/userDuties', ensureAuthenticated, dutiesController.readUserDuties);

export default dutiesRoutes;
