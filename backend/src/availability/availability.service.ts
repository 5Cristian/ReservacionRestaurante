import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TableEntity } from '../tables/table.entity';
import { Reservation } from '../reservations/reservation.entity';
import { addMinutes } from 'date-fns';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(TableEntity) private tables: Repository<TableEntity>,
    @InjectRepository(Reservation) private reservations: Repository<Reservation>,
  ){}

  async check(date:string, time:string){
    const DURATION = parseInt(process.env.RESERVATION_DURATION_MIN || '90', 10);
    const OPEN = parseInt(process.env.OPENING_HOUR || '11', 10);
    const CLOSE = parseInt(process.env.CLOSING_HOUR || '22', 10);

    const start = new Date(`${date}T${time}:00`);
    const hour = start.getHours();
    if (hour < OPEN || hour >= CLOSE) return { available: [], occupied: [], message: 'Outside business hours' };

    const all = await this.tables.find({ order: { number:'ASC' } });
    const windowStart = addMinutes(start, -DURATION);
    const windowEnd = addMinutes(start, DURATION);

    const bookings = await this.reservations.find({
      where: { status:'CONFIRMED', date: Between(windowStart, windowEnd) }
    });
    const occupiedIds = new Set(bookings.filter(b => {
      const endB = addMinutes(b.date, b.durationMinutes);
      const endA = addMinutes(start, DURATION);
      return start < endB && b.date < endA;
    }).map(b => b.table.id));

    const available = all.filter(t => !occupiedIds.has(t.id));
    const occupied = all.filter(t => occupiedIds.has(t.id));
    return { available, occupied };
  }
}
