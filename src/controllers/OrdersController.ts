import { Request, Response } from 'express';
import fs from 'node:fs/promises';
import { compareAsc } from 'date-fns';
import { validatePhone, validateUUID } from '@/utils/validators';
import { colorScale, mapColorScale } from 'etc/constants';
import ProductsRepository from '@/repositories/ProductsRepository';
import S3StorageProvider from '@/providers/S3StorageProvider';
import OrdersRepository from '@/repositories/OrdersRepository';

class OrdersController {
  public async create(req: Request, res: Response) {
    const files = req.files as Array<Express.Multer.File>;

    const { id } = req.user;
    const {
      customer_name,
      customer_age,
      customer_phone,
      customer_sex,
      service_id,
      service_material,
      service_deadline,
      service_deadline_period,
      service_final_status,
      service_prepare_color,
      service_final_color,
      service_gum_color,
      odgm_result,
      map1_result,
      map2_result,
      antagonista,
      componentes,
      modelo_estudo,
      modelo_trabalho,
      moldeira,
      relacionamento_oclusao,
      outros,
      aditional_info,
    } = req.body;

    if (!customer_name || !customer_age || !customer_phone || !customer_sex) {
      return res.status(400).json({ message: 'Customer data required.' });
    }

    const verifiedCustomerAge = Number(customer_age);

    if (
      Number.isNaN(verifiedCustomerAge) ||
      verifiedCustomerAge < 1 ||
      verifiedCustomerAge > 120
    ) {
      return res.status(400).json({ message: 'Invalid age.' });
    }

    if (!validatePhone(customer_phone)) {
      return res.status(400).json({ message: 'Invalid phone.' });
    }

    if (customer_sex !== 'M' && customer_sex !== 'F') {
      return res.status(400).json({ message: 'Invalid sex.' });
    }

    if (
      !service_id ||
      !service_deadline ||
      !service_deadline_period ||
      !service_final_status ||
      !service_prepare_color ||
      !service_final_color ||
      !odgm_result
    ) {
      return res.status(400).json({ message: 'Service data required.' });
    }

    if (!validateUUID(service_id)) {
      return res.status(400).json({ message: 'Invalid service id.' });
    }

    const verifiedServiceDeadlineDate = new Date(service_deadline);

    if (compareAsc(verifiedServiceDeadlineDate, new Date()) < 0) {
      return res.status(400).json({ message: 'Invalid deadline.' });
    }

    if (service_deadline_period !== 'M' && service_deadline_period !== 'T') {
      return res.status(400).json({ message: 'Invalid deadline period.' });
    }

    if (service_final_status !== 'S' && service_final_status !== 'N') {
      return res.status(400).json({ message: 'Invalid service final status.' });
    }

    if (!colorScale.includes(service_prepare_color)) {
      return res.status(400).json({ message: 'Invalid prepare color.' });
    }

    if (!colorScale.includes(service_final_color)) {
      return res.status(400).json({ message: 'Invalid final color.' });
    }

    // validar service_gum_color

    const checkServiceExists = await ProductsRepository.findProductByUID({
      id: service_id,
    });

    if (!checkServiceExists) {
      return res.status(400).json({ message: 'Invalid service' });
    }

    let verifiedServiceMaterial = null;

    if (checkServiceExists.category !== 'Outros') {
      if (!checkServiceExists.materials?.includes(service_material)) {
        return res.status(400).json({ message: 'Invalid service material.' });
      }
      verifiedServiceMaterial = service_material;
    }

    const verifiedODGM = odgm_result.split(',');

    if (
      !verifiedODGM.every(
        (val: number) =>
          (val >= 11 && val <= 18) ||
          (val >= 21 && val <= 28) ||
          (val >= 31 && val <= 38) ||
          (val >= 41 && val <= 48)
      )
    ) {
      return res.status(400).json({ message: 'Invalid odontogram item(s)' });
    }

    const verifiedMapA = map1_result.split(',');

    if (
      verifiedMapA.length !== 9 ||
      !verifiedMapA.every((val: (typeof mapColorScale)[number]) =>
        mapColorScale.includes(val)
      )
    ) {
      return res.status(400).json({ message: 'Invalid tooth map A' });
    }

    const verifiedMapB = map2_result.split(',');

    if (
      verifiedMapB.length !== 9 ||
      !verifiedMapB.every((val: (typeof mapColorScale)[number]) =>
        mapColorScale.includes(val)
      )
    ) {
      return res.status(400).json({ message: 'Invalid tooth map B' });
    }

    const verifiedAntagonista = Number(antagonista);

    if (
      (antagonista && Number.isNaN(verifiedAntagonista)) ||
      verifiedAntagonista < 0
    ) {
      return res.status(400).json({ message: 'Invalid antagonista.' });
    }

    const verifiedComponentes = Number(componentes);

    if (
      (componentes && Number.isNaN(verifiedComponentes)) ||
      verifiedComponentes < 0
    ) {
      return res.status(400).json({ message: 'Invalid componentes.' });
    }

    const verfiedModeloEstudo = Number(modelo_estudo);

    if (
      (modelo_estudo && Number.isNaN(verfiedModeloEstudo)) ||
      verfiedModeloEstudo < 0
    ) {
      return res.status(400).json({ message: 'Invalid modelo_estudo.' });
    }

    const verifiedModeloTrabalho = Number(modelo_trabalho);

    if (
      (modelo_trabalho && Number.isNaN(verifiedModeloTrabalho)) ||
      verifiedModeloTrabalho < 0
    ) {
      return res.status(400).json({ message: 'Invalid modelo_trabalho.' });
    }

    const verifiedMoldeira = Number(moldeira);

    if ((moldeira && Number.isNaN(verifiedMoldeira)) || verifiedMoldeira < 0) {
      return res.status(400).json({ message: 'Invalid moldeira.' });
    }

    const verifiedRelacionamentoOclusao = Number(relacionamento_oclusao);

    if (
      (relacionamento_oclusao && Number.isNaN(verifiedRelacionamentoOclusao)) ||
      verifiedRelacionamentoOclusao < 0
    ) {
      return res
        .status(400)
        .json({ message: 'Invalid relacionamento_oclusao.' });
    }

    const verifiedOutros = Number(outros);

    if ((outros && Number.isNaN(verifiedOutros)) || verifiedOutros < 0) {
      return res.status(400).json({ message: 'Invalid outros.' });
    }

    const filesUrls: string[] = [];

    if (files && files.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, file] of files.entries()) {
        const buffer = await fs.readFile(file.path);
        const filePath = `${id}/${file.filename}`;

        await S3StorageProvider.store({
          filePath,
          data: buffer,
          contentType: file.mimetype,
        });

        filesUrls.push(filePath);

        await fs.rm(file.path);
      }
    }

    const createOrderData = {
      user_id: id,
      patient_name: customer_name,
      patient_age: verifiedCustomerAge,
      patient_phone: customer_phone,
      patient_sex: customer_sex,
      product_id: service_id,
      deadline: verifiedServiceDeadlineDate.toISOString(),
      deadline_period: service_deadline_period,
      final_status: service_final_status === 'S',
      prepare_color: service_prepare_color,
      final_color: service_final_color,
      gum_color: service_gum_color,
      material: verifiedServiceMaterial,
      category: checkServiceExists.category || 'Outros',
      odgm: verifiedODGM,
      map_a: verifiedMapA,
      map_b: verifiedMapB,
      antagonista: verifiedAntagonista || 0,
      componentes: verifiedComponentes || 0,
      modelo_estudo: verfiedModeloEstudo || 0,
      modelo_trabalho: verifiedModeloTrabalho || 0,
      moldeira: verifiedMoldeira || 0,
      relacionamento_oclusao: verifiedRelacionamentoOclusao || 0,
      outros: verifiedOutros || 0,
      aditional_info: aditional_info || null,
      files: filesUrls,
    };

    await OrdersRepository.createOrder({
      data: createOrderData,
    });

    return res.status(201).json({ message: 'Order created.' });
  }

  public async index(req: Request, res: Response) {
    const { id, admin } = req.user;

    const orders = await OrdersRepository.findAllOrdersByUserUid({
      user_uid: id,
      admin,
    });

    return res.json({
      message: 'ok',
      data: orders,
    });
  }

  public async show(req: Request, res: Response) {
    const { id: order_id } = req.params;
    const { admin, id: request_user_id } = req.user;

    if (!validateUUID(order_id)) {
      return res.status(400).json({ message: 'Invalid order id.' });
    }

    const order = await OrdersRepository.findOrderByUid({
      uid: order_id,
    });

    if (!order) {
      return res.status(400).json({ message: 'Invalid order.' });
    }

    if (request_user_id !== order.user?.uid && !admin) {
      return res.status(403).json({
        message: 'Unauthorized.',
      });
    }

    return res.json({ message: 'ok', data: order });
  }

  public async delete(req: Request, res: Response) {
    const { id: request_user_id, admin } = req.user;
    const { id: order_id } = req.params;

    if (!validateUUID(order_id)) {
      return res.status(400).json({ message: 'Invalid order id.' });
    }

    const order = await OrdersRepository.findOrderByUid({
      uid: order_id,
    });

    if (!order) {
      return res.status(400).json({ message: 'Invalid order.' });
    }

    if (request_user_id !== order.user?.uid && !admin) {
      return res.status(403).json({
        message: 'Unauthorized.',
      });
    }

    await OrdersRepository.softDeleteOrder({ uid: order_id });

    return res.status(204).end();
  }

  public async update(req: Request, res: Response) {
    const files = req.files as Array<Express.Multer.File>;

    const { id: order_id } = req.params;
    const { admin, id: request_user_id } = req.user;
    const {
      customer_name,
      customer_age,
      customer_phone,
      customer_sex,
      service_id,
      service_material,
      service_deadline,
      service_deadline_period,
      service_final_status,
      service_prepare_color,
      service_final_color,
      service_gum_color,
      odgm_result,
      map1_result,
      map2_result,
      antagonista,
      componentes,
      modelo_estudo,
      modelo_trabalho,
      moldeira,
      relacionamento_oclusao,
      outros,
      aditional_info,
      status,
      deleted_files,
    } = req.body;

    if (!validateUUID(order_id)) {
      return res.status(400).json({ message: 'Invalid order id.' });
    }

    const checkOrderExists = await OrdersRepository.findOrderByUid({
      uid: order_id,
      select: {
        status: true,
        user: true,
        files: true,
      },
    });

    if (!checkOrderExists) {
      return res.status(400).json({ message: 'Invalid order.' });
    }

    if (request_user_id !== checkOrderExists.user?.uid && !admin) {
      return res.status(403).json({
        message: 'Unauthorized.',
      });
    }

    const verifiedStatus = Number(status);

    if (verifiedStatus !== checkOrderExists.status && !admin) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    if (
      checkOrderExists.status === 5 ||
      checkOrderExists.status === 2 ||
      (checkOrderExists.status === 1 && !admin)
    ) {
      return res.status(400).json({ message: 'Uneditable order.' });
    }

    if (!customer_name || !customer_age || !customer_phone || !customer_sex) {
      return res.status(400).json({ message: 'Customer data required.' });
    }

    const verifiedCustomerAge = Number(customer_age);

    if (
      Number.isNaN(verifiedCustomerAge) ||
      verifiedCustomerAge < 1 ||
      verifiedCustomerAge > 120
    ) {
      return res.status(400).json({ message: 'Invalid age.' });
    }

    if (!validatePhone(customer_phone)) {
      return res.status(400).json({ message: 'Invalid phone.' });
    }

    if (customer_sex !== 'M' && customer_sex !== 'F') {
      return res.status(400).json({ message: 'Invalid sex.' });
    }

    if (
      !service_id ||
      !service_deadline ||
      !service_deadline_period ||
      !service_final_status ||
      !service_prepare_color ||
      !service_final_color ||
      !odgm_result
    ) {
      return res.status(400).json({ message: 'Service data required.' });
    }

    if (!validateUUID(service_id)) {
      return res.status(400).json({ message: 'Invalid service id.' });
    }

    const verifiedServiceDeadlineDate = new Date(service_deadline);

    if (compareAsc(verifiedServiceDeadlineDate, new Date()) < 0) {
      return res.status(400).json({ message: 'Invalid deadline.' });
    }

    if (service_deadline_period !== 'M' && service_deadline_period !== 'T') {
      return res.status(400).json({ message: 'Invalid deadline period.' });
    }

    if (service_final_status !== 'S' && service_final_status !== 'N') {
      return res.status(400).json({ message: 'Invalid service final status.' });
    }

    if (!colorScale.includes(service_prepare_color)) {
      return res.status(400).json({ message: 'Invalid prepare color.' });
    }

    if (!colorScale.includes(service_final_color)) {
      return res.status(400).json({ message: 'Invalid final color.' });
    }

    // validar service_gum_color

    const checkServiceExists = await ProductsRepository.findProductByUID({
      id: service_id,
    });

    if (!checkServiceExists) {
      return res.status(400).json({ message: 'Invalid service.' });
    }

    let verifiedServiceMaterial = null;

    if (checkServiceExists.category !== 'Outros') {
      if (!checkServiceExists.materials?.includes(service_material)) {
        return res.status(400).json({ message: 'Invalid service material.' });
      }
      verifiedServiceMaterial = service_material;
    }

    const verifiedODGM = odgm_result.split(',');

    if (
      !verifiedODGM.every(
        (val: number) =>
          (val >= 11 && val <= 18) ||
          (val >= 21 && val <= 28) ||
          (val >= 31 && val <= 38) ||
          (val >= 41 && val <= 48)
      )
    ) {
      return res.status(400).json({ message: 'Invalid odontogram item(s)' });
    }

    const verifiedMapA = map1_result.split(',');

    if (
      verifiedMapA.length !== 9 ||
      !verifiedMapA.every((val: (typeof mapColorScale)[number]) =>
        mapColorScale.includes(val)
      )
    ) {
      return res.status(400).json({ message: 'Invalid tooth map A' });
    }

    const verifiedMapB = map2_result.split(',');

    if (
      verifiedMapB.length !== 9 ||
      !verifiedMapB.every((val: (typeof mapColorScale)[number]) =>
        mapColorScale.includes(val)
      )
    ) {
      return res.status(400).json({ message: 'Invalid tooth map B' });
    }

    const verifiedAntagonista = Number(antagonista);

    if (
      (antagonista && Number.isNaN(verifiedAntagonista)) ||
      verifiedAntagonista < 0
    ) {
      return res.status(400).json({ message: 'Invalid antagonista.' });
    }

    const verifiedComponentes = Number(componentes);

    if (
      (componentes && Number.isNaN(verifiedComponentes)) ||
      verifiedComponentes < 0
    ) {
      return res.status(400).json({ message: 'Invalid componentes.' });
    }

    const verfiedModeloEstudo = Number(modelo_estudo);

    if (
      (modelo_estudo && Number.isNaN(verfiedModeloEstudo)) ||
      verfiedModeloEstudo < 0
    ) {
      return res.status(400).json({ message: 'Invalid modelo_estudo.' });
    }

    const verifiedModeloTrabalho = Number(modelo_trabalho);

    if (
      (modelo_trabalho && Number.isNaN(verifiedModeloTrabalho)) ||
      verifiedModeloTrabalho < 0
    ) {
      return res.status(400).json({ message: 'Invalid modelo_trabalho.' });
    }

    const verifiedMoldeira = Number(moldeira);

    if ((moldeira && Number.isNaN(verifiedMoldeira)) || verifiedMoldeira < 0) {
      return res.status(400).json({ message: 'Invalid moldeira.' });
    }

    const verifiedRelacionamentoOclusao = Number(relacionamento_oclusao);

    if (
      (relacionamento_oclusao && Number.isNaN(verifiedRelacionamentoOclusao)) ||
      verifiedRelacionamentoOclusao < 0
    ) {
      return res
        .status(400)
        .json({ message: 'Invalid relacionamento_oclusao.' });
    }

    const verifiedOutros = Number(outros);

    if ((outros && Number.isNaN(verifiedOutros)) || verifiedOutros < 0) {
      return res.status(400).json({ message: 'Invalid outros.' });
    }

    let filesUrls: string[] = checkOrderExists?.files || [];

    const splittedDeletedFiles = deleted_files
      .split(',')
      .filter((item: string) => Boolean(item));

    if (splittedDeletedFiles.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const file of splittedDeletedFiles) {
        await S3StorageProvider.remove({
          filePath: file,
        });

        filesUrls = filesUrls.filter((item) => item !== file);
      }
    }

    if (files && files.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, file] of files.entries()) {
        const buffer = await fs.readFile(file.path);
        const filePath = `${checkOrderExists.user?.uid}/${file.filename}`;

        await S3StorageProvider.store({
          filePath,
          data: buffer,
          contentType: file.mimetype,
        });

        filesUrls.push(filePath);

        await fs.rm(file.path);
      }
    }

    const updateOrderData = {
      patient_name: customer_name,
      patient_age: verifiedCustomerAge,
      patient_phone: customer_phone,
      patient_sex: customer_sex,
      product_id: service_id,
      deadline: verifiedServiceDeadlineDate.toISOString(),
      deadline_period: service_deadline_period,
      final_status: service_final_status === 'S',
      prepare_color: service_prepare_color,
      final_color: service_final_color,
      gum_color: service_gum_color,
      material: verifiedServiceMaterial,
      category: checkServiceExists.category || 'Outros',
      odgm: verifiedODGM,
      map_a: verifiedMapA,
      map_b: verifiedMapB,
      antagonista: verifiedAntagonista || 0,
      componentes: verifiedComponentes || 0,
      modelo_estudo: verfiedModeloEstudo || 0,
      modelo_trabalho: verifiedModeloTrabalho || 0,
      moldeira: verifiedMoldeira || 0,
      relacionamento_oclusao: verifiedRelacionamentoOclusao || 0,
      outros: verifiedOutros || 0,
      aditional_info: aditional_info || null,
      files: filesUrls,
      status: verifiedStatus,
    };

    await OrdersRepository.updateOrder({
      uid: order_id,
      data: updateOrderData,
    });

    return res.json({ message: 'Order updated.' });
  }
}

export default new OrdersController();
