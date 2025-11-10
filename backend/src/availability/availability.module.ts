import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { TableEntity } from '../tables/table.entity';
import { Reservation } from '../reservations/reservation.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TableEntity, Reservation])],
  controllers:[AvailabilityController],
  providers:[AvailabilityService],
})
export class AvailabilityModule {}
