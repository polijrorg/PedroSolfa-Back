import { inject, injectable } from 'tsyringe';
import { Subscriptions } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import ISubscriptionsRepository from '../repositories/ISubscriptionsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class ReadSubscriptionByUSerIdService {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({ id }: IRequest): Promise<Subscriptions[]> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new AppError('User with this id does not exist');

    const subscriptions = this.subscriptionsRepository.findByUserId(id);

    return subscriptions;
  }
}
