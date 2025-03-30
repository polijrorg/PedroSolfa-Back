import { Router } from 'express';
import ensureAuthenticated from '@shared/infra/http/middlewares/EnsureAuthenticated';
import multer from 'multer';
import GroupsController from '../controller/GroupsController';

const groupsRoutes = Router();

const storage = multer.memoryStorage();

const upload = multer({ storage });

const groupsController = new GroupsController();

groupsRoutes.post('/register', upload.single('image'), ensureAuthenticated, groupsController.create);
groupsRoutes.get('/read', ensureAuthenticated, groupsController.readAll);
groupsRoutes.get('/read/:id', ensureAuthenticated, groupsController.readById);
groupsRoutes.patch('/update/:id', upload.single('image'), ensureAuthenticated, groupsController.update);
groupsRoutes.delete('/delete/:id', ensureAuthenticated, groupsController.delete);

export default groupsRoutes;
