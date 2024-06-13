import { Router } from 'express';

import UsersController from '../controller/UsersController';

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post('/register', usersController.create);
usersRoutes.get('/read', usersController.readAll);
usersRoutes.get('/read/:id', usersController.readById);

export default usersRoutes;
