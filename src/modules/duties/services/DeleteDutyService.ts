import { inject, injectable } from 'tsyringe';

import { Duties } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IDutiesRepository from '../repositories/IDutiesRepository';
import IInvitesRepository from '@modules/invites/repositories/IInvitesRepository';

interface IRequest {
  solicitor_id: string;
  id: string;
}

@injectable()
export default class DeleteUserService {
  constructor(
    @inject('DutiesRepository')
    private dutiesRepository: IDutiesRepository,

    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,
  ) { }

  public async execute({ solicitor_id, id }: IRequest): Promise<Duties> {
    const dutyAlreadyExists = await this.dutiesRepository.findById(id);
    if (!dutyAlreadyExists) throw new AppError('Duty with this id does not exist');

    const isAdm = await this.invitesRepository.isAlreadyAdm(dutyAlreadyExists.group_id, solicitor_id);
    if (!isAdm) throw new AppError('You are not an adm of this group');

    const deletedDuty = this.dutiesRepository.delete(id);

    return deletedDuty;
  }
}
