import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pending_users')
export class PendingUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true }) email!: string;
  @Column({ unique: true }) username!: string;

  @Column() name!: string;
  @Column({ nullable: true }) phone!: string | null;

  @Column() passwordHash!: string;

  @CreateDateColumn() createdAt!: Date;
  @Column({ type: 'timestamptz' }) expiresAt!: Date; // p.ej. 24h
}
