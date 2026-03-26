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

  @All('api/users*')
  async users(@Req() req: Request, @Res() res: Response) {
    return this.appService.forwardToMonolith(req, res);
  }

  @All('api/movies*')
  async movies(@Req() req: Request, @Res() res: Response) {
    return this.appService.forwardMovies(req, res);
  }

  @All('api/payments*')
  async payments(@Req() req: Request, @Res() res: Response) {
    return this.appService.forwardToMonolith(req, res);
  }

  @All('api/subscriptions*')
  async subscriptions(@Req() req: Request, @Res() res: Response) {
    return this.appService.forwardToMonolith(req, res);
  }
}
