import { Router } from 'express';

import PlansController from '../controller/PlansController';

const plansRoutes = Router();

const plansController = new PlansController();

plansRoutes.post('/register', plansController.create);
plansRoutes.get('/read', plansController.readAll);
plansRoutes.get('/read/:id', plansController.readById);
plansRoutes.patch('/update/:id', plansController.update);
plansRoutes.delete('/delete/:id', plansController.delete);

export default plansRoutes;
