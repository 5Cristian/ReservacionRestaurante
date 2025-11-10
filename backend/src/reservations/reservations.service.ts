import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from './reservation.entity';
import { TableEntity } from '../tables/table.entity';
import { Customer } from '../customers/customer.entity';
import { addMinutes } from 'date-fns';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private repo: Repository<Reservation>,
    @InjectRepository(TableEntity) private tables: Repository<TableEntity>,
    @InjectRepository(Customer) private customers: Repository<Customer>,
  ){}

  list(){ return this.repo.find({ order: { date:'ASC' } }); }

  async create(payload: { customerId:number; tableId:number; date:string; partySize:number; notes?:string }){
    const DURATION = parseInt(process.env.RESERVATION_DURATION_MIN || '90', 10);
    const OPEN = parseInt(process.env.OPENING_HOUR || '11', 10);
    const CLOSE = parseInt(process.env.CLOSING_HOUR || '22', 10);

    const table = await this.tables.findOneBy({ id: Number(payload.tableId) });
    if (!table) throw new Error('Table not found');
    if (payload.partySize > table.capacity) throw new Error('Party size exceeds table capacity');

    const start = new Date(payload.date);
    const hour = start.getHours();
    if (hour < OPEN || hour >= CLOSE) throw new Error('Outside business hours');

    const windowStart = addMinutes(start, -DURATION);
    const windowEnd = addMinutes(start, DURATION);
    const existing = await this.repo.find({
      where: {
        table: { id: Number(payload.tableId) },
        status: 'CONFIRMED',
        date: Between(windowStart, windowEnd)
      }
    });
    const overlap = existing.some(r => {
      const endA = addMinutes(start, DURATION);
      const endB = addMinutes(r.date, r.durationMinutes);
      return start < endB && r.date < endA;
    });
    if (overlap) throw new Error('Table already reserved around that time');

    const customer = await this.customers.findOneBy({ id: Number(payload.customerId) });
    if (!customer) throw new Error('Customer not found');

    const newRes = this.repo.create({
      customer, table,
      date: start,
      partySize: Number(payload.partySize),
      durationMinutes: DURATION,
      status: 'CONFIRMED',
      notes: payload.notes || null
    });
    return this.repo.save(newRes);
  }

  async update(id:number, dto: Partial<Reservation>){
    await this.repo.update(id, dto);
    return this.repo.findOneBy({ id });
  }

  async cancel(id:number){
    await this.repo.update(id, { status: 'CANCELLED' });
    return this.repo.findOneBy({ id });
  }

  today(dateStr?:string){
    const base = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
    const start = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0,0,0);
    const end   = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23,59,59);
    return this.repo.find({ where: { date: Between(start, end) }, order: { date:'ASC' } });
  }

  async occupancy(range:'day'|'week'='day', dateStr?:string){
    const base = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
    const start = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0,0,0);
    let end = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23,59,59);
    if (range === 'week'){
      const w = new Date(base); w.setDate(w.getDate()+6);
      end = new Date(w.getFullYear(), w.getMonth(), w.getDate(), 23,59,59);
    }
    const total = await this.repo.count({ where: { date: Between(start, end), status: 'CONFIRMED' } });
    return { range, from: start, to: end, total };
  }
}
