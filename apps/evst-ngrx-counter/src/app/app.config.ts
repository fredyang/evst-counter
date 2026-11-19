import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideEvstStore } from '@evst/ngrx-store';
import { counterEvst } from './counter/store/counter.evst';
import { analyticsTasks } from './core/analytics.tasks';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    counterEvst.provide(),
    analyticsTasks.provide(),
    provideEvstStore(),
  ],
};
