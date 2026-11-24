import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Paciente,
  PacienteDocument,
} from './schemas/paciente.schema.js';

type FilterPacienteDto = {
  convenio?: string;
  nome?: string;
  page?: number;
  limit?: number;
};

@Injectable()
export class PacienteService {
  private readonly logger = new Logger(PacienteService.name);

  constructor(
    @InjectModel(Paciente.name)
    private readonly pacienteModel: Model<PacienteDocument>,
  ) {}

  async create(dto: Partial<Paciente>) {
    try {
      const paciente = await this.pacienteModel.create(dto);

      return paciente;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        this.logger.warn('Tentativa de cadastrar CPF duplicado');

        throw new ConflictException('CPF já cadastrado');
      }

      this.logger.error('Erro ao cadastrar paciente', error);

      throw error;
    }
  }

  async findAll(dto: FilterPacienteDto) {
    const {
      convenio,
      nome,
      page = 1,
      limit = 10,
    } = dto;

    const filter: any = {};

    if (convenio) {
      filter.convenio = convenio;
    }

    if (nome) {
      filter.nome = {
        $regex: nome,
        $options: 'i',
      };
    }

    return this.pacienteModel
      .find(filter)
      .select('-__v')
      .sort({ nome: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findOne(id: string) {
    const paciente = await this.pacienteModel
      .findById(id)
      .select('-__v');

    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return paciente;
  }
}