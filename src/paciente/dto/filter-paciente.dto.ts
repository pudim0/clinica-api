import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterPacienteDto {
    @IsOptional()
    @IsEnum(['Particular', 'Convênio', 'SUS', 'Outros'])
    convenio?: string;

    @IsOptional()
    @IsString()
    nome?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    page: number = 1;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    limit: number = 10;
}