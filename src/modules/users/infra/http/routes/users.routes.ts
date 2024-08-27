import { Router } from 'express';
import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import UsersController from '../controller/UsersController';

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post('/register', usersController.create);
usersRoutes.get('/readAll', usersController.readAll);
usersRoutes.get('/read', ensureAuthenticated, usersController.readById);
usersRoutes.patch('/update', ensureAuthenticated, usersController.update);
usersRoutes.delete('/delete', ensureAuthenticated, usersController.delete);

export default usersRoutes;
