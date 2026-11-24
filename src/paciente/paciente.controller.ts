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

import { PacienteService } from './paciente.service.js';
import { CreatePacienteDto } from './dto/create-paciente.dto.js';
import { FilterPacienteDto } from './dto/filter-paciente.dto.js';

@Controller('pacientes')
export class PacienteController {
  constructor(
    private readonly pacienteService: PacienteService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePacienteDto) {
    return this.pacienteService.create(dto);
  }

  @Get()
  async findAll(@Query() dto: FilterPacienteDto) {
    return this.pacienteService.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pacienteService.findOne(id);
  }
}