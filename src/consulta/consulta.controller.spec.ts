import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { ConsultaController } from './consulta.controller.js';
import { ConsultaService } from './consulta.service.js';

describe('ConsultaController', () => {
  let controller: ConsultaController;
  let service: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    service = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultaController],
      providers: [{ provide: ConsultaService, useValue: service }],
    }).compile();

    controller = module.get<ConsultaController>(ConsultaController);
  });

  it('passes appointment creation data to the service', async () => {
    const dto = {
      codigoAtendimento: 'ATD-0001',
      pacienteId: '665f1a2b3c4d5e6f78901234',
      medicoId: '665f1a2b3c4d5e6f78901235',
      valorCobrado: 250,
      status: 'Agendada',
    };
    const consulta = { _id: 'appointment-id', ...dto };
    service.create.mockResolvedValue(consulta);

    await expect(controller.create(dto)).resolves.toBe(consulta);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('passes appointment filters to the service', async () => {
    const filters = {
      status: 'Agendada',
      minValor: 100,
      maxValor: 300,
      page: 1,
      limit: 10,
    };
    const consultas = [{ _id: 'appointment-id', status: 'Agendada' }];
    service.findAll.mockResolvedValue(consultas);

    await expect(controller.findAll(filters)).resolves.toBe(consultas);
    expect(service.findAll).toHaveBeenCalledWith(filters);
  });

  it('passes the appointment ID to the service', async () => {
    const consulta = { _id: 'appointment-id', status: 'Agendada' };
    service.findOne.mockResolvedValue(consulta);

    await expect(controller.findOne('appointment-id')).resolves.toBe(consulta);
    expect(service.findOne).toHaveBeenCalledWith('appointment-id');
  });
});
