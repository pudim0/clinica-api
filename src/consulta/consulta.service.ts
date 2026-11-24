import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Consulta,
  ConsultaDocument,
} from './schemas/consulta.schema.js';

import { CreateConsultaDto } from './dto/create-consulta.dto.js';
import { FilterConsultaDto } from './dto/filter-consulta.dto.js';

@Injectable()
export class ConsultaService {
  private readonly logger = new Logger(ConsultaService.name);

  constructor(
    @InjectModel(Consulta.name)
    private readonly consultaModel: Model<ConsultaDocument>,
  ) {}

  async create(dto: CreateConsultaDto) {
    try {
      const consulta = await this.consultaModel.create(dto);

      return consulta;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        this.logger.warn(
          'Tentativa de cadastrar código de atendimento duplicado',
        );

        throw new ConflictException(
          'Código de atendimento já cadastrado',
        );
      }

      this.logger.error(
        'Erro ao cadastrar consulta',
        error,
      );

      throw error;
    }
  }

  async findAll(dto: FilterConsultaDto) {
    const {
      status,
      minValor,
      maxValor,
      page = 1,
      limit = 10,
    } = dto;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (
      minValor !== undefined ||
      maxValor !== undefined
    ) {
      filter.valorCobrado = {};

      if (minValor !== undefined) {
        filter.valorCobrado.$gte = minValor;
      }

      if (maxValor !== undefined) {
        filter.valorCobrado.$lte = maxValor;
      }
    }

    return this.consultaModel
      .find(filter)
      .select('-__v')
      .sort({ codigoAtendimento: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findOne(id: string) {
    const consulta = await this.consultaModel
      .findById(id)
      .select('-__v');

    if (!consulta) {
      throw new NotFoundException(
        'Consulta não encontrada',
      );
    }

    return consulta;
  }
}