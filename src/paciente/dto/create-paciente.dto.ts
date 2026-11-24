import { from } from 'rxjs';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePacienteDto {
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsInt()
  @Min(0)
  idade: number;

  @IsOptional()
  @IsEnum(['Particular', 'Convênio', 'SUS', 'Outros'])
  convenio?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}