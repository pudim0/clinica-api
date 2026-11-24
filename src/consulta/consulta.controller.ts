import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { ConsultaService } from './consulta.service.js';
import { CreateConsultaDto } from './dto/create-consulta.dto.js';
import { FilterConsultaDto } from './dto/filter-consulta.dto.js';

@Controller('consultas')
export class ConsultaController {
  constructor(
    private readonly consultaService: ConsultaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateConsultaDto) {
    return this.consultaService.create(dto);
  }

  @Get()
  async findAll(@Query() dto: FilterConsultaDto) {
    return this.consultaService.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.consultaService.findOne(id);
  }
}