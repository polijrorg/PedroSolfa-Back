import { inject, injectable } from 'tsyringe';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    id: string;
    name: string;
    nickname: string;
    email: string;
    profession: string;
    specialization: string;
    phone: string;
    password: string;
    city: string;
    state: string;
  }

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

public async execute({
  id, name, nickname, email, profession, specialization, phone, password, city, state,
}: IRequest): Promise<Users> {
    const userAlreadyExists = await this.usersRepository.findById(id);

    if (!userAlreadyExists) throw new AppError('User with this id does not exist');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const updatedUser = this.usersRepository.update(
    id,
    {
      name,
      nickname,
      email: email.toLowerCase(),
      profession,
      specialization,
      phone,
      password: hashedPassword,
      city,
      state,
    });

    return updatedUser;
  }
}
