import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(userAgent: string, ip: string): Record<string, any> {
    return {
      status: 'API is running',
      timestamp: new Date().toISOString(),
      user: {
        userAgent,
        ip,
      },
    };
  }
}
