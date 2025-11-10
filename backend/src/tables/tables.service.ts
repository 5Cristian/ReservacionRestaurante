import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableEntity } from './table.entity';

@Injectable()
export class TablesService {
  constructor(@InjectRepository(TableEntity) private repo: Repository<TableEntity>){}

  findAll(){ return this.repo.find({ order: { number: 'ASC' } }); }
  create(dto: Partial<TableEntity>){ return this.repo.save(this.repo.create(dto)); }
  async update(id:number, dto: Partial<TableEntity>){
    await this.repo.update(id, dto);
    return this.repo.findOneBy({ id });
  }
  async remove(id:number){
    await this.repo.delete(id);
    return { ok: true };
  }
}
