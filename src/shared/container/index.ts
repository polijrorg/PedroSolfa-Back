import { container } from 'tsyringe';

import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/prisma/repositories/UsersRepository';
import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import GroupsRepository from '@modules/groups/infra/prisma/repositories/GroupsRepository';

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository);
container.registerSingleton<IGroupsRepository>('GroupsRepository', GroupsRepository);
