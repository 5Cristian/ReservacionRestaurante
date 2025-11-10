import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService){}

  @Get() getAll(){ return this.service.findAll(); }
  @Post() create(@Body() body:any){ return this.service.create(body); }
  @Get(':id/history') history(@Param('id') id:number){ return this.service.history(Number(id)); }
}
