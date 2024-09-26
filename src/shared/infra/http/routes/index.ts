import { Router } from 'express';

import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import groupsRoutes from '@modules/groups/infra/http/routes/groups.routes';
import invitesRoutes from '@modules/invites/infra/http/routes/invites.routes';
import plansRoutes from '@modules/plans/infra/http/routes/plans.routes';
import subscriptionsRoutes from '@modules/subscriptions/infra/http/routes/subscriptions.routes';
import dutiesRoutes from '@modules/duties/infra/http/routes/duties.routes';

const routes = Router();

routes.use('/sessions', sessionsRoutes);
routes.use('/users', usersRoutes);
routes.use('/groups', groupsRoutes);
routes.use('/invites', invitesRoutes);
routes.use('/plans', plansRoutes);
routes.use('/subscriptions', subscriptionsRoutes);
routes.use('/duties', dutiesRoutes);

export default routes;
