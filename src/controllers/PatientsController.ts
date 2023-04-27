import prisma from '@/db';
import { Request, Response } from 'express';

class PatientsController {
  public async create(req: Request, res: Response) {
    console.log({ body: req.body });
    const {
      name,
      age,
      phone,
      cellphone,
      sex,
      address,
      rg,
      exp_org,
      cpf,
      birth_date,
      civ_status,
      profession,
      email,
    } = req.body;
    const { id } = req.user;

    const patient = await prisma.patients.create({
      data: {
        name,
        age,
        phone,
        cellphone,
        sex,
        address,
        rg,
        exp_org,
        cpf,
        birth_date,
        civ_status,
        profession,
        email,
        doctor_id: id,
      },
    });
    return res.status(201).json({ message: 'ok', data: patient });
  }

  public async index(req: Request, res: Response) {
    return res.json({ message: 'ok', data: [] });
  }
}

export default new PatientsController();
