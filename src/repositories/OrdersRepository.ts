import prisma from '@/db';
import { Prisma } from '@prisma/client';
import { safeUserSelectSet } from './UsersRepository';
import { safeProductSelectSet } from './ProductsRepository';

type CreateOrderProps = {
  data: Prisma.OrdersCreateInput;
  select?: Prisma.OrdersSelect;
};

type UpdateOrderProps = {
  uid: string;
  data: Prisma.OrdersCreateInput;
  select?: Prisma.OrdersSelect;
};

type FindAllOrdersByUserUidProps = {
  user_uid: string;
  admin: boolean;
  take?: number;
  skip?: number;
  select?: Prisma.OrdersSelect;
};

type SoftDeleteOrderProps = {
  uid: string;
  select?: Prisma.OrdersSelect;
};

type FindOrderByUidProps = {
  uid: string;
  select?: Prisma.OrdersSelect;
};

const safeOrdersSelectSet = {
  id: false,
  uid: true,
  patient_name: true,
  patient_age: true,
  patient_phone: true,
  patient_sex: true,
  product_id: true,
  deadline: true,
  deadline_period: true,
  final_status: true,
  prepare_color: true,
  final_color: true,
  gum_color: true,
  material: true,
  category: true,
  odgm: true,
  map_a: true,
  map_b: true,
  antagonista: true,
  componentes: true,
  modelo_estudo: true,
  modelo_trabalho: true,
  moldeira: true,
  relacionamento_oclusao: true,
  outros: true,
  aditional_info: true,
  files: true,
  status: true,
  user: {
    select: {
      ...safeUserSelectSet,
    },
  },
  product: {
    select: {
      ...safeProductSelectSet,
    },
  },
};

class OrdersRepository {
  public async findAllOrdersByUserUid({
    user_uid,
    admin,
    take,
    skip,
    select = safeOrdersSelectSet,
  }: FindAllOrdersByUserUidProps) {
    const orders = await prisma.orders.findMany({
      where: {
        user_id: admin ? {} : user_uid,
      },
      select,
      take,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  }

  public async createOrder({
    data,
    select = safeOrdersSelectSet,
  }: CreateOrderProps) {
    const order = await prisma.orders.create({
      data,
      select,
    });

    return order;
  }

  public async softDeleteOrder({
    uid,
    select = safeOrdersSelectSet,
  }: SoftDeleteOrderProps) {
    const order = await prisma.orders.update({
      where: {
        uid,
      },
      data: {
        status: 2,
      },
      select,
    });

    return order;
  }

  public async findOrderByUid({
    uid,
    select = safeOrdersSelectSet,
  }: FindOrderByUidProps) {
    const order = await prisma.orders.findUnique({
      where: {
        uid,
      },
      select,
    });

    return order;
  }

  public async updateOrder({
    uid,
    data,
    select = safeOrdersSelectSet,
  }: UpdateOrderProps) {
    const order = await prisma.orders.update({
      where: {
        uid,
      },
      data,
      select,
    });

    return order;
  }
}

export default new OrdersRepository();
