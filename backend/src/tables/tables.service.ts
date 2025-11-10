import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableEntity } from './table.entity';

@Injectable()
export class TablesService {
  constructor(@InjectRepository(TableEntity) private repo: Repository<TableEntity>) {}

  findAll() {
    return this.repo.find({ order: { number: 'ASC' } });
  }

  async create(dto: Partial<TableEntity>) {
    try {
      const entity = this.repo.create(dto);
      return await this.repo.save(entity);
    } catch (e: any) {
      // Postgres duplicate key
      if (e?.code === '23505') {
        throw new ConflictException('El número de mesa ya existe');
      }
      throw e;
    }
  }

  async update(id: number, dto: Partial<TableEntity>) {
    await this.repo.update(id, dto);
    return this.repo.findOneBy({ id });
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
