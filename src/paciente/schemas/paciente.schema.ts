import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PacienteDocument = HydratedDocument<Paciente>;

@Schema({ collection: 'pacientes' })
export class Paciente {
    @Prop({ 
        required: true,
        unique: true,
        trim: true
    })
    cpf: string;

    @Prop({
        required:true,
        trim: true,
    })
    nome: string;
    @Prop({
        required: true,
        min: 0,
    })
    idade: number;
    @Prop({
        enum:['Particular', 'Convênio', 'SUS', 'Outros'],
        default: 'Particular',
    })
    convenio: string;
    @Prop({
        default: true
    })
    ativo: boolean;
}
export const PacienteSchema = SchemaFactory.createForClass(Paciente);