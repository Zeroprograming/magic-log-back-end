import { Controller, Get, Headers, Ip } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus(
    @Headers('user-agent') userAgent: string, // Obtiene el User-Agent del cliente
    @Ip() ip: string, // Obtiene la IP del cliente
  ): Record<string, any> {
    return this.appService.getStatus(userAgent, ip);
  }
}
