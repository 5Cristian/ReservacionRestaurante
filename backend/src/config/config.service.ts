import 'dotenv/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get port() { return parseInt(process.env.PORT || '4000', 10); }
  get openingHour() { return parseInt(process.env.OPENING_HOUR || '11', 10); }
  get closingHour() { return parseInt(process.env.CLOSING_HOUR || '22', 10); }
  get duration() { return parseInt(process.env.RESERVATION_DURATION_MIN || '90', 10); }

  // DB
  get dbHost() { return process.env.DB_HOST || 'localhost'; }
  get dbPort() { return parseInt(process.env.DB_PORT || '5432', 10); }
  get dbUser() { return process.env.DB_USERNAME || 'postgres'; }
  get dbPass() { return process.env.DB_PASSWORD || 'postgres'; }
  get dbName() { return process.env.DB_DATABASE || 'restaurant'; }

  // Email
  get emailHost(){ return process.env.EMAIL_HOST; }
  get emailPort(){ return parseInt(process.env.EMAIL_PORT || '587', 10); }
  get emailUser(){ return process.env.EMAIL_USER; }
  get emailPass(){ return process.env.EMAIL_PASS; }
  get emailFrom(){ return process.env.EMAIL_FROM || 'reservas@example.com'; }
}

