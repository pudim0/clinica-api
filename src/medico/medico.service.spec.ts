import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { MedicoService } from './medico.service.js';
import { Medico } from './schemas/medico.schema.js';

describe('MedicoService', () => {
  let service: MedicoService;
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
        MedicoService,
        {
          provide: getModelToken(Medico.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
  });

  it('creates a doctor and returns the created document', async () => {
    const dto = {
      crm: 'CRM12345',
      nome: 'Carlos Souza',
      especialidade: 'Cardiologia',
      valorConsulta: 250,
    };
    const medico = { _id: 'doctor-id', ...dto };
    model.create.mockResolvedValue(medico);

    await expect(service.create(dto)).resolves.toBe(medico);
    expect(model.create).toHaveBeenCalledWith(dto);
  });

  it('converts duplicate CRM errors to a conflict exception', async () => {
    model.create.mockRejectedValue({ code: 11000 });

    await expect(
      service.create({
        crm: 'CRM12345',
        nome: 'Carlos Souza',
        especialidade: 'Cardiologia',
        valorConsulta: 250,
      }),
    ).rejects.toThrow(new ConflictException('CRM já cadastrado'));
  });

  it('applies doctor filters, sorting, and pagination', async () => {
    const medicos = [{ _id: 'doctor-id', nome: 'Carlos Souza' }];
    const query = {
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue(medicos),
    };
    model.find.mockReturnValue(query);

    await expect(
      service.findAll({
        especialidade: 'Cardiologia',
        minValor: 100,
        maxValor: 300,
        page: 3,
        limit: 5,
      }),
    ).resolves.toBe(medicos);

    expect(model.find).toHaveBeenCalledWith({
      especialidade: 'Cardiologia',
      valorConsulta: { $gte: 100, $lte: 300 },
    });
    expect(query.select).toHaveBeenCalledWith('-__v');
    expect(query.sort).toHaveBeenCalledWith({ nome: 1 });
    expect(query.skip).toHaveBeenCalledWith(10);
    expect(query.limit).toHaveBeenCalledWith(5);
  });

  it('finds a doctor by ID and excludes the version field', async () => {
    const medico = { _id: 'doctor-id', nome: 'Carlos Souza' };
    const query = { select: vi.fn().mockResolvedValue(medico) };
    model.findById.mockReturnValue(query);

    await expect(service.findOne('doctor-id')).resolves.toBe(medico);
    expect(model.findById).toHaveBeenCalledWith('doctor-id');
    expect(query.select).toHaveBeenCalledWith('-__v');
  });

  it('throws NotFoundException when the doctor does not exist', async () => {
    const query = { select: vi.fn().mockResolvedValue(null) };
    model.findById.mockReturnValue(query);

    await expect(service.findOne('missing-id')).rejects.toThrow(
      new NotFoundException('Médico não encontrado'),
    );
  });
});
