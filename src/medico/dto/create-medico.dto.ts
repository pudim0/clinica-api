import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateMedicoDto {
  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEnum([
    'Cardiologia',
    'Ortopedia',
    'Pediatria',
    'Clínica Geral',
  ])
  especialidade: string;

  @IsNumber()
  @Min(0)
  valorConsulta: number;
}