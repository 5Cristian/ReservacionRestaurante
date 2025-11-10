import { Injectable } from '@nestjs/common';
import { ReservationsService } from '../reservations/reservations.service';

@Injectable()
export class ReportsService {
  constructor(private readonly reservations: ReservationsService){}

  today(date?:string){ return this.reservations.today(date); }
  occupancy(range:'day'|'week'='day', date?:string){ return this.reservations.occupancy(range, date); }
}
