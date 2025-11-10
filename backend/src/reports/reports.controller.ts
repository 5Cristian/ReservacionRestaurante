import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService){}

  @Get('reservations/today') today(@Query('date') date?:string){ return this.service.today(date); }
  @Get('occupancy') occupancy(@Query('range') range:'day'|'week'='day', @Query('date') date?:string){ 
    return this.service.occupancy(range, date);
  }
}
