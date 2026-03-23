import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health(@Res() res: Response) {
    return res.status(200).json({ status: 'ok' });
  }

  @Get('api/users')
  async getUsers(@Req() req: Request, @Res() res: Response) {
    return this.appService.forwardToMonolith(req, res);
  }

  @Get('api/movies')
  async getMovies(@Req() req: Request, @Res() res: Response) {
    return this.appService.forwardMovies(req, res);
  }
}
