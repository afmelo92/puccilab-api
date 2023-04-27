import MenusRepository from '@/repositories/MenusRepository';
import setObjPropertyWithDefaultDescriptors from '@/utils/setObjPropertyWithDefaultDescriptors';
import { validateUUID } from '@/utils/validators';
import { Request, Response } from 'express';

class MenuController {
  async index(req: Request, res: Response) {
    const { admin } = req.user;

    const menus = await MenusRepository.findAllByRole({ admin });

    return res.json({
      message: 'ok',
      data: menus,
    });
  }

  async create(req: Request, res: Response) {
    const { title, href, icon, admin } = req.body;

    if (!title || !href || !icon || typeof admin !== 'boolean') {
      return res.status(400).json({ message: 'All fields required.' });
    }

    const menu = await MenusRepository.createMenu({
      data: {
        title,
        href,
        icon,
        admin,
      },
    });

    return res.status(201).json(menu);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, href, icon, admin } = req.body;
    const updatedMenu = {};

    if (!validateUUID(id)) {
      return res.status(400).json({
        message: 'Invalid id.',
      });
    }

    if (title) {
      Object.defineProperty(
        updatedMenu,
        'title',
        setObjPropertyWithDefaultDescriptors(title)
      );
    }

    if (href) {
      Object.defineProperty(
        updatedMenu,
        'href',
        setObjPropertyWithDefaultDescriptors(href)
      );
    }

    if (icon) {
      Object.defineProperty(
        updatedMenu,
        'icon',
        setObjPropertyWithDefaultDescriptors(icon)
      );
    }

    if (typeof admin === 'boolean') {
      Object.defineProperty(
        updatedMenu,
        'admin',
        setObjPropertyWithDefaultDescriptors(admin)
      );
    }

    const updated = await MenusRepository.updateMenuById({
      id,
      data: updatedMenu,
    });

    return res.json({
      message: 'ok',
      data: {
        ...updated,
      },
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!validateUUID(id)) {
      return res.status(400).json({
        message: 'Invalid id.',
      });
    }

    await MenusRepository.deleteByUID({
      id,
    });

    return res.json({
      message: 'ok',
    });
  }
}

export default new MenuController();
