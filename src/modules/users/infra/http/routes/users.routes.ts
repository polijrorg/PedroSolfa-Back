import { Router } from 'express';
import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import UsersController from '../controller/UsersController';
import multer from 'multer';

const usersRoutes = Router();

const usersController = new UsersController();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

usersRoutes.post('/register', upload.single('image'), usersController.create);
usersRoutes.get('/readAll', usersController.readAll);
usersRoutes.get('/read', ensureAuthenticated, usersController.readById);
usersRoutes.patch('/update', upload.single('image'), ensureAuthenticated, usersController.update);
usersRoutes.delete('/delete', ensureAuthenticated, usersController.delete);

export default usersRoutes;
