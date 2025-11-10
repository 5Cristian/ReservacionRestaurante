import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TableEntity } from '../tables/table.entity';
import { Customer } from '../customers/customer.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ default: 90 })
  durationMinutes: number;

  @Column()
  partySize: number;

  @Column({ default: 'CONFIRMED' })
  status: string;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @ManyToOne(()=>TableEntity, t=>t.reservations, { eager: true })
  table: TableEntity;

  @ManyToOne(()=>Customer, c=>c.reservations, { eager: true })
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
