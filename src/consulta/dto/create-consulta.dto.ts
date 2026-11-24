import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateConsultaDto {
  @IsString()
  @IsNotEmpty()
  codigoAtendimento: string;

  @IsMongoId()
  pacienteId: string;

  @IsMongoId()
  medicoId: string;

  @IsNumber()
  @Min(0)
  valorCobrado: number;

  @IsEnum(['Agendada', 'Realizada', 'Cancelada'])
  status: string;
}