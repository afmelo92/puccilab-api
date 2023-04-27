import { Request, Response } from 'express';
import setObjPropertyWithDefaultDescriptors from '@/utils/setObjPropertyWithDefaultDescriptors';
import { validateUUID } from '@/utils/validators';
import ProductsRepository from '@/repositories/ProductsRepository';

class ProductsController {
  async create(req: Request, res: Response) {
    const { title, description, materials, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        message: 'Title/Category required.',
      });
    }

    const product = await ProductsRepository.createProduct({
      data: {
        title,
        description,
        materials,
        category,
      },
    });

    res.status(201).json({
      message: 'ok',
      data: {
        ...product,
      },
    });
  }

  async index(req: Request, res: Response) {
    const products = await ProductsRepository.findAllProducts({});

    return res.json({
      message: 'ok',
      data: products,
    });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    if (!validateUUID(id)) {
      return res.status(400).json({
        message: 'Invalid id.',
      });
    }

    const product = await ProductsRepository.findProductByUID({
      id,
    });

    return res.json({
      message: 'ok',
      data: product,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!validateUUID(id)) {
      return res.status(400).json({
        message: 'Invalid id.',
      });
    }

    await ProductsRepository.deleteByUID({
      id,
    });

    return res.json({
      message: 'ok',
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, materials, price, active, category } = req.body;
    const updatedProduct = {};

    if (!validateUUID(id)) {
      return res.status(400).json({
        message: 'Invalid id.',
      });
    }

    if (title) {
      Object.defineProperty(
        updatedProduct,
        'title',
        setObjPropertyWithDefaultDescriptors(title)
      );
    }

    if (description) {
      Object.defineProperty(
        updatedProduct,
        'description',
        setObjPropertyWithDefaultDescriptors(description)
      );
    }

    if (materials) {
      Object.defineProperty(
        updatedProduct,
        'materials',
        setObjPropertyWithDefaultDescriptors(materials)
      );
    }

    if (price) {
      Object.defineProperty(
        updatedProduct,
        'price',
        setObjPropertyWithDefaultDescriptors(price)
      );
    }

    if (category) {
      Object.defineProperty(
        updatedProduct,
        'category',
        setObjPropertyWithDefaultDescriptors(category)
      );
    }

    if (typeof active === 'boolean') {
      Object.defineProperty(
        updatedProduct,
        'active',
        setObjPropertyWithDefaultDescriptors(active)
      );
    }

    const updated = await ProductsRepository.updateProductById({
      id,
      data: updatedProduct,
    });

    return res.json({
      message: 'ok',
      data: {
        ...updated,
      },
    });
  }
}

export default new ProductsController();
