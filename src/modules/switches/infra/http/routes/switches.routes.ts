import { Router } from 'express';
import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import SwitchesController from '../controller/SwitchesController';

const switchesRoutes = Router();

const switchesController = new SwitchesController();

switchesRoutes.post('/register', ensureAuthenticated, switchesController.create);
switchesRoutes.get('/read/:switch_id', ensureAuthenticated, switchesController.readById);
switchesRoutes.get('/readAll/:duty_id', ensureAuthenticated, switchesController.readAllSwitchesByDuty);
switchesRoutes.delete('/delete/:switch_id', ensureAuthenticated, switchesController.delete);
switchesRoutes.post('/accept', ensureAuthenticated, switchesController.accept);
switchesRoutes.post('/reject', ensureAuthenticated, switchesController.reject);
switchesRoutes.get('/readPendingSentSwitches', ensureAuthenticated, switchesController.readPendingSentSwitches);
switchesRoutes.get('/readPendingReceivedSwitches', ensureAuthenticated, switchesController.readPendingReceivedSwitches);
switchesRoutes.get('/readActiveSentSwitches', ensureAuthenticated, switchesController.readActiveSentSwitches);
switchesRoutes.get('/readActiveReceivedSwitches', ensureAuthenticated, switchesController.readActiveReceivedSwitches);

export default switchesRoutes;
