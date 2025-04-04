import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import ReadAllUsersService from '@modules/users/services/ReadAllUsersService';
import ReadUserByIdService from '@modules/users/services/ReadUserByIdService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import { generateUserImageUrl } from '@shared/infra/http/middlewares/GenerateUserImageUrl';
import ReadUserByEmailService from '@modules/users/services/ReadUserByEmailService';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import VerifyPinService from '@modules/users/services/VerifyPinService';
import SendPinToUserService from '@modules/users/services/SendPinToUserEmailService';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      nickname,
      email,
      cpf,
      profession,
      specialization,
      phone,
      password,
      city,
      state,
    } = req.body;

    const image = req.file ? req.file.buffer : undefined;

    console.log(req.file);

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      nickname,
      email,
      cpf,
      profession,
      specialization,
      phone,
      password,
      city,
      state,
      image,
    });

    return res.status(201).json({
      ...user,
      password: undefined,
      image: user ? await generateUserImageUrl(user) : null,
    });
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    const readUsers = container.resolve(ReadAllUsersService);

    const users = await readUsers.execute();

    return res.status(201).json(users?.map((user) => ({
      ...user,
      password: undefined,
      image: undefined,
    })));
  }

  public async sendPin(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendPinToUserEmail = container.resolve(SendPinToUserService);

    const user = await sendPinToUserEmail.execute({
      email,
    });

    return res.status(201).json({ id: user.id });
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const readUser = container.resolve(ReadUserByIdService);

    const user = await readUser.execute({
      id,
    });

    return res.status(201).json({
      ...user,
      password: undefined,
      image: user ? await generateUserImageUrl(user) : null,
    });
  }

  public async readByEmail(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const readUser = container.resolve(ReadUserByEmailService);

    const user = await readUser.execute({
      email,
    });

    return res.status(201).json({
      ...user,
      password: undefined,
      image: user ? await generateUserImageUrl(user) : null,
    });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const {
      name,
      nickname,
      email,
      profession,
      specialization,
      phone,
      password,
      city,
      state,
    } = req.body;

    const image = req.file ? req.file.buffer : undefined;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      id,
      name,
      nickname,
      email,
      profession,
      specialization,
      phone,
      password,
      city,
      state,
      image,
    });

    return res.status(201).json({
      ...user,
      password: undefined,
      image: user ? await generateUserImageUrl(user) : null,
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const deleteUser = container.resolve(DeleteUserService);

    const user = await deleteUser.execute({
      id,
    });

    return res.status(201).json({
      ...user,
      password: undefined,
      image: undefined,
    });
  }

  public async verifyPin(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { pin } = req.body;

    const verifyPin = container.resolve(VerifyPinService);

    const user = await verifyPin.execute({
      id,
      pin,
    });

    return res.status(201).json({ id: user.id });
  }

  public async resetPassword(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { pin, password } = req.body;

    const resetPassword = container.resolve(ResetPasswordService);

    const user = await resetPassword.execute({ id, pin, password });

    return res.status(201).json({ id: user.id });
  }
}
