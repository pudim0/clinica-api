import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MedicoDocument = HydratedDocument<Medico>;

@Schema({ collection: 'medicos' })
export class Medico {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  crm: string;

  @Prop({
    required: true,
    trim: true,
  })
  nome: string;

  @Prop({
    required: true,
    enum: [
      'Cardiologia',
      'Ortopedia',
      'Pediatria',
      'Clínica Geral',
    ],
  })
  especialidade: string;

  @Prop({
    required: true,
    min: 0,
  })
  valorConsulta: number;
}

export const MedicoSchema =
  SchemaFactory.createForClass(Medico);