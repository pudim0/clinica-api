import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MedicoService } from './medico.service.js';
import { Medico } from './schemas/medico.schema.js';

describe('MedicoService', () => {
  let service: MedicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoService,
        {
          provide: getModelToken(Medico.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
