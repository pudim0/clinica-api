import { Test, TestingModule } from '@nestjs/testing';
import { ConsultaController } from './consulta.controller.js';
import { ConsultaService } from './consulta.service.js';

describe('ConsultaController', () => {
  let controller: ConsultaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultaController],
      providers: [
        {
          provide: ConsultaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ConsultaController>(ConsultaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
