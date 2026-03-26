import { All, Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health(@Res() res: Response) {
    return res.status(200).json({ status: 'ok' });
  }

  @All(['api/users', 'api/users/*path'])
  async users(@Req() req: Request, @Res() res: Response) {
    return this.appService.forwardToMonolith(req, res);
  }

  @All(['api/movies', 'api/movies/*path'])
  async movies(@Req() req: Request, @Res() res: Response) {
    return this.appService.forwardMovies(req, res);
  }

  @All(['api/payments', 'api/payments/*path'])
  async payments(@Req() req: Request, @Res() res: Response) {
    return this.appService.forwardToMonolith(req, res);
  }

  @All(['api/subscriptions', 'api/subscriptions/*path'])
  async subscriptions(@Req() req: Request, @Res() res: Response) {
    return this.appService.forwardToMonolith(req, res);
  }
}
