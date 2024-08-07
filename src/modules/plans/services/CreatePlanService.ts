import { inject, injectable } from 'tsyringe';
import { Plans } from '@prisma/client';
import IPlansRepository from '../repositories/IPlansRepository';

interface IRequest {
  name: string;
  price: number;
  max_users: number;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) { }

  public async execute({
    name, price, max_users,
  }: IRequest): Promise<Plans> {

    const plan = await this.plansRepository.create({
      name,
      price,
      max_users,
    });

    return plan;
  }
}
