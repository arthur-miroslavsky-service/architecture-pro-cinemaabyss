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

  private toFetchHeaders(headers: Request['headers']): Headers {
    const normalizedHeaders = new Headers();
    const blockedHeaders = new Set([
      'host',
      'connection',
      'content-length',
      'transfer-encoding',
    ]);

    for (const [key, value] of Object.entries(headers)) {
      const normalizedKey = key.toLowerCase();

      if (blockedHeaders.has(normalizedKey) || value === undefined) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          normalizedHeaders.append(key, item);
        }
        continue;
      }

      normalizedHeaders.set(key, value);
    }

    return normalizedHeaders;
  }

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
    const body =
      req.method !== 'GET' && req.method !== 'HEAD'
        ? JSON.stringify(req.body)
        : undefined;

    const response = await fetch(url, {
      method: req.method,
      headers: this.toFetchHeaders(req.headers),
      body,
    });

    const contentType = response.headers.get('content-type') || '';

    res.status(response.status);

    if (contentType.includes('application/json')) {
      return res.json(await response.json());
    }

    return res.send(await response.text());
  }
}
