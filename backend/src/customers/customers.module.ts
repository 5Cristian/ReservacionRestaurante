import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
import { Reservation } from '../reservations/reservation.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Customer, Reservation])],
  controllers:[CustomersController],
  providers:[CustomersService],
  exports:[CustomersService, TypeOrmModule]
})
export class CustomersModule {}
