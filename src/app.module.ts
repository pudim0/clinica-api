import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PacienteModule } from './paciente/paciente.module.js';
import { MedicoModule } from './medico/medico.module.js';
import { ConsultaModule } from './consulta/consulta.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),

    PacienteModule,
    MedicoModule,
    ConsultaModule,
  ],
})
export class AppModule {}