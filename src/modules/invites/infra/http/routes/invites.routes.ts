import { Router } from 'express';
import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import InvitesController from '../controller/InvitesController';

const invitesRoutes = Router();

const invitesController = new InvitesController();

invitesRoutes.post('/register', ensureAuthenticated, invitesController.create);
invitesRoutes.get('/read/:group_id', ensureAuthenticated, invitesController.readAllInvitesByGroup);
invitesRoutes.get('/readAllByUserId', ensureAuthenticated, invitesController.readAllInvitesByUser);
invitesRoutes.get('/readByUser/:user_id', ensureAuthenticated, invitesController.readInvitesByUser);
invitesRoutes.delete('/delete/:group_id', ensureAuthenticated, invitesController.delete);
invitesRoutes.post('/accept', ensureAuthenticated, invitesController.accept);
invitesRoutes.post('/reject', ensureAuthenticated, invitesController.reject);
invitesRoutes.post('/registerAdm/:user_id', ensureAuthenticated, invitesController.turnIntoAdm);

export default invitesRoutes;
