import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import ReadAllUsersService from '@modules/users/services/ReadAllUsersService';
import ReadUserByIdService from '../../../services/ReadUserByIdService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';

export default class UserController {
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
    });

    user.password = '###';

    return res.status(201).json(user);
  }

  public async readAll(req: Request, res: Response): Promise<Response> {

    const readUsers = container.resolve(ReadAllUsersService);

    const users = await readUsers.execute();

    if(users) {
        users.forEach(user => {
        user.password = '###';
      });
    }
    return res.status(201).json(users);
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const readUser = container.resolve(ReadUserByIdService);

    const user = await readUser.execute({
      id,
    });

    if(user){
      user.password = '###';
    }

    return res.status(201).json(user);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

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
    });

    user.password = '###';

    return res.status(201).json(user);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteUser = container.resolve(DeleteUserService);

    const user = await deleteUser.execute({
      id,
    });

    user.password = '###';

    return res.status(201).json(user);
  }
}
