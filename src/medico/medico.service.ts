import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Medico,
  MedicoDocument,
} from './schemas/medico.schema.js';

import { CreateMedicoDto } from './dto/create-medico.dto.js';
import { FilterMedicoDto } from './dto/filter-medico.dto.js';

@Injectable()
export class MedicoService {
  private readonly logger = new Logger(MedicoService.name);

  constructor(
    @InjectModel(Medico.name)
    private readonly medicoModel: Model<MedicoDocument>,
  ) {}

  async create(dto: CreateMedicoDto) {
    try {
      const medico = await this.medicoModel.create(dto);

      return medico;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        this.logger.warn('Tentativa de cadastrar CRM duplicado');

        throw new ConflictException('CRM já cadastrado');
      }

      this.logger.error('Erro ao cadastrar médico', error);

      throw error;
    }
  }

  async findAll(dto: FilterMedicoDto) {
    const {
      especialidade,
      minValor,
      maxValor,
      page = 1,
      limit = 10,
    } = dto;

    const filter: any = {};

    if (especialidade) {
      filter.especialidade = especialidade;
    }

    if (minValor !== undefined || maxValor !== undefined) {
      filter.valorConsulta = {};

      if (minValor !== undefined) {
        filter.valorConsulta.$gte = minValor;
      }

      if (maxValor !== undefined) {
        filter.valorConsulta.$lte = maxValor;
      }
    }

    return this.medicoModel
      .find(filter)
      .select('-__v')
      .sort({ nome: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findOne(id: string) {
    const medico = await this.medicoModel
      .findById(id)
      .select('-__v');

    if (!medico) {
      throw new NotFoundException('Médico não encontrado');
    }

    return medico;
  }
}