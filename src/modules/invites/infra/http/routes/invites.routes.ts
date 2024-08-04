import { Router } from 'express';

import InvitesController from '../controller/InvitesController';

const invitesRoutes = Router();

const invitesController = new InvitesController();

invitesRoutes.post('/register', invitesController.create);
invitesRoutes.get('/read/:group_id', invitesController.readAllInvitesByGroup);
invitesRoutes.delete('/delete/:group_id', invitesController.delete);

export default invitesRoutes;
