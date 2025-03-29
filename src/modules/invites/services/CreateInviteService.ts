import { inject, injectable } from 'tsyringe';

import { Groups } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import sgMail from '@sendgrid/mail';
import IInvitesRepository from '../repositories/IInvitesRepository';

interface IRequest {
  id: string;
  group_id: string;
  email: string;
}

@injectable()
export default class CreateInviteService {
  constructor(
    @inject('InvitesRepository')
    private invitesRepository: IInvitesRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    id, group_id, email,
  }: IRequest): Promise<Groups> {
    const groupExists = await this.groupsRepository.findById(group_id);
    if (!groupExists) throw new AppError('Group with this id does not exist');

    const inviteAlreadyExists = await this.invitesRepository.findByEmail(group_id, email);
    if (inviteAlreadyExists) throw new AppError('An invite was already sent to this email');

    const isAlreadyUser = await this.invitesRepository.isAlreadyUser(group_id, email);
    if (isAlreadyUser) throw new AppError('This user is already a member of this group');

    const user = await this.usersRepository.findByEmailWithRelations(email);
    if (user) {
      const isAlreadyAdm = await this.invitesRepository.isAlreadyAdm(group_id, user.id);
      if (isAlreadyAdm) throw new AppError('This user is already an adm of this group');
    }

    const isAdm = await this.invitesRepository.isAlreadyAdm(group_id, id);
    if (!isAdm) throw new AppError('You are not an adm of this group');

    const groupIsFull = await this.groupsRepository.groupIsFull(group_id);
    if (groupIsFull) throw new AppError('This group is full');

    const invite = this.invitesRepository.create({
      group_id,
      email,
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const msg = {
      to: email,
      from: 'tassyla.lima@polijunior.com.br',
      subject: `esKlando | Convite para participar do grupo ${groupExists.name}`,
      text: `<div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h1 style="font-size: 24px; color: #0056b3;">Olá!</h1>
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
        Você foi convidad@ para participar do grupo <strong>${groupExists.name}</strong> no esKlando.
        Acesse o link abaixo para se juntar ao grupo:
      </p>
      <a href="xxxxx" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
        Junte-se ao grupo
      </a>
    </div>`,
      html: `<div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h1 style="font-size: 24px; color: #0056b3;">Olá!</h1>
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
        Você foi convidad@ para participar do grupo <strong>${groupExists.name}</strong> no esKlando.
        Acesse o link abaixo para se juntar ao grupo:
      </p>
      <a href="xxxxx" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
        Junte-se ao grupo
      </a>
    </div>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent');
    } catch (error: any) {
      console.error(error);
    }

    return invite;
  }
}
