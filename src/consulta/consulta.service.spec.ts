import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { ConsultaService } from './consulta.service.js';
import { Consulta } from './schemas/consulta.schema.js';

describe('ConsultaService', () => {
  let service: ConsultaService;
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
        ConsultaService,
        {
          provide: getModelToken(Consulta.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<ConsultaService>(ConsultaService);
  });

  it('creates an appointment and returns the created document', async () => {
    const dto = {
      codigoAtendimento: 'ATD-0001',
      pacienteId: '665f1a2b3c4d5e6f78901234',
      medicoId: '665f1a2b3c4d5e6f78901235',
      valorCobrado: 250,
      status: 'Agendada',
    };
    const consulta = { _id: 'appointment-id', ...dto };
    model.create.mockResolvedValue(consulta);

    await expect(service.create(dto)).resolves.toBe(consulta);
    expect(model.create).toHaveBeenCalledWith(dto);
  });

  it('converts duplicate appointment codes to a conflict exception', async () => {
    model.create.mockRejectedValue({ code: 11000 });

    await expect(
      service.create({
        codigoAtendimento: 'ATD-0001',
        pacienteId: '665f1a2b3c4d5e6f78901234',
        medicoId: '665f1a2b3c4d5e6f78901235',
        valorCobrado: 250,
        status: 'Agendada',
      }),
    ).rejects.toThrow(
      new ConflictException('Código de atendimento já cadastrado'),
    );
  });

  it('applies appointment filters, sorting, and pagination', async () => {
    const consultas = [{ _id: 'appointment-id', status: 'Agendada' }];
    const query = {
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue(consultas),
    };
    model.find.mockReturnValue(query);

    await expect(
      service.findAll({
        status: 'Agendada',
        minValor: 100,
        maxValor: 300,
        page: 2,
        limit: 10,
      }),
    ).resolves.toBe(consultas);

    expect(model.find).toHaveBeenCalledWith({
      status: 'Agendada',
      valorCobrado: { $gte: 100, $lte: 300 },
    });
    expect(query.select).toHaveBeenCalledWith('-__v');
    expect(query.sort).toHaveBeenCalledWith({ codigoAtendimento: 1 });
    expect(query.skip).toHaveBeenCalledWith(10);
    expect(query.limit).toHaveBeenCalledWith(10);
  });

  it('finds an appointment by ID and excludes the version field', async () => {
    const consulta = { _id: 'appointment-id', status: 'Agendada' };
    const query = { select: vi.fn().mockResolvedValue(consulta) };
    model.findById.mockReturnValue(query);

    await expect(service.findOne('appointment-id')).resolves.toBe(consulta);
    expect(model.findById).toHaveBeenCalledWith('appointment-id');
    expect(query.select).toHaveBeenCalledWith('-__v');
  });

  it('throws NotFoundException when the appointment does not exist', async () => {
    const query = { select: vi.fn().mockResolvedValue(null) };
    model.findById.mockReturnValue(query);

    await expect(service.findOne('missing-id')).rejects.toThrow(
      new NotFoundException('Consulta não encontrada'),
    );
  });
});
