import { Prisma, Users } from '@prisma/client';
import prisma from '@/db';

type FindALlProps = {
  take?: number;
  skip?: number;
  select?: Prisma.UsersSelect;
};

type FindByUIDProps = {
  id: Required<string>;
  select?: Prisma.UsersSelect;
};

type FindByEmailProps = {
  email: Required<string>;
  select?: Prisma.UsersSelect;
};

type CreateUserProps = {
  data: Prisma.UsersCreateInput;
  select?: Prisma.UsersSelect;
};

type UpdateUserProps = {
  id: string;
  data: NonNullable<Partial<Omit<Users, 'createdAt' | 'updatedAt' | 'id'>>>;
  select?: Prisma.UsersSelect;
};

export const semiSafeUserSelectSet = {
  uid: true,
  name: true,
  email: true,
  active: true,
  admin: true,
  address: true,
  clinic: true,
  cnpj: true,
  cro: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
};

export const safeUserSelectSet = {
  uid: true,
  name: true,
  email: true,
  active: true,
  address: true,
  clinic: true,
  cnpj: true,
  cro: true,
  phone: true,
};

class UsersRepository {
  async findAll({ take, skip, select = safeUserSelectSet }: FindALlProps) {
    const users = await prisma.users.findMany({
      take,
      skip,
      select,
    });

    return users;
  }

  async findByEmail({ email, select = safeUserSelectSet }: FindByEmailProps) {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
      select,
    });

    return user;
  }

  async findByUID({ id, select = safeUserSelectSet }: FindByUIDProps) {
    const user = await prisma.users.findUnique({
      where: {
        uid: id,
      },
      select,
    });

    return user;
  }

  async deleteByUID({ id, select = safeUserSelectSet }: FindByUIDProps) {
    const user = await prisma.users.delete({
      where: {
        uid: id,
      },
      select,
    });

    return user;
  }

  async createUser({ data, select = safeUserSelectSet }: CreateUserProps) {
    const user = await prisma.users.create({
      data,
      select,
    });

    return user;
  }

  async updateUserById({
    id,
    data,
    select = safeUserSelectSet,
  }: UpdateUserProps) {
    const user = await prisma.users.update({
      where: {
        uid: id,
      },
      data,
      select,
    });

    return user;
  }
}

export default new UsersRepository();
