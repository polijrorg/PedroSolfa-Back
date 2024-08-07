import { inject, injectable } from 'tsyringe';
import { Plans } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import IPlansRepository from '../repositories/IPlansRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class DeletePlanService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) { }

  public async execute({ id }: IRequest): Promise<Plans> {
    const planAlreadyExists = await this.plansRepository.findById(id);

    if (!planAlreadyExists) throw new AppError('Plan with this id does not exist');

    const deletedPlan = this.plansRepository.delete(id);

    return deletedPlan;
  }
}
