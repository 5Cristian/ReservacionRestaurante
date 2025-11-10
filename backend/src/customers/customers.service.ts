import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { Reservation } from '../reservations/reservation.entity';

@Injectable()
export class CustomersService {
  constructor(@InjectRepository(Customer) private repo: Repository<Customer>,
              @InjectRepository(Reservation) private resRepo: Repository<Reservation>){}

  findAll(){ return this.repo.find({ order: { name:'ASC' } }); }
  create(dto: Partial<Customer>){ return this.repo.save(this.repo.create(dto)); }

  async history(customerId:number){
    const customer = await this.repo.findOneBy({ id: customerId });
    if (!customer) throw new Error('Customer not found');
    const history = await this.resRepo.find({
      where: { customer: { id: customerId } },
      relations: ['table'],
      order: { date: 'DESC' }
    });
    return { customer, history };
  }
}
