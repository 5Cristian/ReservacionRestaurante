import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';

@Entity('tables')
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  number: number;

  @Column()
  capacity: number;

  @Column({ nullable: true })
  location?: string;

  @OneToMany(()=>Reservation, r=>r.table)
  reservations: Reservation[];
}
