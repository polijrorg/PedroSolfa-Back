import { inject, injectable } from 'tsyringe';
import { Subscriptions } from '@prisma/client';
import AppError from '@shared/errors/AppError';
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

    @inject('UsersRepository')
    private usersRepository: ISubscriptionsRepository,

    @inject('PlansRepository')
    private plansRepository: ISubscriptionsRepository,
  ) { }

  public async execute({
    user_id, plan_id,
  }: IRequest): Promise<Subscriptions> {
    const userExists = await this.usersRepository.findById(user_id);

    const planExists = await this.plansRepository.findById(plan_id);

    if (!planExists) throw new AppError('Plan with this id does not exist');

    if (!userExists) throw new AppError('User already has a subscription');

    const subscription = await this.subscriptionsRepository.create({
      user_id,
      plan_id,
    });

    return subscription;
  }
}
