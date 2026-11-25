import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { PacienteService } from './paciente.service.js';
import { Paciente } from './schemas/paciente.schema.js';

describe('PacienteService', () => {
  let service: PacienteService;
  let model: {
    create: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    model = {
      create: vi.fn(),
      find: vi.fn(),
      findById: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getModelToken(Paciente.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
  });

  it('creates a patient and returns the created document', async () => {
    const dto = { cpf: '12345678900', nome: 'Ana Silva', idade: 35 };
    const paciente = { _id: 'patient-id', ...dto };
    model.create.mockResolvedValue(paciente);

    await expect(service.create(dto)).resolves.toBe(paciente);
    expect(model.create).toHaveBeenCalledWith(dto);
  });

  it('converts duplicate CPF errors to a conflict exception', async () => {
    model.create.mockRejectedValue({ code: 11000 });

    await expect(
      service.create({ cpf: '12345678900' }),
    ).rejects.toThrow(new ConflictException('CPF já cadastrado'));
  });

  it('applies patient filters, sorting, and pagination', async () => {
    const pacientes = [{ _id: 'patient-id', nome: 'Ana Silva' }];
    const query = {
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue(pacientes),
    };
    model.find.mockReturnValue(query);

    await expect(
      service.findAll({
        nome: 'ana',
        convenio: 'Particular',
        page: 2,
        limit: 5,
      }),
    ).resolves.toBe(pacientes);

    expect(model.find).toHaveBeenCalledWith({
      convenio: 'Particular',
      nome: { $regex: 'ana', $options: 'i' },
    });
    expect(query.select).toHaveBeenCalledWith('-__v');
    expect(query.sort).toHaveBeenCalledWith({ nome: 1 });
    expect(query.skip).toHaveBeenCalledWith(5);
    expect(query.limit).toHaveBeenCalledWith(5);
  });

  it('finds a patient by ID and excludes the version field', async () => {
    const paciente = { _id: 'patient-id', nome: 'Ana Silva' };
    const query = { select: vi.fn().mockResolvedValue(paciente) };
    model.findById.mockReturnValue(query);

    await expect(service.findOne('patient-id')).resolves.toBe(paciente);
    expect(model.findById).toHaveBeenCalledWith('patient-id');
    expect(query.select).toHaveBeenCalledWith('-__v');
  });

  it('throws NotFoundException when the patient does not exist', async () => {
    const query = { select: vi.fn().mockResolvedValue(null) };
    model.findById.mockReturnValue(query);

    await expect(service.findOne('missing-id')).rejects.toThrow(
      new NotFoundException('Paciente não encontrado'),
    );
  });
});
