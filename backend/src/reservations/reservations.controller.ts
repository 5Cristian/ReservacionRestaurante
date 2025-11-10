import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService){}

  @Get() getAll(){ return this.service.list(); }
  @Post() create(@Body() body:any){ return this.service.create(body); }
  @Put(':id') update(@Param('id') id:number, @Body() body:any){ return this.service.update(Number(id), body); }
  @Post(':id/cancel') cancel(@Param('id') id:number){ return this.service.cancel(Number(id)); }
}
