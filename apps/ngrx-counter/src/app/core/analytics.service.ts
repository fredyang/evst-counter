import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  track(eventName: string, properties?: Record<string, unknown>) {
    console.log(`[Analytics Track] Event: ${eventName}`, properties);
  }
}
