import { Users } from '@prisma/client';

import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';

interface IUsersRepository {
  findByEmailWithRelations(email: string): Promise<Users | null>;
  findByEmailPhoneOrCpf(email: string, phone: string, cpf: string): Promise<Users | null>;
  create(data: ICreateUserDTO): Promise<Users>;
  findAll(): Promise<Users[]>;
  findById(id: string): Promise<Users | null>;
  delete(id: string): Promise<Users>;
  update(id: string, data: IUpdateUserDTO): Promise<Users>;
  registeredUsers(ids: string[]): Promise<boolean>;
  sendPinToUserEmail(email: string, pin: string, pinExpires: Date): Promise<Users>;
  resetPassword(id: string, password: string): Promise<Users>;
}

export default IUsersRepository;
