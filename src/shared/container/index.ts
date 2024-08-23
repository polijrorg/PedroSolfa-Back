import { container } from 'tsyringe';

import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/prisma/repositories/UsersRepository';
import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import GroupsRepository from '@modules/groups/infra/prisma/repositories/GroupsRepository';
import IInvitesRepository from '@modules/invites/repositories/IInvitesRepository';
import InvitesRepository from '@modules/invites/infra/prisma/repositories/InvitesRepository';
import IPlansRepository from '@modules/plans/repositories/IPlansRepository';
import PlansRepository from '@modules/plans/infra/prisma/repositories/PlansRepository';
import ISubscriptionsRepository from '@modules/subscriptions/repositories/ISubscriptionsRepository';
import SubscriptionsRepository from '@modules/subscriptions/infra/prisma/repositories/SubscriptionsRepository';

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository);
container.registerSingleton<IGroupsRepository>('GroupsRepository', GroupsRepository);
container.registerSingleton<IInvitesRepository>('InvitesRepository', InvitesRepository);
container.registerSingleton<IPlansRepository>('PlansRepository', PlansRepository);
container.registerSingleton<ISubscriptionsRepository>('SubscriptionsRepository', SubscriptionsRepository);