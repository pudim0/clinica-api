import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PacienteService } from './paciente.service.js';
import { Paciente } from './schemas/paciente.schema.js';

describe('PacienteService', () => {
  let service: PacienteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getModelToken(Paciente.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
