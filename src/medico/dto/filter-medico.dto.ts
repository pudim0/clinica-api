import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FilterMedicoDto {
  @IsOptional()
  @IsEnum([
    'Cardiologia',
    'Ortopedia',
    'Pediatria',
    'Clínica Geral',
  ])
  especialidade?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minValor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxValor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}