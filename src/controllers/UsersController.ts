import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import setObjPropertyWithDefaultDescriptors from '@/utils/setObjPropertyWithDefaultDescriptors';
import {
  validateCNPJ,
  validateEmail,
  validatePhone,
  validateUUID,
} from '@/utils/validators';
import config from '@/etc/config';
import UsersRepository, {
  safeUserSelectSet,
} from '@/repositories/UsersRepository';

class UsersController {
  async create(req: Request, res: Response) {
    const { name, email, cro, password, confirm_password } = req.body;

    if (!name || !email || !cro || !password || !confirm_password) {
      return res.status(400).json({
        message: 'All fields required.',
      });
    }

    if (password != confirm_password) {
      return res.status(400).json({
        message: 'Password/Confirm password must match.',
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Invalid e-mail.',
      });
    }

    const checkEmailAlreadyUsed = await UsersRepository.findByEmail({ email });

    if (checkEmailAlreadyUsed) {
      return res.status(400).json({
        message: 'E-mail already used.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, config.hash.salt);

    const newUser = await UsersRepository.createUser({
      data: {
        name,
        email,
        password: hashedPassword,
        cro,
      },
      select: {
        ...safeUserSelectSet,
      },
    });

    return res.status(201).json({
      message: 'ok',
      data: {
        ...newUser,
      },
    });
  }

  async index(req: Request, res: Response) {
    const users = await UsersRepository.findAll({});

    return res.json({
      message: 'ok',
      data: users,
    });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    if (!validateUUID(id)) {
      return res.status(400).json({
        message: 'Invalid id.',
      });
    }

    const user = await UsersRepository.findByUID({
      id,
      select: {
        ...safeUserSelectSet,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    return res.json({
      message: 'ok',
      data: user,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!validateUUID(id)) {
      return res.status(400).json({
        message: 'Invalid id.',
      });
    }

    await UsersRepository.deleteByUID({ id });

    return res.json({
      message: 'ok',
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      name,
      clinic,
      cro,
      cnpj,
      address,
      password,
      confirm_password,
      email,
      phone,
      admin,
    } = req.body;
    const { email: req_email, admin: req_admin } = req.user;

    const updatedUser = {};

    if (!validateUUID(id)) {
      return res.status(400).json({
        message: 'Invalid id.',
      });
    }

    if (password) {
      if (password != confirm_password) {
        return res.status(400).json({
          message: 'Password/Confirm password must match.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, config.hash.salt);

      Object.defineProperty(
        updatedUser,
        'password',
        setObjPropertyWithDefaultDescriptors(hashedPassword)
      );
    }

    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({
          message: 'Invalid e-mail.',
        });
      }

      const checkEmailAlreadyUsed = await UsersRepository.findByEmail({
        email,
      });

      // Verifica se o email enviado é diferente do email do requisitante
      if (checkEmailAlreadyUsed && checkEmailAlreadyUsed.email !== req_email) {
        return res.status(400).json({
          message: 'E-mail already used.',
        });
      }

      Object.defineProperty(
        updatedUser,
        'email',
        setObjPropertyWithDefaultDescriptors(email)
      );
    }

    if (cnpj) {
      if (!validateCNPJ(cnpj)) {
        return res.status(400).json({
          message: 'Invalid CNPJ.',
        });
      }

      Object.defineProperty(
        updatedUser,
        'cnpj',
        setObjPropertyWithDefaultDescriptors(cnpj)
      );
    }

    if (phone) {
      if (!validatePhone(phone)) {
        return res.status(400).json({
          message: 'Invalid Phone.',
        });
      }

      Object.defineProperty(
        updatedUser,
        'phone',
        setObjPropertyWithDefaultDescriptors(phone)
      );
    }

    if (name) {
      Object.defineProperty(
        updatedUser,
        'name',
        setObjPropertyWithDefaultDescriptors(name)
      );
    }

    if (address) {
      Object.defineProperty(
        updatedUser,
        'address',
        setObjPropertyWithDefaultDescriptors(address)
      );
    }

    if (clinic) {
      Object.defineProperty(
        updatedUser,
        'clinic',
        setObjPropertyWithDefaultDescriptors(clinic)
      );
    }

    if (cro) {
      Object.defineProperty(
        updatedUser,
        'cro',
        setObjPropertyWithDefaultDescriptors(cro)
      );
    }

    if (typeof admin === 'boolean' && req_admin) {
      // Apenas admins podem alterar essa propriedade
      Object.defineProperty(
        updatedUser,
        'admin',
        setObjPropertyWithDefaultDescriptors(admin)
      );
    }

    const updated = await UsersRepository.updateUserById({
      id,
      data: updatedUser,
      select: {
        ...safeUserSelectSet,
      },
    });

    return res.json({
      message: 'ok',
      data: {
        id: updated.uid,
        ...updated,
      },
    });
  }
}

export default new UsersController();
