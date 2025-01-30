import { inject, injectable } from 'tsyringe';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
}

@injectable()
export default class ReadUserByEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({ email }: IRequest): Promise<Users | null> {
    const userAlreadyExists = await this.usersRepository.findByEmailWithRelations(email);

    if (!userAlreadyExists) throw new AppError('User with this email does not exist');

    return userAlreadyExists;
  }
}
