import prisma from '@/db';
import { Menus, Prisma } from '@prisma/client';

type FindALlProps = {
  take?: number;
  skip?: number;
};

type FindALlByRoleProps = {
  admin: boolean;
};

type CreateMenuProps = {
  data: Prisma.MenusCreateInput;
};

type UpdateMenuProps = {
  id: string;
  data: NonNullable<Partial<Omit<Menus, 'createdAt' | 'updatedAt' | 'id'>>>;
};

type DeleteByUIDProps = {
  id: string;
};

class MenusRepository {
  async findAll({ take, skip }: FindALlProps) {
    const menus = await prisma.menus.findMany({
      take,
      skip,
    });

    return menus;
  }

  async findAllByRole({ admin }: FindALlByRoleProps) {
    const menu = await prisma.menus.findMany({
      where: admin ? {} : { admin: false },
      select: {
        uid: true,
        title: true,
        href: true,
        icon: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return menu;
  }

  async createMenu({ data }: CreateMenuProps) {
    const menu = await prisma.menus.create({
      data,
    });

    return menu;
  }

  async updateMenuById({ id, data }: UpdateMenuProps) {
    const menu = await prisma.menus.update({
      where: {
        uid: id,
      },
      data,
    });

    return menu;
  }

  async deleteByUID({ id }: DeleteByUIDProps) {
    const user = await prisma.products.delete({
      where: {
        uid: id,
      },
    });

    return user;
  }
}

export default new MenusRepository();
