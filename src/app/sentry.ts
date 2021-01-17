import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular';
import { APP_INITIALIZER, ErrorHandler } from '@angular/core';


export const sentryErrorHandler = {
  provide: ErrorHandler,
  useValue: Sentry.createErrorHandler({
    showDialog: false,
  }),
};


export const sentryTracer = {
  provide: Sentry.TraceService,
  deps: [Router],
};


export const sentryInitializer = {
  provide: APP_INITIALIZER,
  useFactory: () => () => {},
  deps: [Sentry.TraceService],
  multi: true,
};
