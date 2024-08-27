import { inject, injectable } from 'tsyringe';
import { Plans } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import IPlansRepository from '../repositories/IPlansRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class ReadPlanByIdService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) { }

  public async execute({ id }: IRequest): Promise<Plans | null> {
    const planAlreadyExists = await this.plansRepository.findById(id);

    if (!planAlreadyExists) throw new AppError('Plan with this id does not exist');

    const plan = this.plansRepository.findById(id);

    return plan;
  }
}
