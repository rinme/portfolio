export class ThemeManager {
  current = $state<'light' | 'dark'>('dark');

  init() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('theme-preference') as 'light' | 'dark' | null;
    if (stored) {
      this.set(stored);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.set('light');
    } else {
      this.set('dark');
    }
  }

  set(val: 'light' | 'dark') {
    this.current = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-preference', val);
      if (val === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  toggle() {
    this.set(this.current === 'dark' ? 'light' : 'dark');
  }
}

export const theme = new ThemeManager();
