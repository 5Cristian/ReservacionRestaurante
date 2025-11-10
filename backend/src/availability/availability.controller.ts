import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly service: AvailabilityService){}

  @Get()
  check(@Query('date') date:string, @Query('time') time:string){
    if (!date || !time) return { error: 'date and time are required' };
    return this.service.check(date, time);
  }
}
