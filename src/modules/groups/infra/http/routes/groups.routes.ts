import { Router } from 'express';

import GroupsController from '../controller/GroupsController';

const groupsRoutes = Router();

const groupsController = new GroupsController();

groupsRoutes.post('/register', groupsController.create);
groupsRoutes.get('/read', groupsController.readAll);
groupsRoutes.get('/read/:id', groupsController.readById);
groupsRoutes.patch('/update/:id', groupsController.update);
groupsRoutes.delete('/delete/:id', groupsController.delete);

export default groupsRoutes;
