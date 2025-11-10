// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type UserRole = 'admin' | 'staff' | 'customer'; 

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;                     // <- NUEVO

  @Column({ unique: true, nullable: true })
  email: string ;  

  @Column()
  name: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', default: 'staff' })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}

