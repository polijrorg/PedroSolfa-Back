import { inject, injectable } from 'tsyringe';
import { Subscriptions } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import ISubscriptionsRepository from '../repositories/ISubscriptionsRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class ReadSubscriptionByIdService {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionsRepository,
  ) { }

  public async execute({ id }: IRequest): Promise<Subscriptions | null> {
    const subscriptionAlreadyExists = await this.subscriptionsRepository.findById(id);

    if (!subscriptionAlreadyExists) throw new AppError('Subscription with this id does not exist');

    const subscription = this.subscriptionsRepository.findById(id);

    return subscription;
  }
}
