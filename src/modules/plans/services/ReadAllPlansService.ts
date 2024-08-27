import { inject, injectable } from 'tsyringe';

import { Plans } from '@prisma/client';

import IPlansRepository from '../repositories/IPlansRepository';

@injectable()
export default class ReadAllPlansService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) { }

  public async execute(): Promise<Plans[] | null> {

    const plans = this.plansRepository.findAll();

    return plans;
  }
}
