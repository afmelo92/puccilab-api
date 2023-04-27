import prisma from '@/db';
import { Prisma, Products } from '@prisma/client';

type FindALlProps = {
  take?: number;
  skip?: number;
  select?: Prisma.ProductsSelect;
};

type FindByUIDProps = {
  id: Required<string>;
  select?: Prisma.ProductsSelect;
};

type CreateProductsProps = {
  data: Prisma.ProductsCreateInput;
};

type UpdateProductsProps = {
  id: string;
  data: NonNullable<Partial<Omit<Products, 'createdAt' | 'updatedAt' | 'id'>>>;
  select?: Prisma.ProductsSelect;
};

export const safeProductSelectSet = {
  uid: true,
  title: true,
  description: true,
  materials: true,
  category: true,
  price: true,
  active: true,
};

class ProductsRepository {
  async findAllProducts({
    take,
    skip,
    select = safeProductSelectSet,
  }: FindALlProps) {
    const products = await prisma.products.findMany({
      take,
      skip,
      select,
      orderBy: {
        category: 'desc',
      },
    });

    return products;
  }

  async findProductByUID({
    id,
    select = safeProductSelectSet,
  }: FindByUIDProps) {
    const product = await prisma.products.findUnique({
      where: {
        uid: id,
      },
      select,
    });

    return product;
  }

  async deleteByUID({ id, select = safeProductSelectSet }: FindByUIDProps) {
    const product = await prisma.products.delete({
      where: {
        uid: id,
      },
      select,
    });

    return product;
  }

  async createProduct({ data }: CreateProductsProps) {
    const product = await prisma.products.create({
      data: {
        ...data,
        description: data.description || null,
      },
    });

    return product;
  }

  async updateProductById({
    id,
    data,
    select = safeProductSelectSet,
  }: UpdateProductsProps) {
    const product = await prisma.products.update({
      where: {
        uid: id,
      },
      data,
      select,
    });

    return product;
  }
}

export default new ProductsRepository();
