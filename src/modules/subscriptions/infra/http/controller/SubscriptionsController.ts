import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSubscriptionService from '@modules/subscriptions/services/CreateSubscriptionService';
import ReadAllSubscriptionsService from '@modules/subscriptions/services/ReadAllSubscriptionsService';
import ReadSubscriptionByIdService from '@modules/subscriptions/services/ReadSubscriptionByIdService';

export default class SubscriptionController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { plan_id } = req.body;
    const { id } = req.token;

    const createSubscription = container.resolve(CreateSubscriptionService);

    const subscription = await createSubscription.execute({
      plan_id,
      user_id: id,
    });

    return res.status(201).json(subscription);
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;
    
    const readSubscriptions = container.resolve(ReadAllSubscriptionsService);

    const subscriptions = await readSubscriptions.execute(id);

    return res.status(201).json(subscriptions);
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const { subscription_id } = req.params;

    const readSubscription = container.resolve(ReadSubscriptionByIdService);

    const subscription = await readSubscription.execute({
      id: subscription_id,
    });

    return res.status(201).json(subscription);
  }
}
