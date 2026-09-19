import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    // Create a pg Pool configured for Supabase Transaction Pooler (Port 6543)
    const pool = new Pool({
      connectionString,
      ssl: process.env.SUPABASE_CA_CERT
        ? { ca: process.env.SUPABASE_CA_CERT, rejectUnauthorized: true }
        : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

    const adapter = new PrismaPg(pool);

    super({ adapter, log: ['info', 'warn', 'error'] });
    this.pool = pool;

    // Prevent an idle-client error from crashing the process
    this.pool.on('error', (err) => {
      this.logger.error(`Unexpected pg pool error: ${err.message}`);
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected to Supabase database via driver adapter');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    if (!this.pool.ended) {
      await this.pool.end();
    }
    this.logger.log('Prisma disconnected from the database');
  }
}
