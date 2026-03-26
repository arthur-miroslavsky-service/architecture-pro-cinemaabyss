import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/events')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  health() {
    return { status: true };
  }

  @Post('movie')
  @HttpCode(HttpStatus.CREATED)
  async createMovieEvent(@Body() body: unknown) {
    await this.appService.publish('movie-events', body);
    return { status: 'success' };
  }

  @Post('user')
  @HttpCode(HttpStatus.CREATED)
  async createUserEvent(@Body() body: unknown) {
    await this.appService.publish('user-events', body);
    return { status: 'success' };
  }

  @Post('payment')
  @HttpCode(HttpStatus.CREATED)
  async createPaymentEvent(@Body() body: unknown) {
    await this.appService.publish('payment-events', body);
    return { status: 'success' };
  }
}
