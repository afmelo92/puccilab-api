/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import { validateEmail } from '@/utils/validators';
import config from '@/etc/config';
import UsersRepository, {
  safeUserSelectSet,
} from '@/repositories/UsersRepository';
import SESMailProvider from '@/providers/email/SESMailProvider';

class SessionsController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email/Password required.',
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Invalid e-mail.',
      });
    }

    const user = await UsersRepository.findByEmail({
      email,
      select: {
        ...safeUserSelectSet,
        password: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Email/Password does not match.',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const passwordMatched = await bcrypt.compare(password, user.password!);

    if (!passwordMatched) {
      return res.status(400).json({
        message: 'Email/Password does not match.',
      });
    }

    const { expiresIn, secret } = config.jwt;

    const token = jwt.sign({}, secret, {
      expiresIn,
      subject: user.uid,
    });

    const result = {
      id: user.uid,
      email: user.email,
      name: user.name,
      cro: user.cro,
      cnpj: user.cnpj,
      phone: user.phone,
      clinic: user.clinic,
      address: user.address,
      role: user.role,
    };

    return res.json({
      message: 'ok',
      data: {
        user: result,
        token,
      },
    });
  }

  async update(req: Request, res: Response) {
    const { email, password, confirm_password } = req.body;
    const { token, id } = req.params;
    const {
      jwt: { secret },
      hash: { salt },
    } = config;

    // Reset password flow
    if (token) {
      if (!password) {
        return res.status(400).json({ message: 'Password required.' });
      }

      if (password !== confirm_password) {
        return res
          .status(400)
          .json({ message: 'Password/Confirm password does not match.' });
      }

      const user = await UsersRepository.findByUID({
        id,
        select: {
          password: true,
        },
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid user.' });
      }

      try {
        jwt.verify(token, `${secret}${user.password}`);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
      }

      const hashedPassword = bcrypt.hashSync(password, salt);

      await UsersRepository.updateUserById({
        id,
        data: {
          password: hashedPassword,
        },
      });

      return res.json({ message: 'Password updated.' });
    }

    // Forgot password flow
    if (!email) {
      return res.status(400).json({
        message: 'E-mail required.',
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Invalid e-mail.',
      });
    }

    const user = await UsersRepository.findByEmail({
      email,
      select: {
        uid: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid e-mail.',
      });
    }

    const forgotPasswordToken = jwt.sign({}, `${secret}${user.password}`, {
      expiresIn: '15m',
    });

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'providers',
      'email',
      'templates',
      'forgot_password.hbs'
    );

    await SESMailProvider.sendMail({
      to: {
        name: user.name!,
        email: user.email!,
      },
      subject: '[Pucci Dental Lab] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name!,
          link: `${config.app.web.url}/forgot-password/${forgotPasswordToken}/${user.uid}`,
        },
      },
    });

    return res.json({ message: 'ok', token: forgotPasswordToken });
  }
}

export default new SessionsController();
