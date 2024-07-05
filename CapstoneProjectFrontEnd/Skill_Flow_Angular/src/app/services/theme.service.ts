import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<string>('');
  currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.currentThemeSubject.next(savedTheme);
    document.body.classList.add(savedTheme);
  }

  toggleTheme(isDarkMode: boolean): void {
    const newTheme = isDarkMode ? 'dark' : 'light';
    if (newTheme !== this.currentThemeSubject.value) {
      document.body.classList.remove(this.currentThemeSubject.value);
      document.body.classList.add(newTheme);
      this.currentThemeSubject.next(newTheme);
      localStorage.setItem('theme', newTheme);
    }
  }

  getCurrentTheme(): string {
    return this.currentThemeSubject.value;
  }
}
