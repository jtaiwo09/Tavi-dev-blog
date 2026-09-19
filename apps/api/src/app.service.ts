import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getHealthStatus() {
    // Keep database connection warm
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  // Cron job triggers every 14 minutes
  @Cron('0 */14 * * * *')
  async handleSelfPing() {
    const appUrl = process.env.APP_URL;

    if (!appUrl) {
      this.logger.warn(
        'APP_URL is not set in environment variables. Skipping self-ping.',
      );
      return;
    }

    try {
      this.logger.log(
        `Executing self-ping cron to keep instance alive: ${appUrl}/health`,
      );
      const response = await axios.get(`${appUrl}/health`);
      this.logger.log(`Self-ping successful: Status ${response.status}`);
    } catch (error: any) {
      this.logger.error(`Self-ping failed: ${error.message}`);
    }
  }
}
