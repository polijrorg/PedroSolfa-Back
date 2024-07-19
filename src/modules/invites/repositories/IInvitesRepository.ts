import { Groups } from '@prisma/client';

import ICreateInviteDTO from '../dtos/ICreateInviteDTO';

interface IInvitesRepository {
  findByEmail(group_id: string, email: string): Promise<Groups | null>;
  findGroupById(group_id: string): Promise<Groups | null>;
  create(data: ICreateInviteDTO): Promise<Groups>;
  findAll(): Promise<Groups[]>;
  delete(group_id: string, email: string): Promise<Groups>;
}

export default IInvitesRepository;
