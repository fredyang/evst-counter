import { Injectable } from '@angular/core';
import { defer, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  saveCounter(count: number) {
    return defer(() => {
      localStorage.setItem('counter', String(count));
      return of(null);
    });
  }

  restoreCounter() {
    return defer(() => of(Number(localStorage.getItem('counter'))));
  }
}
