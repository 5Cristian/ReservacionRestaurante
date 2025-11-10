import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports:[ReservationsModule],
  controllers:[ReportsController],
  providers:[ReportsService],
})
export class ReportsModule {}
