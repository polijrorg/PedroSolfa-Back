import { Groups } from '@prisma/client';

import ICreateInviteDTO from '../dtos/ICreateInviteDTO';

interface IInvitesRepository {
  findByEmail(group_id: string, email: string): Promise<Groups | null>;
  findGroupById(group_id: string): Promise<Groups | null>;
  create(data: ICreateInviteDTO): Promise<Groups>;
  findAll(): Promise<Groups[]>;
  delete(group_id: string, email: string): Promise<Groups>;
  updateInvites(email: string): Promise<Groups[]>;
  acceptInvite(group_id: string, user_id: string): Promise<Groups>;
  isAlreadyUser(group_id: string, user_id: string): Promise<Groups | null>;
  isAlreadyAdm(group_id: string, id: string): Promise<Groups | null>;
  turnIntoAdm(group_id: string, user_id: string): Promise<Groups>;
  defaultAdm(group_id: string, user_id: string): Promise<Groups>;
  readInvitesByUser(user_id: string): Promise<Groups[]>;
}

export default IInvitesRepository;
