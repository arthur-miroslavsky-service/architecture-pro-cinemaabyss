import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';

@Injectable()
export class AppService {
  private readonly monolithUrl =
    process.env.MONOLITH_URL || 'http://monolith:8080';

  private readonly moviesServiceUrl =
    process.env.MOVIES_SERVICE_URL || 'http://movies-service:8081';

  private readonly migrationPercent = Number(
    process.env.MOVIES_MIGRATION_PERCENT || '0',
  );

  async forwardToMonolith(req: Request, res: Response) {
    return this.forward(req, res, this.monolithUrl);
  }

  async forwardMovies(req: Request, res: Response) {
    const useMoviesService = Math.random() * 100 < this.migrationPercent;
    const baseUrl = useMoviesService ? this.moviesServiceUrl : this.monolithUrl;

    return this.forward(req, res, baseUrl);
  }

  private async forward(req: Request, res: Response, baseUrl: string) {
    const url = `${baseUrl}${req.originalUrl}`;

    const response = await fetch(url, {
      method: req.method,
      headers: req.headers as HeadersInit,
      body:
        req.method !== 'GET' && req.method !== 'HEAD'
          ? JSON.stringify(req.body)
          : undefined,
    });

    const contentType = response.headers.get('content-type') || '';

    res.status(response.status);

    if (contentType.includes('application/json')) {
      return res.json(await response.json());
    }

    return res.send(await response.text());
  }
}
