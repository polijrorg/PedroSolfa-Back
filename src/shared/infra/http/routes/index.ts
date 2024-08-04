import { Router } from 'express';

import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import groupsRoutes from '@modules/groups/infra/http/routes/groups.routes';
import invitesRoutes from '@modules/invites/infra/http/routes/invites.routes';

const routes = Router();

routes.use('/sessions', sessionsRoutes);
routes.use('/users', usersRoutes);
routes.use('/groups', groupsRoutes);
routes.use('/invites', invitesRoutes);

export default routes;
