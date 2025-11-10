import 'dotenv/config';
import { DataSource } from 'typeorm';
import { TableEntity } from './tables/table.entity';
import { Customer } from './customers/customer.entity';
import { Reservation } from './reservations/reservation.entity';

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'restaurant',
  entities: [TableEntity, Customer, Reservation],
  synchronize: true,
});

async function seed(){
  await ds.initialize();
  const tableRepo = ds.getRepository(TableEntity);
  const customerRepo = ds.getRepository(Customer);
  const resRepo = ds.getRepository(Reservation);

  const tables = await tableRepo.save([
    tableRepo.create({ number:1, capacity:2, location:'Ventana' }),
    tableRepo.create({ number:2, capacity:4, location:'Sala principal' }),
    tableRepo.create({ number:3, capacity:4, location:'Sala principal' }),
    tableRepo.create({ number:4, capacity:6, location:'Terraza' }),
    tableRepo.create({ number:5, capacity:8, location:'VIP' }),
  ]);

  const juan = await customerRepo.save(customerRepo.create({ name:'Juan Pérez', email:'juan@example.com', phone:'555-1111' }));
  await customerRepo.save(customerRepo.create({ name:'María López', email:'maria@example.com', phone:'555-2222' }));

  const today = new Date();
  const demoDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0, 0);
  await resRepo.save(resRepo.create({
    customer: juan,
    table: tables[1],
    date: demoDate,
    partySize: 2,
    status: 'CONFIRMED',
    notes: 'Ventana si es posible'
  }));

  console.log('Seed done.');
  await ds.destroy();
}

seed().catch(e=>{ console.error(e); process.exit(1); });
