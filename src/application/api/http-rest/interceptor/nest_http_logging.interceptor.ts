import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { catchError, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class NestHttpLoggingInterceptor implements NestInterceptor {

  public intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const request: Request = context.switchToHttp().getRequest();
    const requestStartDate = moment().local();

    return next.handle().pipe(
      tap((): void => {
        const requestFinishDate = moment().local();

        const message: string =
          `Method: ${request.method}; ` +
          `Path: ${request.path}; ` +
          `SpentTime: ${requestFinishDate.milliseconds() - requestStartDate.milliseconds()}ms`;

        Logger.log(message, NestHttpLoggingInterceptor.name);
      }),
      catchError((err, caught): Observable<any> => {
        Logger.error(err, NestHttpLoggingInterceptor.name);
        return of(caught);
      })
    );
  }
}
