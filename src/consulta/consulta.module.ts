import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConsultaController } from './consulta.controller.js';
import { ConsultaService } from './consulta.service.js';
import {
  Consulta,
  ConsultaSchema,
} from './schemas/consulta.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Consulta.name,
        schema: ConsultaSchema,
      },
    ]),
  ],
  controllers: [ConsultaController],
  providers: [ConsultaService],
})
export class ConsultaModule {}