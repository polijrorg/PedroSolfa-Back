import prisma from '@shared/infra/prisma/client';
import { Prisma, Subscriptions } from '@prisma/client';

import ISubscriptionsRepository from '@modules/subscriptions/repositories/ISubscriptionsRepository';
import ICreateSubscriptionDTO from '@modules/subscriptions/dtos/ICreateSubscriptionDTO';

export default class SubscriptionsRepository implements ISubscriptionsRepository {
  private ormRepository;

  constructor() {
    this.ormRepository = prisma.subscriptions;
  }

  public findById(id: string): Promise<Subscriptions | null> {
    return this.ormRepository.findFirst({ where: { id } });
  }

  public create(data: ICreateSubscriptionDTO): Promise<Subscriptions> {
    return this.ormRepository.create({ data });
  }

  public findAll(user_id: string): Promise<Subscriptions[]> {
    return this.ormRepository.findMany({
      where: {
        user_id
      }
    });
  }

  public async groupIsVinculated(id: string): Promise<Subscriptions | null> {
    const subscription = await this.ormRepository.findFirst({ where: { id } });
    return subscription && subscription.group_id ? subscription : null;
  }

  public vinculateGroup(id: string, group_id: string): Promise<Subscriptions> {
    return this.ormRepository.update({
      where: { id },
      data: {
        group_id
      }
    });
  }

  public findByUserId(user_id: string): Promise<Subscriptions[]> {
    return this.ormRepository.findMany({
      where: {
        user_id
      }
    });
  }
}
