import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModuleCustom } from './config/config.module';
import { ConfigService } from './config/config.service';

import { TablesModule } from './tables/tables.module';
import { CustomersModule } from './customers/customers.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AvailabilityModule } from './availability/availability.module';
import { ReportsModule } from './reports/reports.module';
import { MailModule } from './mail/mail.module';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigModuleCustom,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModuleCustom],            
      inject: [ConfigService],                  
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.dbHost,
        port: cfg.dbPort,
        username: cfg.dbUser,
        password: cfg.dbPass,
        database: cfg.dbName,
        autoLoadEntities: true,
        synchronize: true, // solo DEV
      }),
    }),
    TablesModule,
    CustomersModule,
    ReservationsModule,
    AvailabilityModule,
    ReportsModule,
    MailModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}

