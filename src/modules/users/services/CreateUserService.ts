import { inject, injectable } from 'tsyringe';
import path from 'path';

import { Users } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IInvitesRepository from '@modules/invites/repositories/IInvitesRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  nickname: string;
  email: string;
  cpf: string;
  profession: string;
  specialization: string;
  phone: string;
  password: string;
  city: string;
  state: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) { }

  public async execute({
    name, nickname, email, cpf, profession, specialization, phone, password, city, state,
  }: IRequest): Promise<Users> {
    const userAlreadyExists = await this.usersRepository.findByEmailPhoneOrCpf(email, phone, cpf);

    if (userAlreadyExists) throw new AppError('User with same name, phone or cpf already exists');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      nickname,
      email: email.toLowerCase(),
      cpf,
      profession,
      specialization,
      phone,
      password: hashedPassword,
      city,
      state,
    });

    await this.invitesRepository.updateInvites(email);

    const templateDataFile = path.resolve(__dirname, '..', 'views', 'create_account.hbs');

    await this.mailProvider.sendMail({
      to: {
        name,
        email,
      },
      subject: 'Criação de conta',
      templateData: {
        file: templateDataFile,
        variables: { name },
      },
    });

    return user;
  }
}
