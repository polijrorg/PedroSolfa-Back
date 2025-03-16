import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import ReadAllUsersService from '@modules/users/services/ReadAllUsersService';
import ReadUserByIdService from '@modules/users/services/ReadUserByIdService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import { generateUserImageUrl } from '@shared/infra/http/middlewares/GenerateUserImageUrl';
import ReadUserByEmailService from '@modules/users/services/ReadUserByEmailService';

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
}
