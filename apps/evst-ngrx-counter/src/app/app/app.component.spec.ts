import { TestBed } from '@angular/core/testing';
import { provideEvstStore } from '@evst/ngrx-store';
import { describe, expect, it } from 'vitest';
import { App } from './app.component';
import { counterEvst } from '../counter/store/counter.evst';

describe('Counter app', () => {
  it('renders the current count and updates it from the counter controls', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideEvstStore(), counterEvst.provide()],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    const count = () => element.querySelector('[aria-label="Current count"]')?.textContent?.trim();
    const click = async (selector: string) => {
      const button = element.querySelector<HTMLButtonElement>(selector);
      expect(button).not.toBeNull();
      button!.click();
      fixture.detectChanges();
      await fixture.whenStable();
    };

    expect(count()).toBe('0');
    await click('[aria-label="Increment counter"]');
    expect(count()).toBe('1');
    await click('[aria-label="Decrement counter"]');
    expect(count()).toBe('0');

    const restoreButton = element.querySelector<HTMLButtonElement>('.restore-control');
    expect(restoreButton).not.toBeNull();
    restoreButton!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(count()).toBe('0');
  });
});
