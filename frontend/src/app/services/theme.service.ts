import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme = signal<'dark' | 'light'>('dark');

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('sb_theme') as 'dark' | 'light';
      if (savedTheme) {
        this.setTheme(savedTheme);
      } else {
        // Default to dark theme as per modern SaaS aesthetics
        this.setTheme('dark');
      }
    }
  }

  toggleTheme() {
    const next = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(theme: 'dark' | 'light') {
    this.currentTheme.set(theme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('sb_theme', theme);
    }
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }
}
