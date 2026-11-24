import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MedicoController } from './medico.controller.js';
import { MedicoService } from './medico.service.js';
import { Medico, MedicoSchema } from './schemas/medico.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Medico.name,
        schema: MedicoSchema,
      },
    ]),
  ],
  controllers: [MedicoController],
  providers: [MedicoService],
})
export class MedicoModule {}