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

import { MedicoService } from './medico.service.js';
import { CreateMedicoDto } from './dto/create-medico.dto.js';
import { FilterMedicoDto } from './dto/filter-medico.dto.js';

@Controller('medicos')
export class MedicoController {
  constructor(
    private readonly medicoService: MedicoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateMedicoDto) {
    return this.medicoService.create(dto);
  }

  @Get()
  async findAll(@Query() dto: FilterMedicoDto) {
    return this.medicoService.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicoService.findOne(id);
  }
}