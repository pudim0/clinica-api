import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { MedicoController } from './medico.controller.js';
import { MedicoService } from './medico.service.js';

describe('MedicoController', () => {
  let controller: MedicoController;
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
      controllers: [MedicoController],
      providers: [{ provide: MedicoService, useValue: service }],
    }).compile();

    controller = module.get<MedicoController>(MedicoController);
  });

  it('passes doctor creation data to the service', async () => {
    const dto = {
      crm: 'CRM12345',
      nome: 'Carlos Souza',
      especialidade: 'Cardiologia',
      valorConsulta: 250,
    };
    const medico = { _id: 'doctor-id', ...dto };
    service.create.mockResolvedValue(medico);

    await expect(controller.create(dto)).resolves.toBe(medico);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('passes doctor filters to the service', async () => {
    const filters = {
      especialidade: 'Cardiologia',
      minValor: 100,
      maxValor: 300,
      page: 1,
      limit: 10,
    };
    const medicos = [{ _id: 'doctor-id', nome: 'Carlos Souza' }];
    service.findAll.mockResolvedValue(medicos);

    await expect(controller.findAll(filters)).resolves.toBe(medicos);
    expect(service.findAll).toHaveBeenCalledWith(filters);
  });

  it('passes the doctor ID to the service', async () => {
    const medico = { _id: 'doctor-id', nome: 'Carlos Souza' };
    service.findOne.mockResolvedValue(medico);

    await expect(controller.findOne('doctor-id')).resolves.toBe(medico);
    expect(service.findOne).toHaveBeenCalledWith('doctor-id');
  });
});
