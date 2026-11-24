import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConsultaDocument = HydratedDocument<Consulta>;

@Schema({ collection: 'consultas' })
export class Consulta {
  @Prop({
    required: true,
    unique: true,
  })
  codigoAtendimento: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  pacienteId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  medicoId: Types.ObjectId;

  @Prop({
    required: true,
    min: 0,
  })
  valorCobrado: number;

  @Prop({
    enum: ['Agendada', 'Realizada', 'Cancelada'],
    default: 'Agendada',
  })
  status: string;
}

export const ConsultaSchema =
  SchemaFactory.createForClass(Consulta);