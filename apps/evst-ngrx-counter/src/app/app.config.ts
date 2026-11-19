import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { analyticsEffect } from './core/analytics.effect';
import * as counterEffects from './counter/store/counter.effects';
import { counterFeature } from './counter/store/counter.feature';
import { provideEvstStore } from '@evst/ngrx-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideState(counterFeature),
    provideEffects(counterEffects, { analyticsEffect }),
    provideEvstStore(),
  ],
};
