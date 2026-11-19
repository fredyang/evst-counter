import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { analyticsTasks } from './core/analytics.effect';
import { provideEvstStore } from '@evst/ngrx-store';
import { counterTasks } from './counter/store/counter.effects';
import { counterEvst } from './counter/store/counter.feature';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    counterEvst.provide(),
    counterTasks.provide(),
    analyticsTasks.provide(),
    provideEvstStore(),
  ],
};
