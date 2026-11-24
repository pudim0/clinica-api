import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConsultaService } from './consulta.service.js';
import { Consulta } from './schemas/consulta.schema.js';

describe('ConsultaService', () => {
  let service: ConsultaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultaService,
        {
          provide: getModelToken(Consulta.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ConsultaService>(ConsultaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
