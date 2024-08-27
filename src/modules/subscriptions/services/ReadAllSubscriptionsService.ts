import { inject, injectable } from 'tsyringe';

import { Subscriptions } from '@prisma/client';

import ISubscriptionsRepository from '../repositories/ISubscriptionsRepository';

@injectable()
export default class ReadAllSubscriptionsService {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionsRepository,
  ) { }

  public async execute(user_id: string): Promise<Subscriptions[] | null> {
    const subscriptions = this.subscriptionsRepository.findAll(user_id);

    return subscriptions;
  }
}
