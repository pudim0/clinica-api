import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { PacienteController } from './paciente.controller.js';
import { PacienteService } from './paciente.service.js';

describe('PacienteController', () => {
  let controller: PacienteController;
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
      controllers: [PacienteController],
      providers: [{ provide: PacienteService, useValue: service }],
    }).compile();

    controller = module.get<PacienteController>(PacienteController);
  });

  it('passes patient creation data to the service', async () => {
    const dto = { cpf: '12345678900', nome: 'Ana Silva', idade: 35 };
    const paciente = { _id: 'patient-id', ...dto };
    service.create.mockResolvedValue(paciente);

    await expect(controller.create(dto)).resolves.toBe(paciente);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('passes patient filters to the service', async () => {
    const filters = { nome: 'Ana', page: 1, limit: 10 };
    const pacientes = [{ _id: 'patient-id', nome: 'Ana Silva' }];
    service.findAll.mockResolvedValue(pacientes);

    await expect(controller.findAll(filters)).resolves.toBe(pacientes);
    expect(service.findAll).toHaveBeenCalledWith(filters);
  });

  it('passes the patient ID to the service', async () => {
    const paciente = { _id: 'patient-id', nome: 'Ana Silva' };
    service.findOne.mockResolvedValue(paciente);

    await expect(controller.findOne('patient-id')).resolves.toBe(paciente);
    expect(service.findOne).toHaveBeenCalledWith('patient-id');
  });
});
