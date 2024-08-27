import { inject, injectable } from 'tsyringe';

import { Plans } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IPlansRepository from '../repositories/IPlansRepository';

interface IRequest {
    id: string;
    name: string;
    price: number;
    max_users: number;
  }

@injectable()
export default class UpdatePlanService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({
    id, name, price, max_users,
  }: IRequest): Promise<Plans> {
    const planAlreadyExists = await this.plansRepository.findById(id);
    if (!planAlreadyExists) throw new AppError('Plan with this id does not exist');

    const updatedPlan = this.plansRepository.update(
      id,
      {
        name,
        price,
        max_users,
      },
    );

    return updatedPlan;
  }
}
