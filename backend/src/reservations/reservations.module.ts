import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservation } from './reservation.entity';
import { TableEntity } from '../tables/table.entity';
import { Customer } from '../customers/customer.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Reservation, TableEntity, Customer])],
  controllers:[ReservationsController],
  providers:[ReservationsService],
  exports:[ReservationsService, TypeOrmModule]
})
export class ReservationsModule {}
