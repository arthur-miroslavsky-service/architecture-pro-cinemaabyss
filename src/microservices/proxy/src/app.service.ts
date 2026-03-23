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
    return this.forward(`${this.monolithUrl}${req.originalUrl}`, res);
  }

  async forwardMovies(req: Request, res: Response) {
    const useMoviesService = Math.random() * 100 < this.migrationPercent;
    const baseUrl = useMoviesService ? this.moviesServiceUrl : this.monolithUrl;

    return this.forward(`${baseUrl}${req.originalUrl}`, res);
  }

  private async forward(url: string, res: Response) {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || '';

    res.status(response.status);

    if (contentType.includes('application/json')) {
      const data = (await response.json()) as unknown;
      return res.json(data);
    }

    const text = await response.text();
    return res.send(text);
  }
}
