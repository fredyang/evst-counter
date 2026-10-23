import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  track(eventName: string, properties?: Record<string, any>) {
    console.log(`[Analytics Track] Event: ${eventName}`, properties);
  }
}
