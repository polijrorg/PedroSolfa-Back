import { inject, injectable } from 'tsyringe';
import { Subscriptions } from '@prisma/client';
import ISubscriptionsRepository from '../repositories/ISubscriptionsRepository';

interface IRequest {
  user_id: string;
  plan_id: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionsRepository,
  ) { }

  public async execute({
    user_id, plan_id,
  }: IRequest): Promise<Subscriptions> {

    const subscription = await this.subscriptionsRepository.create({
      user_id,
      plan_id,
    });

    return subscription;
  }
}
