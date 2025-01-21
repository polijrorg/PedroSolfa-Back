import { Subscriptions } from '@prisma/client';

import ICreateSubscriptionDTO from '../dtos/ICreateSubscriptionDTO';

interface ISubscriptionsRepository {
  findById(id: string): Promise<Subscriptions | null>;
  create(data: ICreateSubscriptionDTO): Promise<Subscriptions>;
  findAll(user_id: string): Promise<Subscriptions[]>;
  groupIsVinculated(id: string): Promise<Subscriptions | null>;
  vinculateGroup(id: string, group_id: string): Promise<Subscriptions>;
  findByUserId(user_id: string): Promise<Subscriptions[]>;
}

export default ISubscriptionsRepository;
