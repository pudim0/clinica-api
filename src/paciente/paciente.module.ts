import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PacienteController } from './paciente.controller.js';
import { PacienteService } from './paciente.service.js';
import { Paciente, PacienteSchema } from './schemas/paciente.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Paciente.name,
        schema: PacienteSchema,
      },
    ]),
  ],
  controllers: [PacienteController],
  providers: [PacienteService],
})
export class PacienteModule {}