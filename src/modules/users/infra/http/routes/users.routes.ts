import { Router } from 'express';
import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import multer from 'multer';
import UsersController from '../controller/UsersController';

const usersRoutes = Router();

const usersController = new UsersController();

const storage = multer.memoryStorage();
const upload = multer({ storage });

usersRoutes.post('/register', upload.single('image'), usersController.create);
usersRoutes.get('/readAll', usersController.readAll);
usersRoutes.get('/read', ensureAuthenticated, usersController.readById);
usersRoutes.get('/readByEmail', ensureAuthenticated, usersController.readByEmail);
usersRoutes.patch('/update', upload.single('image'), ensureAuthenticated, usersController.update);
usersRoutes.delete('/delete', ensureAuthenticated, usersController.delete);
usersRoutes.post('/send-pin', usersController.sendPin);

export default usersRoutes;
